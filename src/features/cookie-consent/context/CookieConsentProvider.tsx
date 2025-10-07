import React, { createContext, useState, useEffect } from 'react';

import { getCookieConsentFromStorage, setCookieConsentToStorage } from '../utils/storage';
import { CookieConsentContextType, CookieConsentValue } from '../types';
import { getAccessTokenFromStorage } from '@/helpers/utils/storage';
import CookieConsentService from '@/api/cookieConsentService';
import { CookieConsentModal } from '../components/CookieConsentModal';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { GtmScriptInjector } from '../components/GtmScriptInjector';
import { CookieSettingsModal } from '../components/CookieSettingsModal';
import { TikTokScriptInjector } from '../components/TiktokScriptInjector';

const cookieConsent: CookieConsentContextType = {
  isShowBanner: false,
  isShowSettings: false,
  consent: null,
  onShowSettings: () => {},
  onShowBanner: () => {},
  onAcceptAll: () => {},
  onSave: () => {},
  onCloseBanner: () => {},
  onCloseSettings: () => {},
  onToggleSettings: () => {},
  onSyncCookieConsent: () => {},
  onRemoveConsent: () => {},
};

const gtmMainId = import.meta.env.VITE_GTM_MAIN_ID;
const pixelId = import.meta.env.VITE_PIXEL_ID;

export const CookieConsentContext = createContext<CookieConsentContextType>(cookieConsent);

export const CookieConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [consent, setConsent] = useState(() => getCookieConsentFromStorage());
  const [isShowBanner, setShowBanner] = useState(false);
  const [isShowSettings, setIsShowSettings] = useState(false);
  const { isMobile } = useDeviceDetect();

  const handkeSyncCookieConsent = async (
    cookiePreferences: CookieConsentValue | null,
  ): Promise<void> => {
    if (cookiePreferences) {
      setConsent(cookiePreferences);
      setCookieConsentToStorage(cookiePreferences);
      document.cookie = `CookieConsent=true; max-age=${60 * 60 * 24 * 365}; path=/`;
    }
    const localCookieConsent = getCookieConsentFromStorage();

    if (!cookiePreferences && localCookieConsent) {
      CookieConsentService.saveCookieConsent({
        cookiePreferences: localCookieConsent,
        source: 'modal',
      });
    }
  };

  const handleSave = (data: CookieConsentValue) => {
    const tokenId = getAccessTokenFromStorage();
    if (tokenId) {
      CookieConsentService.saveCookieConsent({
        cookiePreferences: data,
        source: 'modal',
      });
    }
    setConsent(data);
    setCookieConsentToStorage(data);
    document.cookie = `CookieConsent=true; max-age=${60 * 60 * 24 * 365}; path=/`;

    // handleCloseBanner();
    // handleCloseSettings();
    // window.location.reload();
  };

  const handleAcceptAll = () => {
    const all: CookieConsentValue = {
      essential: true,
      performance: true,
      functional: true,
      targeting: true,
    };
    handleSave(all);
    handleCloseBanner();
    handleCloseSettings();
  };

  const handleShowSettings = () => {
    setIsShowSettings(true);
  };

  const handleCloseSettings = () => {
    setIsShowSettings(false);
  };

  const handleShowBanner = () => {
    setShowBanner(true);
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  const handleToggleSettings = () => {
    setIsShowSettings((prev) => !prev);
  };

  const handleRemoveConsent = () => {
    setConsent(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const cookieConsent = document.cookie
        .split('; ')
        .find((row) => row.startsWith('CookieConsent='))
        ?.split('=')[1];

      const savedConsent = getCookieConsentFromStorage();
      if (cookieConsent === 'true' || savedConsent) {
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        isShowBanner,
        isShowSettings,
        onShowSettings: handleShowSettings,
        onShowBanner: handleShowBanner,
        onCloseBanner: handleCloseBanner,
        onCloseSettings: handleCloseSettings,
        onSave: handleSave,
        onAcceptAll: handleAcceptAll,
        onToggleSettings: handleToggleSettings,
        onSyncCookieConsent: handkeSyncCookieConsent,
        onRemoveConsent: handleRemoveConsent,
      }}
    >
      {children}
      <GtmScriptInjector gtmId={gtmMainId} />
      <TikTokScriptInjector pixelId={pixelId} />
      <CookieConsentModal />
      <CookieSettingsModal isMobile={isMobile} />
    </CookieConsentContext.Provider>
  );
};
