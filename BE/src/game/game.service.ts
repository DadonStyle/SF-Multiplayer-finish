import { Injectable, Logger } from '@nestjs/common';
import { GameStore } from './game.store';
import { AsyncMutex } from './mutex.util';
import { Color, GameCell, GameState, Shape } from '../../../shared/types';
import { MoveResult } from './game.types';
import { COLORS, COOLDOWN_TURNS, GRID_COLS, GRID_ROWS, SHAPES, TOTAL_CELLS } from '../../../shared/constants';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private readonly moveMutex = new AsyncMutex();

  constructor(private readonly gameStore: GameStore) {
    this.initializeNewGame();
  }

  getGameState(): GameState {
    return this.gameStore.getGameState();
  }

  async applyClick(position: number): Promise<MoveResult> {
    const release = await this.moveMutex.acquire();

    try {
      const currentState = this.gameStore.getGameState();

      if (currentState.isGameOver) {
        return { success: false, error: 'Game is over' };
      }

      if (position < 0 || position >= TOTAL_CELLS) {
        return { success: false, error: 'Invalid position' };
      }

      const cell = currentState.cells[position];
      if (cell.cooldown > 0) {
        return { success: false, error: 'Cell is in cooldown' };
      }

      const validMove = this.generateValidMove(currentState.cells, position);
      if (!validMove) {
        const newState: GameState = {
          ...currentState,
          isGameOver: true,
          status: 'over',
          version: currentState.version + 1,
        };
        this.gameStore.updateGameState(newState);
        return {
          success: false,
          gameState: newState,
          error: 'No valid moves available - game over',
        };
      }

      const newCells = [...currentState.cells];
      newCells[position] = {
        ...validMove,
        cooldown: COOLDOWN_TURNS,
      };

      this.decrementCooldowns(newCells);

      const newState: GameState = {
        cells: newCells,
        score: currentState.score + 1,
        isGameOver: false,
        currentTurn: currentState.currentTurn + 1,
        version: currentState.version + 1,
        status: 'playing',
      };

      this.gameStore.updateGameState(newState);
      this.logger.log(
        `Move applied at position ${position}. Score: ${newState.score}, Turn: ${newState.currentTurn}`,
      );

      return { success: true, gameState: newState };
    } finally {
      release();
    }
  }

  resetGame(): GameState {
    this.gameStore.resetGame();
    this.initializeNewGame();
    const newState = this.gameStore.getGameState();
    this.logger.log('Game reset');
    return newState;
  }

  private initializeNewGame(): void {
    const board: GameCell[] = Array(TOTAL_CELLS).fill(null);

    for (let position = 0; position < TOTAL_CELLS; position++) {
      const { forbiddenShapes, forbiddenColors } = this.getForbiddenOptions(
        board,
        position,
      );

      const availableShapes = this.getAvailableOptions(SHAPES, forbiddenShapes);
      const availableColors = this.getAvailableOptions(COLORS, forbiddenColors);

      const shape =
        availableShapes[Math.floor(Math.random() * availableShapes.length)];
      const color =
        availableColors[Math.floor(Math.random() * availableColors.length)];

      board[position] = { position, shape, color, cooldown: 0 };
    }

    const initialState: GameState = {
      cells: board,
      score: 0,
      isGameOver: false,
      currentTurn: 0,
      version: 1,
      status: 'playing',
    };

    this.gameStore.updateGameState(initialState);
    this.logger.log('New game initialized');
  }

  private generateValidMove(
    board: GameCell[],
    position: number,
  ): GameCell | null {
    const currentCell = board[position];
    const { forbiddenShapes, forbiddenColors } = this.getForbiddenOptions(
      board,
      position,
    );

    forbiddenShapes.add(currentCell.shape);
    forbiddenColors.add(currentCell.color);

    const availableShapes = this.getAvailableOptions(SHAPES, forbiddenShapes);
    const availableColors = this.getAvailableOptions(COLORS, forbiddenColors);

    if (availableShapes.length === 0 || availableColors.length === 0) {
      return null;
    }

    const shape =
      availableShapes[Math.floor(Math.random() * availableShapes.length)];
    const color =
      availableColors[Math.floor(Math.random() * availableColors.length)];

    return { position, shape, color, cooldown: 0 };
  }

  private getAvailableOptions<T>(allOptions: T[], forbidden: Set<T>): T[] {
    return allOptions.filter((option) => !forbidden.has(option));
  }

  private positionToRowCol(position: number): [number, number] {
    return [Math.floor(position / GRID_COLS), position % GRID_COLS];
  }

  private rowColToPosition(row: number, col: number): number {
    return row * GRID_COLS + col;
  }

  private getAdjacentPositions(position: number): number[] {
    const [row, col] = this.positionToRowCol(position);
    const adjacent: number[] = [];

    if (row > 0) adjacent.push(this.rowColToPosition(row - 1, col));
    if (row < GRID_ROWS - 1) adjacent.push(this.rowColToPosition(row + 1, col));
    if (col > 0) adjacent.push(this.rowColToPosition(row, col - 1));
    if (col < GRID_COLS - 1) adjacent.push(this.rowColToPosition(row, col + 1));

    return adjacent;
  }

  private getForbiddenOptions(
    board: GameCell[],
    position: number,
  ): { forbiddenShapes: Set<Shape>; forbiddenColors: Set<Color> } {
    const forbiddenShapes = new Set<Shape>();
    const forbiddenColors = new Set<Color>();

    const adjacentPositions = this.getAdjacentPositions(position);
    for (const adjPosition of adjacentPositions) {
      const adjCell = board[adjPosition];
      if (adjCell) {
        forbiddenShapes.add(adjCell.shape);
        forbiddenColors.add(adjCell.color);
      }
    }

    return { forbiddenShapes, forbiddenColors };
  }

  private decrementCooldowns(cells: GameCell[]): void {
    for (const cell of cells) {
      if (cell.cooldown > 0) {
        cell.cooldown = Math.max(0, cell.cooldown - 1) as any;
      }
    }
  }
}
