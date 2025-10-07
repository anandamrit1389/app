import SignUpForm from '@/components/Forms/SignUpForm/SignUpForm';
import AuthLayout from '@/components/Layouts/AuthLayout/Layouts';
import LocaleNavigate from '@/components/Locales/LocaleNavigate/LocaleNavigate';
import { AuthContext } from '@/providers/auth.provider';
import { useContext } from 'react';

const SignUpPage = () => {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) {
    return (
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    );
  }

  return <LocaleNavigate to="/" />;
};

export default SignUpPage;
