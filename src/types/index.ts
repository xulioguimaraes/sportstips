export interface Tip {
  id: string;
  category: 'football' | 'basketball' | 'tennis';
  league: string;
  teams: string;
  matchTime: string;
  prediction: string;
  confidence?: number;
  isPremium: boolean;
  odds: Odds[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  status?: 'active' | 'inactive' | 'completed';
  result?: 'win' | 'loss' | 'pending';
  purchasedAt?: string;
  price?: number;
}

export interface Odds {
  house: string;
  value: number;
  isBest?: boolean;
}

export interface Stats {
  accuracy: number;
  todayCount: number;
  roi: number;
}

export interface FilterTab {
  id: string;
  label: string;
  category: string;
  isActive: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role?: 'admin' | 'user';
  subscription?: Subscription;
  freeTipsUsed?: number;
  freeTipsLimit?: number;
  createdAt?: Date;
  packages?: Package[];
  purchasedTips?: string[];
}

export interface Package {
  id: string;
  name: string;
  tipsIncluded: number;
  tipsRemaining: number;
  purchasedAt: Date;
  transactionId?: string;
  lastUsedAt?: Date;
}

export interface Subscription {
  id: string;
  type: 'free' | 'weekly' | 'monthly' | 'bronze' | 'silver' | 'gold';
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  type: 'subscription' | 'package';
  price: number;
  currency: 'BRL';
  duration?: number; // em dias para assinaturas
  tipsIncluded?: number; // para pacotes
  features: string[];
  isPopular?: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: 'BRL';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface TipFormData {
  category: 'football' | 'basketball' | 'tennis';
  league: string;
  teams: string;
  matchTime: string;
  prediction: string;
  confidence?: number;
  isPremium: boolean;
  odds: Odds[];
}

export interface TipPurchase {
  id?: string;
  userId: string;
  tipId: string;
  purchasedAt: Date;
  packageId: string;
  packageName: string;
  transactionId?: string;
}
