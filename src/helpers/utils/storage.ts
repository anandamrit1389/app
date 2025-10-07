import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_INFO,
  INVITE_TOKEN,
  LAST_VISITED_ROUTE,
  COMPANY_MEMBERSHIP_INFO,
  PRESENTATION_ID_COPY,
  REGISTRATION_ID,
  LANDING_PROMPT_WRITE,
  LANDING_PROMPT_SIGNUP,
  LANDING_PROMPT_SHUFFLE,
  PRESENTATION_LIMIT_NOTIFICATION,
  TRACKING_PAYLOAD,
  TRACKING_CONFIG,
  SELECTED_PRICING_PLAN,
} from '@/helpers/constants/storage.const';
import { CompanyMembership } from '@/interfaces/companies';
import { User } from '@/interfaces/IUser';
import { TrackingConfig, TrackingPayload } from '@/interfaces/trackingPayload.interface';

export async function getLastVisitedRouteFromStorage() {
  return localStorage.getItem(LAST_VISITED_ROUTE);
}
export function removeLastVisitedRoute() {
  return localStorage.removeItem(LAST_VISITED_ROUTE);
}

export async function setLastVisitedRouteToStorage() {
  const lastRoute = window.location.pathname + window.location.search;
  return localStorage.setItem(LAST_VISITED_ROUTE, lastRoute);
}

export async function getInviteTokenFromStorage() {
  return localStorage.getItem(INVITE_TOKEN);
}

export async function setInviteTokenToStorage(token: string) {
  return localStorage.setItem(INVITE_TOKEN, token);
}

export function getAccessTokenFromStorage() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessTokenToStorage(token: string) {
  return localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getRefreshTokenFromStorage() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshTokenToStorage(token: string) {
  return localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getCompanyMembershipInfo() {
  const membershipInfo = localStorage.getItem(COMPANY_MEMBERSHIP_INFO);
  if (membershipInfo) {
    return JSON.parse(membershipInfo) as CompanyMembership;
  }
  return null;
}

export function setCompanyMembershipInfo(membershipInfo: CompanyMembership) {
  return localStorage.setItem(COMPANY_MEMBERSHIP_INFO, JSON.stringify(membershipInfo));
}

export function getUserInfoFromStorage() {
  const user = localStorage.getItem(USER_INFO);

  if (user) {
    return JSON.parse(user) as User;
  }

  return null;
}

export function setUserInfoToStorage(user: User) {
  return localStorage.setItem(USER_INFO, JSON.stringify(user));
}

export function setSelectLangToStorage(lang: string) {
  return localStorage.setItem('selectedLang', lang);
}

export function getSelectLangFromStorage() {
  return localStorage.getItem('selectedLang');
}

export function getPresentationPasswordFromStorage() {
  return localStorage.getItem('presentationPassword') ?? undefined;
}

export function setPresentationPasswordToStorage(password: string) {
  return localStorage.setItem('presentationPassword', password);
}

export function setPresentationIdForCopyToStorage(presentationId: string, lang: string) {
  return sessionStorage.setItem(PRESENTATION_ID_COPY, JSON.stringify({ presentationId, lang }));
}

export function getPresentationIdForCopyToStorage() {
  const presentationToCopy = sessionStorage.getItem(PRESENTATION_ID_COPY);
  if (presentationToCopy) {
    return JSON.parse(presentationToCopy) as {
      presentationId: string;
      lang: string;
    };
  }
  return null;
}

export function removePresentationIdForCopyToStorage() {
  return sessionStorage.removeItem(PRESENTATION_ID_COPY);
}

export const getThemeFromStorage = (): string => {
  return localStorage.getItem('theme') || 'light';
};

export const setTrackingPayload = (trackingPayload: TrackingPayload) => {
  return localStorage.setItem(TRACKING_PAYLOAD, JSON.stringify(trackingPayload));
};

export const getTrackingPayload = (): TrackingPayload | null => {
  const trackingPayload = localStorage.getItem(TRACKING_PAYLOAD);
  if (trackingPayload) {
    return JSON.parse(trackingPayload) as TrackingPayload;
  }
  return null;
};

export const removeTrackingPayload = (): void => {
  localStorage.removeItem(TRACKING_PAYLOAD);
};

export const getTrackingConfig = (): TrackingConfig | null => {
  const trackingConfig = localStorage.getItem(TRACKING_CONFIG);
  if (trackingConfig) {
    return JSON.parse(trackingConfig) as TrackingConfig;
  }
  return null;
};

export function getRegistrationIdFromStorage() {
  return sessionStorage.getItem(REGISTRATION_ID);
}

export function setRegistrationIdToStorage(id: string) {
  return sessionStorage.setItem(REGISTRATION_ID, id);
}

export function removeRegistrationIdFrmoStorage() {
  return sessionStorage.removeItem(REGISTRATION_ID);
}

export function setLandingPromptWrite() {
  return sessionStorage.setItem(LANDING_PROMPT_WRITE, 'true');
}

export function getLandingPromptWrite() {
  return sessionStorage.getItem(LANDING_PROMPT_WRITE);
}

export function setLandingPromptSignup() {
  return sessionStorage.setItem(LANDING_PROMPT_SIGNUP, 'true');
}

export function getLandingPromptSignup() {
  return sessionStorage.getItem(LANDING_PROMPT_SIGNUP);
}

export function setLandingPromptShuffle() {
  return sessionStorage.setItem(LANDING_PROMPT_SHUFFLE, 'true');
}

export function getLandingPromptShuffle() {
  return sessionStorage.getItem(LANDING_PROMPT_SHUFFLE);
}

export function getPresentationLimitNotification() {
  return sessionStorage.getItem(PRESENTATION_LIMIT_NOTIFICATION);
}

export function setPresentationLimitNotification() {
  return sessionStorage.setItem(PRESENTATION_LIMIT_NOTIFICATION, 'true');
}

export function setSelectedPricingPlan(priceId: string, seats: number) {
  return sessionStorage.setItem(SELECTED_PRICING_PLAN, JSON.stringify({ priceId, seats }));
}

export function getSelectedPricingPlan() {
  const plan = sessionStorage.getItem(SELECTED_PRICING_PLAN);
  if (plan) {
    return JSON.parse(plan) as { priceId: string; seats: number };
  }
  return null;
}

export function getDisclaimerDismissedFromStorage(): boolean {
  return localStorage.getItem('disclaimerDismissed') === 'true';
}

export function setDisclaimerDismissedToStorage(dismissed: boolean): void {
  localStorage.setItem('disclaimerDismissed', dismissed ? 'true' : 'false');
}

export function removeSelectedPricingPlan() {
  return sessionStorage.removeItem(SELECTED_PRICING_PLAN);
}
