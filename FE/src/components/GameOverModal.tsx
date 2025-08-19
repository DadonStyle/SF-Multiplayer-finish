import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { GameOverEvent } from "../types/types";
import { gameApi } from "../api/leaderboardApi";
import { toast } from "react-toastify";

interface GameOverModalProps {
  open: boolean;
  score: number;
  gameOverData?: GameOverEvent | null;
  onResetBoard: () => void;
  title?: string;
  subtitle?: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  open,
  score,
  gameOverData,
  onResetBoard,
  title = "Game Over!",
  subtitle = "No valid shape/color combination available",
}) => {
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitScore = async () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }

    if (nickname.trim().length < 1 || nickname.trim().length > 20) {
      setError("Nickname must be between 1 and 20 characters");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await gameApi.submitScore(nickname.trim(), score);
      setSubmitted(true);
      toast.success("Score submitted successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit score";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewRound = () => {
    setNickname("");
    setSubmitted(false);
    setError(null);
    onResetBoard();
  };

  return createPortal(
    <Modal open={open} onClose={() => {}} aria-labelledby="game-over-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid",
          borderColor: "error.main",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography
          id="game-over-title"
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "error.main",
            mb: 2,
          }}
        >
          {title}
        </Typography>

        <Typography variant="h5" sx={{ mb: 1 }}>
          Final Score: {score}
        </Typography>

        {gameOverData && (
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Total Turns: {gameOverData.totalTurns}
          </Typography>
        )}

        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          {subtitle}
        </Typography>

        {!submitted ? (
          <Box sx={{ mb: 3, width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Submit Your Score
            </Typography>

            <TextField
              fullWidth
              label="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              error={!!error}
              helperText={error}
              disabled={submitting}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 20 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitScore}
                disabled={submitting || !nickname.trim()}
                startIcon={submitting ? <CircularProgress size={16} /> : null}
                sx={{ minWidth: 120 }}
              >
                {submitting ? "Submitting..." : "Submit Score"}
              </Button>

              <Button
                variant="outlined"
                onClick={handleNewRound}
                disabled={submitting}
              >
                Skip & New Round
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Score submitted successfully!
            </Alert>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleNewRound}
              sx={{ minWidth: 150 }}
            >
              New Round
            </Button>
          </Box>
        )}
      </Box>
    </Modal>,
    document.body
  );
};
