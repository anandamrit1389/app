import { AuthContext } from '@/providers/auth.provider';
import { useState, useEffect, createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const { user, companyMembershipInfo } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL);
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const joinCompanyRoom = () => {
      if (!companyMembershipInfo?.companyId) return;
      const teamId = `team:${companyMembershipInfo?.companyId}`;
      socket.emit('joinTeams', { teamId });
    };

    const joinUserRoom = () => {
      const raw = localStorage.getItem('user_info');
      const parsed = raw ? JSON.parse(raw) : null;
      const userRoom = `room_${parsed?.id}`;
      if (userRoom) {
        socket.emit('joinRoom', { room: userRoom });
      }
    };

    const handleConnect = () => {
      joinUserRoom();
      joinCompanyRoom();
    };

    const handleReconnect = () => {
      if (socket.disconnected) socket.connect();
      joinUserRoom();
      joinCompanyRoom();
    };

    socket?.on('connect', handleConnect);
    socket?.on('reconnect', handleReconnect);

    return () => {
      socket?.off('connect', handleConnect);
      socket?.off('reconnect', handleReconnect);
    };
  }, [socket]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
