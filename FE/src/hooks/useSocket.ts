import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ConnectionStatus } from "../types/types";

export const useSocket = (serverUrl: string = "http://localhost:3000") => {
  const socketRef = useRef<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    connecting: true,
    error: null,
  });

  useEffect(() => {
    const socket = io(`${serverUrl}/game`, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionStatus({
        connected: true,
        connecting: false,
        error: null,
      });

      socket.emit("getState");
    });

    socket.on("disconnect", (reason) => {
      setConnectionStatus({
        connected: false,
        connecting: false,
        error: `Disconnected: ${reason}`,
      });
    });

    socket.on("connect_error", (error) => {
      setConnectionStatus({
        connected: false,
        connecting: false,
        error: error.message || "Connection failed",
      });
    });

    socket.on("reconnect", () => {
      setConnectionStatus({
        connected: true,
        connecting: false,
        error: null,
      });

      socket.emit("getState");
    });

    socket.on("reconnecting", () => {
      setConnectionStatus({
        connected: false,
        connecting: true,
        error: null,
      });
    });

    socket.on("reconnect_error", () => {
      setConnectionStatus({
        connected: false,
        connecting: false,
        error: "Reconnection failed",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  const emit = (event: string, data?: unknown) => {
    if (socketRef.current && connectionStatus.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: ((data: unknown) => void) | (() => void)) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: ((data: unknown) => void) | (() => void)) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    connectionStatus,
    emit,
    on,
    off,
  };
};
