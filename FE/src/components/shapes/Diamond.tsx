import React from 'react';

interface DiamondProps {
  style?: React.CSSProperties;
}

export const Diamond: React.FC<DiamondProps> = ({ style }) => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={style}>
      <polygon points="20,5 35,20 20,35 5,20" fill="currentColor" stroke="#333" strokeWidth="1"/>
    </svg>
  );
};