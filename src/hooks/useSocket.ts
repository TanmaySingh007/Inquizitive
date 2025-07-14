import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Get socket URL from environment variable or fallback to localhost
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    console.log('Connecting to socket at:', socketUrl);

    socketRef.current = io(socketUrl, {
      // Add some connection options for better reliability
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5
    });

    // Add connection event listeners for debugging
    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};