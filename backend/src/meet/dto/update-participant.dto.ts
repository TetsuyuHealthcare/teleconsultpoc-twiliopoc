import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateParticipantDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
