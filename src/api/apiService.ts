import axios from 'axios';
import { getAccessTokenFromStorage, setAccessTokenToStorage } from '@/helpers/utils/storage';
import AuthService from './authService';
import { clearStorageExcept } from '@/helpers/utils/clearStorageExcept';
import { TRACKING_CONFIG, TRACKING_PAYLOAD } from '@/helpers/constants/storage.const';
import { analyticsService } from '@/helpers/services/AnalyticsService';

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setDefaultAuthHeader = (token: string | null) => {
  if (token) {
    apiService.defaults.headers.common['Authorization'] = `Bearer ${encodeURIComponent(token)}`;
  } else {
    delete apiService.defaults.headers.common['Authorization'];
  }
};

const storedToken = getAccessTokenFromStorage();

if (storedToken) {
  setDefaultAuthHeader(storedToken);
}

const logoutMessages = [
  'Authorization header is missing',
  'Refresh Token has expired',
  'Invalid Refresh Token',
  // "Authentication failed",
  'Invalid access token',
];

const MAX_REFRESH_ATTEMPTS = 3;
let refreshAttemptCount = 0;

let refreshTokenPromise: Promise<string | void> | null = null;

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

// apiService.interceptors.request.use((config) => {
//   return config;
// });

apiService.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;

    if (error.response?.status === 401 && logoutMessages.includes(error.response?.data?.message)) {
      clearStorageExcept(localStorage, [TRACKING_PAYLOAD, TRACKING_CONFIG]);
      clearStorageExcept(sessionStorage, ['devAccess']);
      window.location.href = '/';
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.message !== 'Incorrect username or password.'
    ) {
      if (refreshAttemptCount >= MAX_REFRESH_ATTEMPTS) {
        clearStorageExcept(localStorage, [TRACKING_PAYLOAD, TRACKING_CONFIG]);
        clearStorageExcept(sessionStorage, ['devAccess']);
        window.location.href = '/';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = new Promise((resolve, reject) => {
          refreshAttemptCount++;
          AuthService.refreshToken()
            .then((resp) => {
              const { accessToken } = resp.data;
              setAccessTokenToStorage(accessToken);

              setDefaultAuthHeader(accessToken);

              refreshAttemptCount = 0;
              refreshTokenPromise = null;
              resolve(accessToken);
            })
            .catch((refreshError) => {
              clearStorageExcept(localStorage, [TRACKING_PAYLOAD, TRACKING_CONFIG]);
              clearStorageExcept(sessionStorage, ['devAccess']);
              window.location.href = '/';
              refreshTokenPromise = null;
              reject(refreshError);
            });
        });
      }

      const newToken = await refreshTokenPromise;
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

      return apiService(originalRequest);
    }

    if (error.response) {
      analyticsService.trackApiError(
        error.config?.url || 'unknown_endpoint',
        error.response.status,
        error.response.data?.message || error.message,
        error.config?._retry ? 1 : 0
      );
    }

    return Promise.reject(error);
  },
);

export default apiService;
