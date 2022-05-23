import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { MeetEntity } from '../meet/meet.entity';
import { ParticipantEntity } from '../meet/participant.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue('mail')
    private readonly mailQueue: Queue,
  ) {}

  async sendMeetInvitationEmail(meet: MeetEntity, participant: ParticipantEntity): Promise<void> {
    try {
      await this.mailQueue.add('sendMeetInvitationEmail', {
        meetId: meet.id,
        meetName: meet.name,
        participantId: participant.id,
        participantEmail: participant.email,
      });
    } catch (error) {
      this.logger.error('Error on queueing sendMeetInvitationEmail', error.stack);
      throw error;
    }
  }
}
