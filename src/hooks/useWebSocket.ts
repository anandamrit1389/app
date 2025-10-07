import { SocketContext, SocketContextType } from '@/contexts/Websocket.context';
import { useContext } from 'react';

export const useWebSocket = (): SocketContextType => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
};
