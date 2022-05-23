import {
  Controller,
  UseGuards,
  Get,
  Post,
  Req,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthUserResponse } from './auth.interface';
import { CurrentUser } from './current-user.decorator';
import { UserEntity } from '../user/user.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request): Promise<AuthUserResponse> {
    const authUser = req.user as UserEntity;
    const token = this.authService.createToken(authUser);

    const { id, email } = authUser;
    const user = { id, email, token, role: 'admin' };

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@CurrentUser('id') currentUserId: string): Promise<UserEntity> {
    return await this.authService.getProfile(currentUserId);
  }
}
