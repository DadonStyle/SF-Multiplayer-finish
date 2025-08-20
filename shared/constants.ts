import { Shape, Color } from "./types";

export const SHAPES: Shape[] = ["triangle", "square", "diamond", "circle"];
export const COLORS: Color[] = ["red", "green", "blue", "yellow"];
export const GRID_ROWS = 3;
export const GRID_COLS = 6;
export const TOTAL_CELLS = GRID_ROWS * GRID_COLS;
export const COOLDOWN_TURNS = 3;
export const LEADERBOARD_SIZE = 10;
export const API_TIMEOUT = 5000;
export const LEADERBOARD_REFRESH_INTERVAL = 30000;