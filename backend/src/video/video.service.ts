import { jwt } from 'twilio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TokenResponse } from './video.interface';
import { GenerateVideoTokenDto } from './dto/generate-video-token.dto';
import { MeetService } from '../meet/meet.service';

const { AccessToken } = jwt;
const { VideoGrant } = AccessToken;

@Injectable()
export class VideoService {
  constructor(private readonly meetService: MeetService, private readonly configService: ConfigService) {}

  async generateToken(data: GenerateVideoTokenDto): Promise<TokenResponse> {
    // verify participant first
    const participant = await this.meetService.getParticipant(data.meetId, data.participantId);

    // Collect twilio credentials
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const apiKey = this.configService.get<string>('TWILIO_API_KEY');
    const apiSecret = this.configService.get<string>('TWILIO_API_SECRET');

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const identity = `${participant.id}__${participant.name}`;
    const accessToken = new AccessToken(accountSid, apiKey, apiSecret, { identity: identity });

    // Grant token access to the Video API features
    const videoaGrant = new VideoGrant();
    accessToken.addGrant(videoaGrant);

    return {
      identity: identity,
      token: accessToken.toJwt(),
    };
  }
}
