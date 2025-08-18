import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { GameState } from './game.types';

@ApiTags('game')
@Controller('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  @Get('state')
  @ApiOperation({ summary: 'Get current game state' })
  @ApiResponse({
    status: 200,
    description: 'Current game state returned successfully',
  })
  getGameState(): GameState {
    return this.gameService.getGameState();
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset the game (admin/dev only)' })
  @ApiResponse({ status: 200, description: 'Game reset successfully' })
  resetGame(): GameState {
    this.logger.log('Game reset requested via REST API');
    return this.gameService.resetGame();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck(): { ok: boolean; timestamp: string } {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
    };
  }
}
