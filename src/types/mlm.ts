// MLM System Types

import type { Decimal } from '@prisma/client/runtime/client';
import type {
  Commission,
  CommissionRule,
  CommissionStatus,
  CommissionType,
  MLMSettings,
  User,
  Wallet,
  Withdrawal,
  WithdrawalMethod,
  WithdrawalStatus,
} from '@/shared/lib/generated/prisma/client';

// Re-export enums for convenience
export type { CommissionType, CommissionStatus, WithdrawalStatus, WithdrawalMethod };

// User with MLM relations
export type MLMUser = User & {
  wallet: Wallet | null;
  commissions: Commission[];
  withdrawals: Withdrawal[];
  upline: User | null;
  downline: User[];
};

// Downline tree node
export interface DownlineNode {
  id: string;
  name: string;
  email: string;
  sponsorId: string | null;
  mlmLevel: number;
  isMLMEnabled: boolean;
  joinedAt: Date;
  totalSales: number;
  directDownlineCount: number;
  children?: DownlineNode[];
}

// Commission with relations
export interface CommissionWithRelations extends Commission {
  user: Pick<User, 'id' | 'name' | 'email'>;
  order?: {
    id: string;
    orderNumber: string;
    totalAmount: Decimal;
  } | null;
}

// Withdrawal with user info
export interface WithdrawalWithUser extends Withdrawal {
  user: Pick<User, 'id' | 'name' | 'email' | 'phoneNumber'>;
}

// Wallet summary
export interface WalletSummary {
  balance: number;
  pending: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
}

// Commission summary
export interface CommissionSummary {
  totalEarned: number;
  pending: number;
  paid: number;
  cancelled: number;
  byType: {
    type: CommissionType;
    total: number;
    count: number;
  }[];
  byLevel: {
    level: number;
    total: number;
    count: number;
  }[];
}

// MLM Stats for dashboard
export interface MLMStats {
  totalDownline: number;
  directDownline: number;
  activeDownline: number;
  totalCommissions: number;
  pendingCommissions: number;
  walletBalance: number;
  currentRank: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
}

// Referral link data
export interface ReferralLinkData {
  sponsorId: string;
  referralUrl: string;
  totalReferrals: number;
  activeReferrals: number;
}

// Admin analytics
export interface MLMAnalytics {
  totalMembers: number;
  activeMembers: number;
  totalCommissionsPaid: number;
  pendingCommissions: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  membersByLevel: {
    level: number;
    count: number;
  }[];
  commissionsByMonth: {
    month: string;
    total: number;
    count: number;
  }[];
  topEarners: {
    user: Pick<User, 'id' | 'name' | 'email'>;
    totalEarned: number;
    downlineCount: number;
  }[];
}

// Commission calculation result
export interface CommissionCalculation {
  userId: string;
  amount: number;
  level: number;
  type: CommissionType;
  percentage: number;
}

// Withdrawal request input
export interface WithdrawalRequest {
  amount: number;
  method: WithdrawalMethod;
  details: {
    accountTitle?: string;
    accountNumber?: string;
    bankName?: string;
    branchCode?: string;
    walletNumber?: string;
    cryptoAddress?: string;
    cryptoNetwork?: string;
  };
}

// Commission rule input
export interface CommissionRuleInput {
  name: string;
  type: CommissionType;
  level: number;
  percentage: number;
  fixedAmount?: number;
  minOrderValue?: number;
  maxCommission?: number;
  isActive?: boolean;
  priority?: number;
}

// MLM settings input
export interface MLMSettingsInput {
  isMLMEnabled?: boolean;
  maxLevels?: number;
  minWithdrawal?: number;
  withdrawalFeePercent?: number;
  defaultSignupBonus?: number;
  autoApproveCommissions?: boolean;
  autoEnableMLM?: boolean;
}

// Pagination
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter options
export interface CommissionFilters {
  type?: CommissionType;
  status?: CommissionStatus;
  level?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface WithdrawalFilters {
  status?: WithdrawalStatus;
  method?: WithdrawalMethod;
  startDate?: Date;
  endDate?: Date;
}

export interface MemberFilters {
  isMLMEnabled?: boolean;
  mlmLevel?: number;
  hasUpline?: boolean;
  search?: string;
}
