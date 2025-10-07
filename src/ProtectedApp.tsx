import React, { useEffect, useState } from 'react';
import App from '@/App';
import DevAccess from '@/pages/Auth/DevAccessPage/DevAccessPage';
import { useTrackingIdHandler } from './hooks/useTrackingIdHandler';

const ProtectedApp: React.FC = () => {
  const [hasAccess, setHasAccess] = useState(false);
  useTrackingIdHandler();

  useEffect(() => {
    if (['dev', 'stage'].includes(import.meta.env.VITE_NODE_ENV)) {
      const devAccess = sessionStorage.getItem('devAccess');
      if (devAccess === 'true') {
        setHasAccess(true);
      }
    } else {
      setHasAccess(true);
    }
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  return hasAccess ? <App /> : <DevAccess onAccessGranted={handleAccessGranted} />;
};

export default ProtectedApp;
