import React from "react";
import { Box } from "@mui/material";
import { GameCellProps } from "../types/types";
import { ShapeComponent } from "./ShapeComponent";

export const GameCell: React.FC<GameCellProps> = ({
  cell,
  onClick,
  disabled,
}) => {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 80,
        height: 80,
        border: "2px solid #ddd",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        bgcolor: disabled ? "grey.100" : "white",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: disabled ? "grey.100" : "grey.50",
          borderColor: disabled ? "#ddd" : "primary.main",
        },
      }}
    >
      <ShapeComponent
        shape={cell.shape}
        color={cell.color}
        cooldown={cell.cooldown}
      />
    </Box>
  );
};
