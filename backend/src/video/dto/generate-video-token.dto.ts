import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateVideoTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly meetId: string;

  @IsString()
  @IsNotEmpty()
  readonly participantId: string;
}
