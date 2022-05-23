import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ParticipantEntity } from './participant.entity';

@Entity('meets')
export class MeetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  scheduledTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ParticipantEntity, (participant) => participant.meet, { onDelete: 'CASCADE' })
  participants: ParticipantEntity[];
}
