export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};
