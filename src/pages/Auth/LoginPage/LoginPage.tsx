import LoginForm from '@/components/Forms/LoginForm/LoginForm';
import AuthLayout from '@/components/Layouts/AuthLayout/Layouts';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import { getAccessTokenFromStorage, getSelectedPricingPlan } from '@/helpers/utils/storage';
import { AuthContext } from '@/providers/auth.provider';
import { useContext } from 'react';

const LoginPage = () => {
  const { accessToken } = useContext(AuthContext);
  const selectedPlan = getSelectedPricingPlan();

  if (selectedPlan) {
    return (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    );
  }

  if (!accessToken || !getAccessTokenFromStorage()) {
    return (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    );
  }

  return <LocaleNavigate to="/dashboard" />;
};

export default LoginPage;
