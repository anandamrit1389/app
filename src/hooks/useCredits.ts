import { useContext, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { AuthContext } from '@/providers/auth.provider';

export const useCredits = () => {
  const { user, handleUserInfo } = useContext(AuthContext);
  
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.on('update-credits', (data) => {
        const updatedCredits = data.credits;
        if (user) {
          user.credits = updatedCredits;
          handleUserInfo({ user });
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('update-credits');
      }
    };
  }, [socket, user, handleUserInfo]);

  return user?.credits || 0;
};
