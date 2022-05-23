import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { difference, pick, assign } from 'lodash';

import { MeetEntity } from './meet.entity';
import { ParticipantEntity } from './participant.entity';
import { CreateMeetDto } from './dto/create-meet.dto';
import { UpdateMeetDto } from './dto/update-meet.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MeetService {
  constructor(
    @InjectRepository(MeetEntity)
    private readonly meetRepository: Repository<MeetEntity>,

    @InjectRepository(ParticipantEntity)
    private readonly participantRespository: Repository<ParticipantEntity>,

    private readonly mailService: MailService,
  ) {}

  async getMeets(paginationOptions: IPaginationOptions): Promise<Pagination<MeetEntity>> {
    const qb = this.meetRepository
      .createQueryBuilder('meet')
      .leftJoinAndSelect('meet.participants', 'participant')
      .orderBy({
        'meet.createdAt': 'DESC',
      });
    return paginate<MeetEntity>(qb, paginationOptions);
  }

  async getMeet(id: string): Promise<MeetEntity> {
    return await this.findMeet(id);
  }

  async createMeet(data: CreateMeetDto): Promise<MeetEntity> {
    // create meet
    let meet = this.meetRepository.create({
      name: data.name,
      scheduledTime: data.scheduledTime,
    });
    await this.meetRepository.save(meet);

    // create participants
    await this.participantRespository
      .createQueryBuilder()
      .insert()
      .values(
        data.participantEmails.map((participantEmail) => ({
          email: participantEmail,
          meetId: meet.id,
        })),
      )
      .execute();

    // reload meet with participants
    meet = await this.findMeet(meet.id);

    // send invitation to participants
    await this.sendingMeetInvitations(meet);

    return meet;
  }

  async updateMeet(id: string, data: Partial<UpdateMeetDto>): Promise<MeetEntity> {
    let meet = await this.findMeet(id);

    // update meet
    meet = assign(meet, pick(data, ['name', 'scheduledTime']));
    await this.meetRepository.save(meet);

    // update meet participants
    if (data.participantEmails && data.participantEmails.length) {
      const createdParticipantEmails = meet.participants.map((participant) => participant.email);
      const updatedParticipantEmails = data.participantEmails;

      const removedParticipantEmails = difference(createdParticipantEmails, updatedParticipantEmails);
      const addedParticipantEmails = difference(updatedParticipantEmails, createdParticipantEmails);

      if (removedParticipantEmails.length) {
        await this.participantRespository
          .createQueryBuilder()
          .delete()
          .where('participants.email IN (:...emails)', {
            emails: removedParticipantEmails,
          })
          .execute();
      }

      if (addedParticipantEmails.length) {
        await this.participantRespository
          .createQueryBuilder()
          .insert()
          .values(
            addedParticipantEmails.map((participantEmail) => ({
              email: participantEmail,
              meetId: meet.id,
            })),
          )
          .execute();
      }
    }

    // reload meet with participants
    meet = await this.findMeet(meet.id);

    // send invitation to participants
    await this.sendingMeetInvitations(meet);

    return meet;
  }

  async getParticipant(meetId: string, id: string): Promise<ParticipantEntity> {
    return await this.findParticipant(meetId, id);
  }

  async updateParticipant(meetId: string, id: string, data: Partial<UpdateParticipantDto>): Promise<ParticipantEntity> {
    let participant = await this.getParticipant(meetId, id);
    participant = assign(participant, pick(data, ['name']));
    await this.participantRespository.save(participant);

    return participant;
  }

  async deleteMeet(id: string): Promise<MeetEntity> {
    const meet = await this.findMeet(id);

    return this.meetRepository.remove(meet);
  }

  /**
   * Private methods
   */
  private async findMeet(id: string): Promise<MeetEntity> {
    const meet = await this.meetRepository.findOne(id, { relations: ['participants'] });

    if (!meet) {
      throw new HttpException('Not found meet', HttpStatus.NOT_FOUND);
    }

    return meet;
  }

  private async findParticipant(meetId: string, id: string): Promise<ParticipantEntity> {
    const participant = await this.participantRespository.findOne({ id: id, meetId: meetId });

    if (!participant) {
      throw new HttpException('Not found participant', HttpStatus.NOT_FOUND);
    }

    return participant;
  }

  private async sendingMeetInvitations(meet: MeetEntity): Promise<void> {
    const participants = meet.participants || (await this.participantRespository.find({ where: { meetId: meet.id } }));

    const sendingInvitations = participants.map((participant) => {
      return this.mailService.sendMeetInvitationEmail(meet, participant);
    });
    await Promise.all(sendingInvitations);
  }
}
