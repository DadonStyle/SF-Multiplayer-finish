import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { SubmitScoreDto } from '../game/game.validators';
import { LeaderboardEntry } from '../game/game.types';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  private readonly logger = new Logger(LeaderboardController.name);

  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get top 10 scores' })
  @ApiResponse({ status: 200, description: 'Top scores returned successfully' })
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.leaderboardService.getTopScores();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new score' })
  @ApiBody({ type: SubmitScoreDto })
  @ApiResponse({ status: 201, description: 'Score submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async submitScore(
    @Body() submitScoreDto: SubmitScoreDto,
  ): Promise<LeaderboardEntry[]> {
    this.logger.log(
      `Score submission: ${submitScoreDto.nickname} - ${submitScoreDto.score}`,
    );
    return this.leaderboardService.submitScore(
      submitScoreDto.nickname,
      submitScoreDto.score,
    );
  }
}
