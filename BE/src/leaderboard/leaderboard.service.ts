import { Injectable, Logger } from '@nestjs/common';
import { LeaderboardEntry } from '../../../shared/types';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);
  private leaderboard: LeaderboardEntry[] = [];

  async getTopScores(): Promise<LeaderboardEntry[]> {
    return this.leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
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
      .slice(0, 10);

    this.leaderboard = topEntries;

    this.logger.log(`Score submitted: ${nickname} - ${score}`);
    return topEntries;
  }
}
