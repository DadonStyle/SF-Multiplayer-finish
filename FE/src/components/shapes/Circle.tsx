import React from 'react';

interface CircleProps {
  style?: React.CSSProperties;
}

export const Circle: React.FC<CircleProps> = ({ style }) => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={style}>
      <circle cx="20" cy="20" r="15" fill="currentColor" stroke="#333" strokeWidth="1"/>
    </svg>
  );
};