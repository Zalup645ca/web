
export enum PredictionDirection {
  RISE = 'RISE',
  FALL = 'FALL',
  NEUTRAL = 'NEUTRAL'
}

export interface Prediction {
  id: string;
  coin: string;
  symbol: string;
  direction: PredictionDirection;
  confidence: number;
  timeframe: string;
  lastUpdated: string;
  price: string;
  change24h: string;
  reasoning: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  savings?: string;
  features: string[];
  isPremium: boolean;
  color: string;
}

export type StoryStatus = 'none' | 'shared' | 'verified';

export interface UserState {
  isLoggedIn: boolean;
  walletAddress: string | null;
  subscription: string; 
  expiryDate: string | null;
  isPaymentPending?: boolean;
  photoUrl: string | null;
  telegramUsername?: string | null;
  storyStatus: StoryStatus;
}
