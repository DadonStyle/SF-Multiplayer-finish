import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GameService } from './game.service';
import { ClickMoveValidatorDTO } from './game.validators';
import { GameOverEvent } from '../../../shared/types';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.join('game-room');

    const currentState = this.gameService.getGameState();
    client.emit('state', currentState);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getState')
  handleGetState(@ConnectedSocket() client: Socket) {
    const currentState = this.gameService.getGameState();
    client.emit('state', currentState);
  }

  @SubscribeMessage('click')
  @Throttle({ default: { limit: 10, ttl: 1000 } })
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleClick(
    @MessageBody() moveData: ClickMoveValidatorDTO,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Click received from ${client.id} at position ${moveData.position}`,
    );

    try {
      const result = await this.gameService.applyClick(moveData.position);
      if (result.success && result.gameState) {
        this.server.to('game-room').emit('state', result.gameState);
      } else {
        client.emit('moveError', { error: result.error });
      }
      if (result?.gameState?.isGameOver) {
        const gameOverEventObj: GameOverEvent = {
          finalScore: result.gameState.score,
          totalTurns: result.gameState.currentTurn,
        };
        this.server.to('game-room').emit('gameOver', gameOverEventObj);
      }
    } catch (error) {
      this.logger.error(`Error processing click: ${error.message}`);
      client.emit('moveError', { error: 'Internal server error' });
    }
  }

  @SubscribeMessage('reset')
  handleReset(@ConnectedSocket() client: Socket) {
    this.logger.log(`Reset requested by ${client.id}`);

    try {
      const newState = this.gameService.resetGame();
      this.server.to('game-room').emit('state', newState);
      this.server.to('game-room').emit('gameReset');
    } catch (error) {
      this.logger.error(`Error resetting game: ${error.message}`);
      client.emit('resetError', { error: 'Failed to reset game' });
    }
  }
}
