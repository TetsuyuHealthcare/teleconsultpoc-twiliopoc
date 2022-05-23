import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';

import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { MeetModule } from '../meet/meet.module';

@Module({
  imports: [
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        accountSid: configService.get('TWILIO_ACCOUNT_SID'),
        authToken: configService.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    MeetModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
