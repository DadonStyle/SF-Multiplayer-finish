import React, { useState } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import { LeaderboardOutlined as LeaderboardIcon } from "@mui/icons-material";
import { GameBoard } from "../../components/GameBoard";
import { GameOverModal } from "../../components/GameOverModal";
import { LeaderboardModal } from "../../components/LeaderboardModal";
import { useGameState } from "../../hooks/useGameState";

export const GamePage: React.FC = () => {
  const {
    gameState,
    isGameOver,
    gameOverData,
    pendingMove,
    connectionStatus,
    makeMove,
    resetGame,
  } = useGameState();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <Box maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
          gap: 3,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
          }}
        >
          Multiplayer Grid Game
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Chip
            label={connectionStatus.connected ? "Connected" : "Connected"}
            color={connectionStatus.connected ? "success" : "error"}
            size="small"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Score: {gameState.score}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<LeaderboardIcon />}
            onClick={() => setShowLeaderboard(true)}
            sx={{ height: "fit-content" }}
          >
            Leaderboard
          </Button>
        </Box>

        {isGameOver && (
          <GameOverModal
            open={isGameOver}
            score={gameState.score}
            gameOverData={gameOverData}
            onResetBoard={resetGame}
            gameId={gameState.gameId}
          />
        )}

        <LeaderboardModal
          open={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />

        <GameBoard
          gameState={gameState}
          onCellClick={makeMove}
          disabled={!connectionStatus.connected || pendingMove}
        />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Turn: {gameState.currentTurn}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            maxWidth: 600,
          }}
        >
          <Typography variant="h6" gutterBottom>
            How to Play:
          </Typography>
          <Typography variant="body2" component="div">
            • Click any cell to randomly change its shape and color
            <br />
            • New shape and color must be different from adjacent cells
            <br />
            • Each click gives +1 point and puts the cell on 3-turn cooldown
            <br />
            • Game ends when no valid moves remain
            <br />• Adjacent means up, down, left, right (not diagonals)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
