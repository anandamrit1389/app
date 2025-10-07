import axios, { AxiosResponse } from 'axios';

import apiService, { setDefaultAuthHeader } from '@/api/apiService';

import {
  LoginCredentials,
  LoginResponse,
  RegisterResponse,
  SignUpCredentials,
  Auth,
  VerifyCredentaials,
} from '@/interfaces/auth.interface';
import { getAccessTokenFromStorage, getRefreshTokenFromStorage } from '@/helpers/utils/storage';

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default class AuthService {
  static async login({ email, password }: LoginCredentials): Promise<AxiosResponse<LoginResponse>> {
    return authApi
      .post('/auth/login', {
        email,
        password,
      })
      .then((response) => {
        const { accessToken } = response.data;
        setDefaultAuthHeader(accessToken);

        return response;
      });
  }

  static signup(
    { email, password }: SignUpCredentials,
    inviteToken: string | null,
    registrationId?: string | null,
  ): Promise<AxiosResponse<RegisterResponse>> {
    return authApi.post('/auth/signup', {
      email,
      password,
      inviteToken: inviteToken === null ? '' : inviteToken,
      registrationId: registrationId === null ? undefined : registrationId,
    });
  }

  static async verify({
    code,
    email,
    password,
  }: VerifyCredentaials & SignUpCredentials): Promise<AxiosResponse<LoginResponse>> {
    return authApi
      .post('/auth/verify', {
        code,
        email,
        password,
      })
      .then((response) => {
        const { accessToken } = response.data;
        setDefaultAuthHeader(accessToken);

        return response;
      });
  }

  static resend(email: string): Promise<AxiosResponse> {
    return authApi.post('/auth/resend', { email });
  }

  static refreshToken(): Promise<AxiosResponse<Auth>> {
    return authApi.post('/auth/refresh', {
      refreshToken: getRefreshTokenFromStorage() ?? '',
      expiredAccessToken: getAccessTokenFromStorage() ?? '',
    });
  }

  static async oauthLogin(
    code: string,
    provider: 'google' | 'apple' | 'microsoft',
    inviteToken: string | null = null,
    codeVerifier?: string,
    registrationId?: string | null,
  ): Promise<AxiosResponse<LoginResponse>> {
    return authApi
      .post(`/auth/oauth-login`, {
        code,
        provider,
        inviteToken: inviteToken === null ? '' : inviteToken,
        codeVerifier,
        registrationId: registrationId === null ? undefined : registrationId,
      })
      .then((response) => {
        const { accessToken } = response.data;
        setDefaultAuthHeader(accessToken);

        return response;
      });
  }

  static logout(): Promise<AxiosResponse> {
    return apiService.post('/auth/logout', {
      refreshToken: getRefreshTokenFromStorage() ?? '',
    });
  }

  static getProfile(): Promise<AxiosResponse> {
    return apiService.get('/auth/profile');
  }

  static forgotPassword(
    email: string,
    language: string,
    captchaToken?: string,
  ): Promise<AxiosResponse> {
    return authApi.post('/auth/forgot-password', {
      email,
      language,
      captchaToken,
    });
  }

  static resetPassword(token: string, password: string): Promise<AxiosResponse<LoginResponse>> {
    return authApi.post('/auth/reset-password', { token, password });
  }
}
