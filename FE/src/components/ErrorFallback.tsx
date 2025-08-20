import React from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 400,
        padding: 4,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon
        sx={{
          fontSize: 64,
          color: "error.main",
          mb: 2,
        }}
      />

      <Typography variant="h5" gutterBottom color="error">
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {message}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {resetError && (
          <Button variant="outlined" onClick={resetError} sx={{ minWidth: 120 }}>
            Try Again
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ minWidth: 120 }}
        >
          Refresh
        </Button>
      </Box>

      {process.env.NODE_ENV === "development" && error && (
        <Alert severity="error" sx={{ mt: 3, maxWidth: 600, textAlign: "left" }}>
          <Typography variant="subtitle2" gutterBottom>
            Debug Information:
          </Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: "0.75rem" }}>
            {error.message}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};