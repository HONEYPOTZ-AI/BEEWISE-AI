import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  agentId?: string;
  taskId?: string;
}

export interface WebSocketOptions {
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export const useWebSocket = (url: string, options: WebSocketOptions = {}) => {
  const {
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000
  } = options;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messageHistory, setMessageHistory] = useState<WebSocketMessage[]>([]);

  const reconnectAttemptsRef = useRef(0);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageHandlersRef = useRef<Map<string, (message: WebSocketMessage) => void>>(new Map());

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setConnectionStatus('connected');
      setSocket(ws);
      reconnectAttemptsRef.current = 0;
      logger.info('WebSocket connected', { url });

      // Start heartbeat
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        }
      }, heartbeatInterval);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);
        setMessageHistory((prev) => [...prev.slice(-99), message]); // Keep last 100 messages

        // Handle specific message types
        const handler = messageHandlersRef.current.get(message.type);
        if (handler) {
          handler(message);
        }

        logger.debug('WebSocket message received', { type: message.type, agentId: message.agentId });
      } catch (error) {
        logger.error('Failed to parse WebSocket message', error as Error);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      setSocket(null);

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      // Attempt reconnection
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        logger.info(`Attempting WebSocket reconnection ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
        setTimeout(connect, reconnectInterval);
      } else {
        logger.error('Max WebSocket reconnection attempts reached');
      }
    };

    ws.onerror = (error) => {
      setConnectionStatus('error');
      logger.error('WebSocket error', error as any);
    };

    return ws;
  }, [url, reconnectInterval, maxReconnectAttempts, heartbeatInterval]);

  // Send message
  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: Date.now()
      };
      socket.send(JSON.stringify(fullMessage));
      logger.debug('WebSocket message sent', { type: message.type });
      return true;
    }
    logger.warn('Cannot send message: WebSocket not connected');
    return false;
  }, [socket]);

  // Register message handler
  const onMessage = useCallback((type: string, handler: (message: WebSocketMessage) => void) => {
    messageHandlersRef.current.set(type, handler);

    // Return cleanup function
    return () => {
      messageHandlersRef.current.delete(type);
    };
  }, []);

  // Close connection
  const disconnect = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (socket) {
      socket.close();
      setSocket(null);
    }

    setConnectionStatus('disconnected');
    reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent auto-reconnection
  }, [socket, maxReconnectAttempts]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket,
    connectionStatus,
    lastMessage,
    messageHistory,
    sendMessage,
    onMessage,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected'
  };
};