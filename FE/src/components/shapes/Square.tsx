import React from 'react';

interface SquareProps {
  style?: React.CSSProperties;
}

export const Square: React.FC<SquareProps> = ({ style }) => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={style}>
      <rect x="5" y="5" width="30" height="30" fill="currentColor" stroke="#333" strokeWidth="1"/>
    </svg>
  );
};