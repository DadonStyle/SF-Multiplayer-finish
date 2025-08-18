import React from 'react';

interface TriangleProps {
  style?: React.CSSProperties;
}

export const Triangle: React.FC<TriangleProps> = ({ style }) => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={style}>
      <polygon points="20,5 35,30 5,30" fill="currentColor" stroke="#333" strokeWidth="1"/>
    </svg>
  );
};