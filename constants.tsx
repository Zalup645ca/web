
import React from 'react';
import { Prediction, PredictionDirection, SubscriptionPlan } from './types';

export const MOCK_PREDICTIONS: Prediction[] = [
  {
    id: '1',
    coin: 'Bitcoin',
    symbol: 'BTC',
    direction: PredictionDirection.RISE,
    confidence: 84,
    timeframe: '24H',
    lastUpdated: '2 mins ago',
    price: '$67,422.50',
    change24h: '+2.4%',
    reasoning: 'Strong accumulation patterns observed near the $66k support level combined with positive RSI divergence on the 4H chart.'
  },
  {
    id: '2',
    coin: 'Ethereum',
    symbol: 'ETH',
    direction: PredictionDirection.FALL,
    confidence: 68,
    timeframe: '24H',
    lastUpdated: '5 mins ago',
    price: '$3,412.12',
    change24h: '-1.2%',
    reasoning: 'Increased exchange inflows detected suggesting potential sell-side pressure as ETH approaches heavy resistance at $3,500.'
  },
  {
    id: '3',
    coin: 'Solana',
    symbol: 'SOL',
    direction: PredictionDirection.RISE,
    confidence: 91,
    timeframe: '24H',
    lastUpdated: '10 mins ago',
    price: '$145.88',
    change24h: '+5.7%',
    reasoning: 'Network activity hitting multi-month highs and institutional interest spiking following the recent ecosystem announcement.'
  },
  {
    id: '4',
    coin: 'Toncoin',
    symbol: 'TON',
    direction: PredictionDirection.RISE,
    confidence: 88,
    timeframe: '24H',
    lastUpdated: '1 min ago',
    price: '$7.12',
    change24h: '+3.1%',
    reasoning: 'Massive user onboarding via Telegram Mini Apps and TVL growth in decentralized lending protocols.'
  },
  {
    id: '5',
    coin: 'Cardano',
    symbol: 'ADA',
    direction: PredictionDirection.NEUTRAL,
    confidence: 52,
    timeframe: '24H',
    lastUpdated: '15 mins ago',
    price: '$0.45',
    change24h: '+0.2%',
    reasoning: 'Price consolidating in a narrow range with low volume; waiting for a decisive breakout above $0.48.'
  },
  {
    id: '6',
    coin: 'Polkadot',
    symbol: 'DOT',
    direction: PredictionDirection.FALL,
    confidence: 61,
    timeframe: '24H',
    lastUpdated: '20 mins ago',
    price: '$7.34',
    change24h: '-2.1%',
    reasoning: 'Bearish engulfing candle on the daily chart indicates potential retracement to the $6.90 support zone.'
  },
  {
    id: '7',
    coin: 'Chainlink',
    symbol: 'LINK',
    direction: PredictionDirection.RISE,
    confidence: 79,
    timeframe: '24H',
    lastUpdated: '4 mins ago',
    price: '$18.45',
    change24h: '+1.8%',
    reasoning: 'Increased whale accumulation detected and growing demand for CCIP integration across major L2s.'
  },
  {
    id: '8',
    coin: 'Avalanche',
    symbol: 'AVAX',
    direction: PredictionDirection.RISE,
    confidence: 74,
    timeframe: '24H',
    lastUpdated: '8 mins ago',
    price: '$36.22',
    change24h: '+4.3%',
    reasoning: 'Strong recovery from sub-nets activity and partnership rumors driving retail FOMO.'
  },
  {
    id: '9',
    coin: 'Polygon',
    symbol: 'MATIC',
    direction: PredictionDirection.FALL,
    confidence: 55,
    timeframe: '24H',
    lastUpdated: '12 mins ago',
    price: '$0.71',
    change24h: '-0.8%',
    reasoning: 'Market oversold but lacking strong buy-side momentum to flip the current resistance level.'
  },
  {
    id: '10',
    coin: 'Dogecoin',
    symbol: 'DOGE',
    direction: PredictionDirection.RISE,
    confidence: 65,
    timeframe: '24H',
    lastUpdated: '30 mins ago',
    price: '$0.154',
    change24h: '+8.2%',
    reasoning: 'Social media volume spike and speculative interest ahead of expected payment integration updates.'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    duration: 'Forever',
    features: ['1-2 predictions daily', 'Basic market stats', 'Standard support'],
    isPremium: false,
    color: 'bg-zinc-800'
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 9.99,
    duration: 'Month',
    features: ['Unlimited predictions', 'Advanced AI analytics', 'Real-time alerts', 'Portfolio tracker'],
    isPremium: true,
    color: 'phantom-gradient'
  },
  {
    id: 'biannual',
    name: 'Pro 6-Month',
    price: 49.99,
    duration: '6 Months',
    savings: 'Save 20%',
    features: ['Everything in Pro', 'Priority support', 'Beta feature access'],
    isPremium: true,
    color: 'phantom-gradient'
  },
  {
    id: 'annual',
    name: 'Pro Annual',
    price: 89.99,
    duration: 'Year',
    savings: 'Save 25%',
    features: ['Everything in Pro', 'Custom coin requests', 'VIP Community access', 'Annual prediction report'],
    isPremium: true,
    color: 'phantom-gradient'
  }
];
