export type Shape = 'triangle' | 'square' | 'diamond' | 'circle';
export type Color = 'red' | 'green' | 'blue' | 'yellow';
export type CooldownState = 0 | 1 | 2 | 3;
export type GameStatus = 'playing' | 'over';

export interface GameCell {
  position: number;
  shape: Shape;
  color: Color;
  cooldown: CooldownState;
}

export interface GameState {
  cells: GameCell[];
  score: number;
  isGameOver: boolean;
  currentTurn: number;
  version: number;
  status: GameStatus;
}

export interface Position {
  row: number;
  col: number;
}

export interface MoveResult {
  success: boolean;
  gameState?: GameState;
  error?: string;
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  timestamp: Date;
}

export const SHAPES: Shape[] = ['triangle', 'square', 'diamond', 'circle'];
export const COLORS: Color[] = ['red', 'green', 'blue', 'yellow'];
export const GRID_ROWS = 3;
export const GRID_COLS = 6;
export const TOTAL_CELLS = GRID_ROWS * GRID_COLS;
export const COOLDOWN_TURNS = 3;