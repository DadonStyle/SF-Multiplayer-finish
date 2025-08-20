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
  IconButton,
} from "@mui/material";
import { gameApi } from "../api/leaderboardApi";
import { toast } from "react-toastify";
import { GameOverEvent } from "../../../shared/types";

interface GameOverModalProps {
  open: boolean;
  score: number;
  gameOverData?: GameOverEvent | null;
  onResetBoard: () => void;
  title?: string;
  subtitle?: string;
  gameId: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  open,
  score,
  gameOverData,
  onResetBoard,
  title = "Game Over!",
  subtitle = "No valid shape/color combination available",
  gameId,
}) => {
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

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
      await gameApi.submitScore(nickname.trim(), score, gameId);
      setSubmitted(true);
      toast.success("Score submitted successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit score";

      if (errorMessage === "Another player already submitted group name") {
        toast.info(errorMessage);
        handleNewRound();
        return;
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewRound = () => {
    setNickname("");
    setSubmitted(false);
    setError(null);
    setIsMinimized(false);
    onResetBoard();
  };

  return createPortal(
    <>
      <Modal 
        open={open && !isMinimized} 
        onClose={() => {}} 
        aria-labelledby="game-over-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid",
            borderColor: "error.main",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            width: "100%", 
            mb: 1 
          }}>
            <IconButton
              onClick={() => setIsMinimized(true)}
              size="small"
              sx={{ 
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold",
                width: 32,
                height: 32,
                borderRadius: "50%"
              }}
            >
              −
            </IconButton>
          </Box>
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
          {gameOverData?.reason || subtitle}
        </Typography>

        {!submitted ? (
          <Box sx={{ mb: 3, width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Submit Team Score
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
      </Modal>
      {open && isMinimized && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <IconButton
            onClick={() => setIsMinimized(false)}
            sx={{
              bgcolor: "error.main",
              color: "white",
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "bold",
              width: 48,
              height: 48,
              borderRadius: "50%",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            +
          </IconButton>
        </Box>
      )}
    </>,
    document.body
  );
};
