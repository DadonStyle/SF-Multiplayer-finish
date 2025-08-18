import { useEffect, useState } from "react";
import { GameState, GameOverEvent, MoveRequest } from "../types/types";
import { useSocket } from "./useSocket";

const initialGameState: GameState = {
  cells: [],
  score: 0,
  isGameOver: false,
  currentTurn: 0,
  version: 0,
  status: "playing",
};

export const useGameState = () => {
  const { emit, on, off, connectionStatus } = useSocket();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverData, setGameOverData] = useState<GameOverEvent | null>(null);
  const [pendingMove, setPendingMove] = useState(false);

  const handleStateUpdate = (data: unknown) => {
    const newState = data as GameState;
    setGameState(newState);
    setIsGameOver(newState.isGameOver || newState.status === "over");
    setPendingMove(false);
  };

  const handleGameOver = (data: unknown) => {
    const gameOverData = data as GameOverEvent;
    setIsGameOver(true);
    setGameOverData(gameOverData);
    setPendingMove(false);
  };

  const handleMoveError = () => {
    setPendingMove(false);
  };

  const handleGameReset = () => {
    setIsGameOver(false);
    setGameOverData(null);
    setPendingMove(false);
  };

  useEffect(() => {
    on("state", handleStateUpdate);
    on("gameOver", handleGameOver);
    on("moveError", handleMoveError);
    on("gameReset", handleGameReset);

    return () => {
      off("state", handleStateUpdate);
      off("gameOver", handleGameOver);
      off("moveError", handleMoveError);
      off("gameReset", handleGameReset);
    };
  }, []);

  const makeMove = (position: number) => {
    if (!connectionStatus.connected) return;
    if (pendingMove) return;
    if (isGameOver) return;
    const cell = gameState.cells[position];
    if (cell && cell.cooldown > 0) {
      return;
    }

    setPendingMove(true);
    const moveRequest: MoveRequest = { position };
    emit("click", moveRequest);
  };

  const resetGame = () => {
    if (!connectionStatus.connected) {
      return;
    }

    emit("reset");
  };

  return {
    gameState,
    isGameOver,
    gameOverData,
    pendingMove,
    connectionStatus,
    makeMove,
    resetGame,
  };
};
