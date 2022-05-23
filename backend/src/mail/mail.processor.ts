import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { MeetInvitationEmailJobData } from './mail.interface';

@Processor('mail')
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  @Process('sendMeetInvitationEmail')
  async sendMeetInvitationEmail(job: Job<MeetInvitationEmailJobData>): Promise<any> {
    this.logger.log(`Sending meet invitation email to '${job.data.participantEmail}'`);

    const clientOrigin = this.configService.get<string>('CLIENT_ORIGIN');

    try {
      return await this.mailerService.sendMail({
        template: 'meetInvitation',
        context: {
          meetName: job.data.meetName,
          meetUrl: `${clientOrigin}/rooms/${job.data.meetId}/participants/${job.data.participantId}`,
        },
        subject: '[TELECONSULTPOC] You have an invitation to join a meet',
        to: job.data.participantEmail,
      });
    } catch (error) {
      this.logger.error(`Failed to send meet invitation email to '${job.data.participantEmail}'`, error.stack);
      throw error;
    }
  }
}
