import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { MeetService } from './meet.service';
import { MeetEntity } from './meet.entity';
import { ParticipantEntity } from './participant.entity';
import { CreateMeetDto } from './dto/create-meet.dto';
import { UpdateMeetDto } from './dto/update-meet.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('meets')
@UseInterceptors(ClassSerializerInterceptor)
export class MeetController {
  constructor(private readonly meetService: MeetService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(@Query('page') page = '1', @Query('limit') limit = '25'): Promise<Pagination<MeetEntity>> {
    const pageNumber = parseInt(page);
    const limitNumber = Math.min(parseInt(limit), 100);

    return await this.meetService.getMeets({ page: pageNumber, limit: limitNumber });
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<MeetEntity> {
    return await this.meetService.getMeet(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: CreateMeetDto): Promise<MeetEntity> {
    return await this.meetService.createMeet(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: Partial<UpdateMeetDto>): Promise<MeetEntity> {
    return await this.meetService.updateMeet(id, data);
  }

  @Put(':meetId/participants/:id')
  async updateParticipant(
    @Param('meetId') meetId: string,
    @Param('id') id: string,
    @Body() data: Partial<UpdateParticipantDto>,
  ): Promise<ParticipantEntity> {
    return await this.meetService.updateParticipant(meetId, id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async destroy(@Param('id') id: string): Promise<MeetEntity> {
    return await this.meetService.deleteMeet(id);
  }
}
