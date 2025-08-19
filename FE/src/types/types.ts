import { GameCell } from "../../../shared/types";
export interface GameCellProps {
  cell: GameCell;
  onClick: () => void;
  disabled: boolean;
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

