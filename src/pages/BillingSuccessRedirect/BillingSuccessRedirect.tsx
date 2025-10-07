import { Navigate, useParams } from 'react-router-dom';

const BillingSuccessRedirect = () => {
  const { lng } = useParams();

  return <Navigate to={`/${lng}/profile`} replace />;
};

export default BillingSuccessRedirect;
