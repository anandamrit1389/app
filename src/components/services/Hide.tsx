import React from 'react';

type Environment = 'dev' | 'stage' | 'prod' | 'local';

interface HideProps {
  environments: Environment[];
  children: React.ReactNode;
}

const Hide: React.FC<HideProps> = ({ environments, children }) => {
  const currentEnv = (import.meta.env.VITE_NODE_ENV || 'dev') as Environment;

  const shouldHide = environments.includes(currentEnv);

  return shouldHide ? null : <>{children}</>;
};

export default Hide;
