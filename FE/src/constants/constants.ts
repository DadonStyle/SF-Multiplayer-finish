import { Shape, Color } from "../types/types";

export const SHAPES: Shape[] = ["triangle", "square", "diamond", "circle"];
export const COLORS: Color[] = ["red", "green", "blue", "yellow"];
export const GRID_ROWS = 3;
export const GRID_COLS = 6;
export const TOTAL_CELLS = GRID_ROWS * GRID_COLS;
export const COOLDOWN_TURNS = 3;

export const COLOR_MAP = {
  red: "#f44336",
  green: "#4caf50",
  blue: "#2196f3",
  yellow: "#ffeb3b",
};