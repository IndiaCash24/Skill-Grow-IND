export type PackageTier = 'SILVER' | 'GOLD' | 'DIAMOND' | 'PLATINUM' | 'MASTER' | 'VIP';

export type AppView =
  | 'home'
  | 'dashboard'
  | 'packages'
  | 'checkout'
  | 'referral'
  | 'leaderboard'
  | 'withdrawal'
  | 'withdrawal-history'
  | 'bank-kyc'
  | 'profile'
  | 'courses'
  | 'login'
  | 'register'
  | 'admin'
  | 'flash';

export type AdminTabType =
  | 'overview'
  | 'users'
  | 'sales'
  | 'payouts'
  | 'kyc'
  | 'packages'
  | 'links'
  | 'banners'
  | 'broadcasts';

export interface AdminUserRecord {
  id: string;
  userCode: string;
  name: string;
  email: string;
  phone: string;
  role: 'affiliate' | 'mentor' | 'admin';
  packageTier: string;
  status: 'active' | 'suspended' | 'pending';
  sponsorCode: string;
  sponsorName?: string;
  walletBalance: number;
  allTimeEarnings: number;
  todayEarnings: number;
  sevenDaysEarnings?: number;
  thirtyDaysEarnings?: number;
  passiveIncome?: number;
  totalWithdrawn: number;
  kycStatus: 'Verified' | 'Pending' | 'Rejected' | 'Not Submitted';
  joinDate: string;
  state: string;
  upiId?: string;
  bankAccount?: string;
  ifscCode?: string;
  panNumber?: string;
}

export interface AdminOrderRecord {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  packageName: string;
  packageTier: string;
  amount: number;
  sponsorCode: string;
  sponsorName: string;
  directCommission: number;
  passiveCommission: number;
  paymentMethod: 'UPI_QR' | 'Razorpay' | 'Direct_Transfer' | 'Card';
  transactionRef: string;
  status: 'Completed' | 'Pending Approval' | 'Failed' | 'Refunded';
  createdAt: string;
}

export interface AdminKycRecord {
  id: string;
  userId: string;
  userCode: string;
  userName: string;
  userEmail: string;
  phone: string;
  bankName: string;
  bankHolderName: string;
  bankAccount: string;
  ifscCode: string;
  upiId: string;
  panNumber: string;
  aadhaarNumber: string;
  submittedAt: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  rejectionReason?: string;
}

export interface AdminPlatformLinks {
  whatsappCommunity: string;
  telegramChannel: string;
  liveTrainingZoom: string;
  trainingTime: string;
  youtubePlaylist: string;
  supportPhone: string;
  supportEmail: string;
  instagramHandle: string;
  facebookPage: string;
  websiteUrl: string;
  termsUrl: string;
  privacyUrl: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  tagline: string;
  imageUrl: string;
  linkUrl: string;
  placement: 'home_carousel' | 'dashboard_top' | 'referral_hub';
  isActive: boolean;
  order: number;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  type?: 'bonus' | 'webinar' | 'urgent' | 'info' | 'celebration' | string;
  targetAudience?: 'all' | 'affiliates' | 'mentors' | 'students' | 'leaders' | string;
  priority?: 'info' | 'warning' | 'urgent' | 'celebration';
  actionLabel?: string;
  actionUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  referralId: string;
  packageTier: string;
  avatarUrl: string;
  email: string;
  phone: string;
  bio?: string;
  state?: string;
  joinDate: string;
  sponsorName: string;
  sponsorId: string;
  kycStatus: 'Verified' | 'Pending' | 'Not Submitted';
  bankHolderName?: string;
  bankName?: string;
  bankAccount: string;
  ifscCode: string;
  upiId: string;
  panNumber?: string;
  aadhaarNumber?: string;
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
  utrNumber?: string;
  destination?: string;
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  payoutMethod: 'UPI' | 'Bank Transfer' | 'IMPS_BANK';
  destination: string;
  utrNumber?: string;
  requestedAt: string;
  completedAt?: string;
  status: 'Completed' | 'Processing' | 'Pending' | 'Rejected';
  remarks?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  joinedDate: string;
  package: string;
  tier: 'Direct (Tier 1)' | 'Passive (Tier 2)';
  commissionEarned: number;
  status: 'Active' | 'Inactive';
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  earnings: number;
  package: string;
  state: string;
  growth?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessonsCount: number;
  topics: string[];
}

export interface PackageItem {
  id: string;
  name: string;
  tier: PackageTier;
  tagline: string;
  price: number;
  originalPrice: number;
  directCommission: number;
  passiveCommission: number;
  color: string;
  gradient: string;
  badge?: string;
  modulesCount: number;
  hoursContent: number;
  features: string[];
  modules: CourseModule[];
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

