import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { MeetEntity } from './meet.entity';

@Entity('participants')
export class ParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  meetId: string;

  @ManyToOne(() => MeetEntity, (meet) => meet.participants)
  meet: MeetEntity;
}
