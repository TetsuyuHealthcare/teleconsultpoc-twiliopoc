import { IsOptional, IsString, IsEmail, IsDate, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMeetDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  readonly scheduledTime: Date;

  @ArrayMinSize(1) // some how requirement need a meet with only one
  @IsEmail({}, { each: true })
  readonly participantEmails: string[];
}
