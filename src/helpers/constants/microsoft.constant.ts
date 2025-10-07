import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: `${import.meta.env.VITE_WEB_CALLBACK_URL}/auth/microsoft/callback`,
    navigateToLoginRequestUrl: false,
    postLogoutRedirectUri: `${import.meta.env.VITE_WEB_CALLBACK_URL}/auth/microsoft/callback`,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    allowRedirectInIframe: true,
    iframeHashTimeout: 10000,
    asyncPopups: false,
    loggerOptions: {
      loggerCallback: (level: number, message: string, containsPii: boolean) => {
        if (!containsPii) {
          console.log(`MSAL [${level}]: ${message}`);
        }
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
};
