import { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorFallback = () => {
  if (
    import.meta.env.VITE_NODE_ENV === 'dev' ||
    import.meta.env.VITE_NODE_ENV === 'stage' ||
    import.meta.env.VITE_NODE_ENV === 'production'
  )
    window.location.reload();
  return <h2>Reload...</h2>;
};

const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
