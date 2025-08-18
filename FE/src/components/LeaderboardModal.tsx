import React from 'react';
import { createPortal } from 'react-dom';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LeaderboardList } from './LeaderboardList';

interface LeaderboardModalProps {
  open: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  open,
  onClose,
}) => {
  return createPortal(
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="leaderboard-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          position: 'relative',
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          outline: 'none',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography
            id="leaderboard-modal-title"
            variant="h4"
            component="h2"
            fontWeight="bold"
            color="primary.main"
          >
            🏆 Leaderboard
          </Typography>
          
          <IconButton
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            aria-label="Close leaderboard"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Leaderboard Content */}
        <Box sx={{ mb: 3 }}>
          <LeaderboardList
            autoRefresh={true}
            showTitle={false}
            maxHeight={500}
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            size="large"
            sx={{ minWidth: 120 }}
          >
            Close
          </Button>
        </Box>

        {/* Info Text */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 2,
            fontStyle: 'italic',
          }}
        >
          Compete with players from around the world!
        </Typography>
      </Paper>
    </Modal>,
    document.body
  );
};