import { IOwnedSubscription, ISubscription, ISubscriptionType } from './ISubscription';
import { ThemeColors } from './theme.interface';

export enum FeatureKey {
  CUSTOM_COLORS = 'customColors',
  COMPANY_CONFIGURATION = 'companyConfiguration',
  VOICE_FEATURE = 'voiceFeature',
}

export enum RequiredActionType {
  SUBSCRIBE = 'subscribe',
}

export interface FeatureAccess {
  hasAccess: boolean;
  reason?: string;
  requiredActions?: Array<{
    type: RequiredActionType;
    requiredSubscriptions: ISubscriptionType[];
  }>;
}

export interface PendingUser {
  id: string | null;
  email: string;
}

export interface UserMission {
  id: string;
  description: string;
  step: number;
  totalSteps: number;
  progress: number;
  requiredInvites: number;
  features: [FeatureKey];
  totalInvites: number;
  pending: PendingUser[];
}

export interface User {
  id: string;
  name: string;
  profileImg: string | null;
  email: string;
  subscription: ISubscription | null;
  credits: number;
  isActive: boolean;
  notificationsSettings: NotificationsSettings;
  maxSlides: number;
  themeColors: ThemeColors | null;
  featuresAccess: Record<FeatureKey, FeatureAccess>;
  mission?: UserMission | null;
  showDisclaimer: boolean;
  presentationLimit: number;
  extraPresentationLimit: number;
  role: string;
}

export interface UserConfig {
  id: string;
  email: string;
  credits: number;
  extraCredits: number;
  extraPresentationLimit: number;
  isActive: boolean;
  role: string;
  ownedSubscription: IOwnedSubscription | null;
}

export enum UserRole {
  Admin = 'admin',
  Support = 'support',
  User = 'user',
}

export interface Member {
  id: string;
  name: string;
  email: string;
}

export interface NotificationsSettings {
  newFeatures: boolean;
  inspirationTutorials: boolean;
  offers: boolean;
}

export enum TransactionType {
  ADD = 'ADD',
  DEDUCT = 'DEDUCT',
}
export interface ITransaction {
  id: string;
  type: TransactionType;
  createdAt: Date;
  amount: number;
  description: string;
}
