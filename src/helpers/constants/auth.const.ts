export const appleOptions = {
  clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
  scope: 'email name',
  redirectURI: `${
    import.meta.env.VITE_WEB_CALLBACK_URL
      ? import.meta.env.VITE_WEB_CALLBACK_URL
      : window.location.origin
  }/auth/apple/redirect`,
  state: 'state',
  nonce: 'nonce',
  usePopup: true,
};
