import { GameState } from '../../../shared/types';

export interface Position {
  row: number;
  col: number;
}

export interface MoveResult {
  success: boolean;
  gameState?: GameState;
  error?: string;
}
