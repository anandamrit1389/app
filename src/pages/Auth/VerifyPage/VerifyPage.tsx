import VerifyForm from '@/components/Forms/VerifyForm/VerifyForm';
import AuthLayout from '@/components/Layouts/AuthLayout/Layouts';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import { AuthContext } from '@/providers/auth.provider';
import { useContext } from 'react';

const VerifyPage = () => {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) {
    return (
      <AuthLayout>
        <VerifyForm />
      </AuthLayout>
    );
  }

  return <LocaleNavigate to="/" />;
};

export default VerifyPage;
