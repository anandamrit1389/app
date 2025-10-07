import { setInviteTokenToStorage } from '@/helpers/utils/storage';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const InviteRedirectPage = () => {
  const navigate = useNavigate();

  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    const handleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('inviteToken');

      if (token) {
        await setInviteTokenToStorage(token);
        navigate(`/${language}/signup`);
      } else {
        navigate(`/${language}/`);
      }
    };

    handleRedirect();
  }, [navigate, language]);

  return null;
};

export default InviteRedirectPage;
