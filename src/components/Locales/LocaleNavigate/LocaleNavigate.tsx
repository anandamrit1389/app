import { useTranslation } from 'react-i18next';
import { Navigate, NavigateProps } from 'react-router-dom';

const LocaleNavigate = ({ to, replace, state, relative }: NavigateProps) => {
  const {
    i18n: { language },
  } = useTranslation();

  return <Navigate to={`/${language}${to}`} replace={replace} state={state} relative={relative} />;
};

export default LocaleNavigate;
