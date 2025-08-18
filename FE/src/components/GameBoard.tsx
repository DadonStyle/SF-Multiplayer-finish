import React from "react";
import { Box } from "@mui/material";
import { GameState } from "../types/types";
import { GameCell } from "./GameCell";

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (position: number) => void;
  disabled?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellClick,
  disabled = false,
}) => {
  const handleCellClick = (position: number) => {
    if (disabled) return;
    const cell = gameState.cells[position];
    if (cell && cell.cooldown > 0) return;
    if (gameState.isGameOver || gameState.status === "over") return;
    onCellClick(position);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: 1,
        padding: 2,
        bgcolor: "grey.100",
        borderRadius: 3,
        border: "3px solid",
        borderColor: "primary.main",
      }}
    >
      {gameState.cells.map((cell) => (
        <GameCell
          key={cell.position}
          cell={cell}
          onClick={() => handleCellClick(cell.position)}
          disabled={disabled || cell.cooldown > 0 || gameState.isGameOver}
        />
      ))}
    </Box>
  );
};
