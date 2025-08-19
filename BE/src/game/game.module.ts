import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameStore } from './game.store';

@Module({
  controllers: [],
  providers: [GameService, GameGateway, GameStore],
  exports: [GameService, GameStore],
})
export class GameModule {}