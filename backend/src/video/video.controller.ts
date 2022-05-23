import { Controller, Post, Body } from '@nestjs/common';
import { VideoService } from './video.service';

import { TokenResponse } from './video.interface';
import { GenerateVideoTokenDto } from './dto/generate-video-token.dto';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('token')
  async generateToken(@Body() data: GenerateVideoTokenDto): Promise<TokenResponse> {
    return await this.videoService.generateToken(data);
  }
}
