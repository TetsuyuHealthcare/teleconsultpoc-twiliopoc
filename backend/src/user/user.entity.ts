import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

import { bcryptConstants } from './constant';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Exclude()
  private password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterLoad()
  private loadPassword(): void {
    this.password = this.passwordHash;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password !== this.passwordHash) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, bcryptConstants.saltRounds);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.passwordHash);
  }
}
