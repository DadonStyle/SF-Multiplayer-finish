import axios from 'axios';
import { LeaderboardEntry } from '../../../shared/types';

const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://your-production-domain.com' 
  : 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
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
    try {
      const response = await apiClient.get<LeaderboardEntry[]>('/leaderboard');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  async submitScore(nickname: string, score: number): Promise<LeaderboardEntry[]> {
    try {
      const request: Omit<LeaderboardEntry, 'timestamp'> = { nickname, score };
      const response = await apiClient.post<LeaderboardEntry[]>('/leaderboard', request);
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

};