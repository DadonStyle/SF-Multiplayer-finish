import { IsInt, IsString, Min, Max, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { TOTAL_CELLS } from '../../../shared/constants';

export class ClickMoveDto {
  @IsInt()
  @Min(0)
  @Max(TOTAL_CELLS - 1)
  position: number;
}

export class SubmitScoreDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  nickname: string;

  @IsInt()
  @Min(0)
  score: number;
}