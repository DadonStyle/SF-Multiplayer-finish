import { Injectable, Logger } from '@nestjs/common';
import { LeaderboardEntry } from '../../../shared/types';
import { LEADERBOARD_SIZE } from '../../../shared/constants';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);
  private leaderboard: LeaderboardEntry[] = [];

  async getTopScores(): Promise<LeaderboardEntry[]> {
    return this.leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, LEADERBOARD_SIZE);
  }

  async submitScore(
    nickname: string,
    score: number,
  ): Promise<LeaderboardEntry[]> {
    const newEntry: LeaderboardEntry = {
      nickname: nickname.trim(),
      score,
      timestamp: new Date().toISOString(),
    };

    this.leaderboard.push(newEntry);

    const topEntries = this.leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, LEADERBOARD_SIZE);

    this.leaderboard = topEntries;

    this.logger.log(`Score submitted: ${nickname} - ${score}`);
    return topEntries;
  }
}
