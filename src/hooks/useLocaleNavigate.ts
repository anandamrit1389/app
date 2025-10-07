import { useTranslation } from 'react-i18next';
import { NavigateFunction, NavigateOptions, To, useNavigate } from 'react-router-dom';

const useLocaleNavigate = (): NavigateFunction => {
  const navigate = useNavigate();
  const {
    i18n: { language },
  } = useTranslation();

  const handleNavigate = (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      navigate(to);
    } else {
      const finalPath =
        typeof to === 'string'
          ? `/${language}${to}`
          : { ...to, pathname: `/${language}${to.pathname}` };
      navigate(finalPath, options);
    }
  };

  return handleNavigate;
};

export default useLocaleNavigate;
