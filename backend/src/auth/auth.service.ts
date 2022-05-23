import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async getProfile(userId: string): Promise<UserEntity> {
    return await this.userService.getProfile(userId);
  }

  async authenticateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);

    if (user && (await user.comparePassword(password))) {
      return user;
    }

    return null;
  }

  createToken(user: UserEntity): string {
    return this.jwtService.sign({ id: user.id, email: user.email });
  }
}
