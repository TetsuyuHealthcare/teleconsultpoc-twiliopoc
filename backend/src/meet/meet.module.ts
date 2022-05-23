import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';

import { MeetEntity } from './meet.entity';
import { ParticipantEntity } from './participant.entity';
import { MeetController } from './meet.controller';
import { MeetService } from './meet.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetEntity, ParticipantEntity]), MailModule],
  controllers: [MeetController],
  providers: [MeetService],
  exports: [MeetService],
})
export class MeetModule {}
