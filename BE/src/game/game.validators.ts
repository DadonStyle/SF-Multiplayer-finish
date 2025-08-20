import { IsInt, Min, Max } from 'class-validator';
import { TOTAL_CELLS } from '../../../shared/constants';
import { ClickMoveDto } from '../../../shared/DTOs';

export class ClickMoveValidatorDTO implements ClickMoveDto {
  @IsInt()
  @Min(0)
  @Max(TOTAL_CELLS - 1)
  position: number;
}
