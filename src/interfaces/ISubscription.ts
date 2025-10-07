export type ISubscriptionType = 'free' | 'pro' | 'business';

export type ICurrencyType = 'usd';

export enum IntervalType {
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export interface ISubscription {
  activeSubscription: {
    type: ISubscriptionType;
  } | null;
  ownedSubscription: IOwnedSubscription | null;
}

export interface IOwnedSubscription {
  type: ISubscriptionType;
  cancelAtPeriodEnd: boolean;
  endDate: Date;
  quantity: number;
  interval: IntervalType;
  status: string;
}

export interface IInterval {
  title: string;
  titleKey: string;
  type: IntervalType;
}

export interface IPrice {
  id: string;
  description?: string;
  amount: number;
  currency: ICurrencyType;
  interval?: IntervalType;
}

export interface IFeature {
  id: string;
  title: string;
  titleKey: string;
}

export interface ISubscriptionPlan {
  id: string;
  title: string;
  titleKey: string;
  description?: string;
  descriptionKey?: string;
  type: ISubscriptionType;
  price: IPrice;
  features: IFeature[];
}

export type IGroupedSubscriptionPlans = Record<IntervalType, ISubscriptionPlan[]>;

export interface CreditsPack {
  id: string;
  title: string;
  description: string;
  credits: number;
  price: IPrice;
  mostPopular: boolean;
}
