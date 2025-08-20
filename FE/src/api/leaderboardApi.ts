import axios from 'axios';
import { LeaderboardEntry } from '../../../shared/types';
import { SubmitScoreDto } from '../../../shared/DTOs';
import { API_TIMEOUT } from '../../../shared/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://api.yourdomain.com' 
    : 'http://localhost:3000');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'An error occurred'
    );
  }
);

export const gameApi = {
  async fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get<LeaderboardEntry[]>('/leaderboard');
    return response.data || [];
  },

  async submitScore(nickname: string, score: number, gameId: string): Promise<LeaderboardEntry[]> {
    const request: SubmitScoreDto = { nickname, score, gameId };
    const response = await apiClient.post<LeaderboardEntry[]>('/leaderboard', request);
    return response.data || [];
  },

};