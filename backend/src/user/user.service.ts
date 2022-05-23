import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email: email });
  }

  async getProfile(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
