import { Injectable } from '@nestjs/common';
import { GameState } from '../../../shared/types';
import { TOTAL_CELLS } from '../../../shared/constants';

@Injectable()
export class GameStore {
  private gameState: GameState;

  constructor() {
    this.initializeGame();
  }

  getGameState(): GameState {
    return { ...this.gameState, cells: [...this.gameState.cells] };
  }

  updateGameState(newState: GameState): void {
    this.gameState = { ...newState, cells: [...newState.cells] };
  }

  resetGame(): void {
    this.initializeGame();
  }

  private initializeGame(): void {
    this.gameState = {
      cells: Array(TOTAL_CELLS).fill(null),
      score: 0,
      isGameOver: false,
      currentTurn: 0,
      version: 0,
      status: 'playing',
    };
  }
}