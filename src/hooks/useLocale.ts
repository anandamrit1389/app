import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSelectLangFromStorage, setSelectLangToStorage } from '@/helpers/utils/storage';
import languages from '@/i18n/languages';

const ignoredRoutes = ['/auth/google/callback', '/auth/apple/redirect', '/auth/microsoft/callback'];

const useLocale = () => {
  const { i18n } = useTranslation();
  const { lng } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (ignoredRoutes.includes(location.pathname)) {
      return;
    }

    // Preserve search params and hash
    const searchParams = location.search;
    const hash = location.hash;
    const fullPath = `${location.pathname}${searchParams}${hash}`;

    const storedLang = getSelectLangFromStorage();
    if (!lng && storedLang) {
      i18n.changeLanguage(storedLang);
      navigate(`/${storedLang}${fullPath}`);
      return;
    }

    if (!Object.keys(languages).includes(lng ?? '')) {
      navigate(`/${i18n.language}${fullPath}`);
      return;
    }

    if (lng !== i18n.language) {
      i18n.changeLanguage(lng ?? i18n.language);
      setSelectLangToStorage(lng ?? i18n.language);
      return;
    }
  }, [lng, i18n.language, location, navigate, i18n]);
};

export default useLocale;
