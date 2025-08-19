import { IsInt, IsString, Min, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { SubmitScoreDto } from '../../../shared/DTOs';

export class SubmitScoreValidatorDTO implements SubmitScoreDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  nickname: string;

  @IsInt()
  @Min(0)
  score: number;
}