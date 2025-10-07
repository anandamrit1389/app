export type CookieConsentValue = {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  targeting: boolean;
};

export type CookieConsentContextType = {
  consent: CookieConsentValue | null;
  onShowSettings: () => void;
  onShowBanner: () => void;
  onCloseSettings: () => void;
  onCloseBanner: () => void;
  onAcceptAll: () => void;
  onToggleSettings: () => void;
  onSave: (data: CookieConsentValue) => void;
  onSyncCookieConsent: (data: CookieConsentValue | null) => void;
  onRemoveConsent: () => void;
  isShowBanner: boolean;
  isShowSettings: boolean;
};
