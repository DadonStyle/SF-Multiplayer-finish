export type Shape = "triangle" | "square" | "diamond" | "circle";
export type Color = "red" | "green" | "blue" | "yellow";
export type CooldownState = 0 | 1 | 2 | 3;
export type GameStatus = "playing" | "over";

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

export interface GameCellProps {
  cell: GameCell;
  onClick: () => void;
  disabled: boolean;
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  timestamp: string;
}

export interface ConnectionStatus {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

export interface MoveRequest {
  position: number;
}

export interface GameOverEvent {
  finalScore: number;
  totalTurns: number;
}

