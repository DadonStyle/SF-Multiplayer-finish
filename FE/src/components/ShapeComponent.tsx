import React from "react";
import { Box, Typography } from "@mui/material";
import SquareIcon from "../assets/icons/square.svg?react";
import DiamondIcon from "../assets/icons/diamond.svg?react";
import CircleIcon from "../assets/icons/circle.svg?react";
import TriangleIcon from "../assets/icons/triangle.svg?react";
import { COLOR_MAP } from "../constants/constants";

export const ShapeComponent: React.FC<{
  shape: string;
  color: string;
  cooldown: number;
}> = ({ shape, color, cooldown }) => {
  const style = {
    color: COLOR_MAP[color as keyof typeof COLOR_MAP],
    width: 40,
    height: 40,
  };

  const renderShape = () => {
    switch (shape) {
      case "triangle":
        return <TriangleIcon style={style} />;
      case "square":
        return <SquareIcon style={style} />;
      case "diamond":
        return <DiamondIcon style={style} />;
      case "circle":
        return <CircleIcon style={style} />;
      default:
        return null;
    }
  };

  if (cooldown > 0) {
    return (
      <Box sx={{ position: "relative", width: 40, height: 40 }}>
        <Box sx={{ opacity: 0.4 }}>{renderShape()}</Box>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "50%",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "12px",
              lineHeight: 1,
            }}
          >
            {cooldown}
          </Typography>
        </Box>
      </Box>
    );
  }

  return renderShape();
};