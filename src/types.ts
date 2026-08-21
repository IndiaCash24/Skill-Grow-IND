export type PackageTier = 'STARTER' | 'INTERMEDIATE' | 'EXPERT' | 'MASTER' | 'VIP';

export interface UserProfile {
  name: string;
  referralId: string;
  packageTier: string;
  avatarUrl: string;
  email: string;
  phone: string;
  joinDate: string;
  sponsorName: string;
  sponsorId: string;
  kycStatus: 'Verified' | 'Pending' | 'Not Submitted';
  upiId: string;
  bankAccount: string;
  ifscCode: string;
}

export interface EarningStats {
  today: number;
  sevenDays: number;
  thirtyDays: number;
  allTime: number;
  passiveIncome: number;
  walletBalance: number;
  totalWithdrawn: number;
}

export interface Transaction {
  id: string;
  leadName: string;
  packageName: string;
  amount: number;
  type: 'DIRECT_COMMISSION' | 'PASSIVE_TIER_1' | 'PASSIVE_TIER_2' | 'WITHDRAWAL';
  date: string;
  status: 'Completed' | 'Processing' | 'Pending';
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  earnings: number;
  package: string;
  state: string;
}

export interface CourseItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  lessons: number;
  thumbnail: string;
  progress: number;
  instructor: string;
}
