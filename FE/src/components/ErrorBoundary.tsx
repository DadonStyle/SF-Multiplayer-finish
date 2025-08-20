import React, { Component, ReactNode } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: 3,
            bgcolor: "background.default",
          }}
        >
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The application encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </Typography>
          </Alert>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleRefresh}
              sx={{ minWidth: 140 }}
            >
              Refresh Page
            </Button>
            <Button
              variant="outlined"
              onClick={this.handleReset}
              sx={{ minWidth: 140 }}
            >
              Try Again
            </Button>
          </Box>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                maxWidth: 800,
                overflow: "auto",
              }}
            >
              <Typography variant="subtitle2" color="error" gutterBottom>
                Error Details (Development):
              </Typography>
              <Typography
                variant="body2"
                component="pre"
                sx={{ fontSize: "0.75rem", whiteSpace: "pre-wrap" }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}