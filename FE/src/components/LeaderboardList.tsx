import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { gameApi } from "../api/leaderboardApi";
import { formatScore, formatTimestamp } from "../utils/utils";
import { LeaderboardEntry } from "../../../shared/types";
import { LEADERBOARD_REFRESH_INTERVAL } from "../../../shared/constants";

interface LeaderboardListProps {
  autoRefresh?: boolean;
  showTitle?: boolean;
  maxHeight?: number;
}

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  autoRefresh = false,
  showTitle = true,
  maxHeight = 400,
}) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gameApi.fetchLeaderboard();
      setScores(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load leaderboard";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    if (autoRefresh) {
      const interval = setInterval(fetchLeaderboard, LEADERBOARD_REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "gold";
      case 2:
        return "silver";
      case 3:
        return "#CD7F32";
      default:
        return "text.secondary";
    }
  };

  if (loading && scores.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading leaderboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {showTitle && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <TrophyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              Leaderboard
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={
              loading ? <CircularProgress size={16} /> : <RefreshIcon />
            }
            onClick={fetchLeaderboard}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {scores.length === 0 && !loading && !error ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No scores yet. Be the first to play!
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ maxHeight, overflow: "auto" }}>
          <List sx={{ p: 0 }}>
            {scores.map((entry, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;

              return (
                <React.Fragment
                  key={`${entry.nickname}-${entry.timestamp}-${index}`}
                >
                  <ListItem
                    sx={{
                      py: 2,
                      backgroundColor: isTopThree
                        ? "rgba(255, 215, 0, 0.1)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" width="100%">
                      <Box
                        sx={{
                          minWidth: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            color: getRankColor(rank),
                            fontSize: isTopThree ? "1.2rem" : "1rem",
                          }}
                        >
                          {getRankIcon(rank)}
                        </Typography>
                      </Box>

                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={isTopThree ? "bold" : "medium"}
                              sx={{ fontSize: isTopThree ? "1.1rem" : "1rem" }}
                            >
                              {entry.nickname}
                            </Typography>
                            <Chip
                              label={formatScore(entry.score)}
                              color={isTopThree ? "primary" : "default"}
                              variant={isTopThree ? "filled" : "outlined"}
                              size={isTopThree ? "medium" : "small"}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(entry.timestamp)}
                          </Typography>
                        }
                      />
                    </Box>
                  </ListItem>
                  {index < scores.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}

      {scores.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          Top {scores.length} scores shown • Updates automatically
        </Typography>
      )}
    </Box>
  );
};
