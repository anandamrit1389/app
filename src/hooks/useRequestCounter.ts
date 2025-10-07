import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL);

const useRequestCounter = () => {
  useEffect(() => {
    if (socket) {
      socket.on('request-counter', ({ api }) => {
        console.info(api);
      });
    }
  }, []);

  return null;
};

export default useRequestCounter;
