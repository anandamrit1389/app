import { v4 as uuidv4 } from 'uuid';
interface OAuthUrlOptions {
  clientId: string;
  redirectUri: string;
  responseType?: 'code';
  loginUrl: string;
  state?: string;
  scope?: string;
  prompt?: string;
  codeChallenge?: string;
  codeChallengeMethod?: 'S256';
}

const buildOAuthUrl = (options: OAuthUrlOptions): string => {
  const {
    clientId,
    redirectUri,
    state = uuidv4(),
    scope = 'openid email profile',
    prompt = 'select_account',
    responseType = 'code',
    loginUrl,
    codeChallenge,
    codeChallengeMethod,
  } = options;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('redirect_uri', redirectUri);
  params.append('response_type', responseType);
  params.append('scope', scope);
  params.append('state', state);
  params.append('prompt', prompt);

  if (codeChallenge && codeChallengeMethod) {
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', codeChallengeMethod);
  }
  return `${loginUrl}?${params.toString()}`;
};

export const handleLoginWithGoogle = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const baseUrl = import.meta.env.VITE_WEB_CALLBACK_URL
    ? import.meta.env.VITE_WEB_CALLBACK_URL
    : window.location.origin;
  const redirectUri = `${baseUrl}/auth/google/callback`;
  const state = uuidv4();

  sessionStorage.setItem('oauth_state', state);

  const loginUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const googleAuthUrl = buildOAuthUrl({
    redirectUri,
    state,
    loginUrl,
    clientId,
  });

  window.location.href = googleAuthUrl;
};

export const handleLoginWithMicrosoft = async () => {
  const clientId = import.meta.env.VITE_MSAL_CLIENT_ID;
  const baseUrl = import.meta.env.VITE_WEB_CALLBACK_URL
    ? import.meta.env.VITE_WEB_CALLBACK_URL
    : window.location.origin;
  const redirectUri = `${baseUrl}/auth/microsoft/callback`;

  const state = uuidv4();

  const codeVerifier = generateRandomString();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('pkce_verifier', codeVerifier);

  const loginUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';

  const microsoftAuthUrl = buildOAuthUrl({
    redirectUri,
    state,
    loginUrl,
    clientId,
    codeChallenge,
    codeChallengeMethod: 'S256',
  });
  window.location.href = microsoftAuthUrl;
};

const generateRandomString = (length = 128) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
};

const base64UrlEncode = (arrayBuffer: Uint8Array) => {
  return btoa(String.fromCharCode(...arrayBuffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const hashed = await sha256(verifier);
  return base64UrlEncode(hashed);
};
