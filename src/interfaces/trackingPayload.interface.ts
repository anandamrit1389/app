export interface TrackingPayload {
  trackingId: string;
  trackingType: string;
  timestamp: string;
  timezone: string;
}

export interface TrackingConsentEntry {
  name: string;
  enabled: boolean;
}

export type TrackingConfig = Record<string, TrackingConsentEntry>;
