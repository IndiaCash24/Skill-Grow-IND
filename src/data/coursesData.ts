export interface CoursePackage {
  id: string;
  name: string;
  tier: string;
  tagline: string;
  accentColor: string;
  badgeGradient: string;
  cardBorder: string;
  bannerBg: string;
  topics: string[];
  features: string[];
  rating: number;
  reviewsCount: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  studentsEnrolled: string;
  colorTheme: 'orange' | 'amber' | 'blue' | 'purple' | 'emerald';
  icon: string;
  description: string;
}

export const coursePackages: CoursePackage[] = [
  {
    id: 'silver',
    name: 'SILVER PACKAGE',
    tier: 'Silver Package',
    tagline: 'Graphic Designing & Content Creation Mastery',
    accentColor: 'from-orange-500 to-amber-600',
    badgeGradient: 'bg-orange-500',
    cardBorder: 'border-orange-200',
    bannerBg: 'bg-orange-50',
    topics: [
      'PHOTO EDITING',
      'CANVA MASTERY',
      'PHOTOSHOP MASTERY',
      'VIDEO EDITING',
      'REELS CREATION',
    ],
    features: ['Chat & Call Support', 'Lifetime Course Access', 'Certificate of Completion'],
    rating: 4.8,
    reviewsCount: '2.3k',
    price: 1100,
    originalPrice: 1999,
    discountPercentage: 45,
    studentsEnrolled: '145k+',
    colorTheme: 'orange',
    icon: 'Palette',
    description:
      'Master the foundational creative skills with Canva, Photoshop, and mobile video editing to start earning from social media & freelance clients.',
  },
  {
    id: 'gold',
    name: 'GOLD PACKAGE',
    tier: 'Gold Package',
    tagline: 'Soft Skills & High-Impact Communication',
    accentColor: 'from-amber-500 to-yellow-600',
    badgeGradient: 'bg-amber-500',
    cardBorder: 'border-amber-200',
    bannerBg: 'bg-amber-50',
    topics: [
      'PUBLIC SPEAKING',
      'SALES PSYCHOLOGY',
      'SPOKEN ENGLISH MASTERY',
      'TIME MANAGEMENT',
      'PERSONALITY DEVELOPMENT',
    ],
    features: ['Dedicated Mentor Support', 'Weekly Live Q&A', 'Verified Certificate'],
    rating: 4.9,
    reviewsCount: '4.1k',
    price: 2499,
    originalPrice: 3999,
    discountPercentage: 38,
    studentsEnrolled: '120k+',
    colorTheme: 'amber',
    icon: 'Award',
    description:
      'Supercharge your confidence, closing skills, and communication power to convert leads into high-paying sales effortlessly.',
  },
  {
    id: 'diamond',
    name: 'DIAMOND PACKAGE',
    tier: 'Diamond Package',
    tagline: 'Performance Marketing & Lead Generation Pro',
    accentColor: 'from-blue-600 to-cyan-600',
    badgeGradient: 'bg-blue-600',
    cardBorder: 'border-blue-200',
    bannerBg: 'bg-blue-50',
    topics: [
      'META ADS MASTERY',
      'GOOGLE ADS SECRETS',
      'HIGH-CONVERTING COPYWRITING',
      'SALES FUNNELS',
      'FREELANCE CLIENT HUNTING',
    ],
    features: ['1-on-1 Strategy Calls', 'Live Campaign Reviews', 'Diamond Priority Badge'],
    rating: 4.9,
    reviewsCount: '5.8k',
    price: 4999,
    originalPrice: 7999,
    discountPercentage: 38,
    studentsEnrolled: '98k+',
    colorTheme: 'blue',
    icon: 'Target',
    description:
      'Run profitable paid advertising campaigns on Facebook, Instagram, and Google to generate unlimited targeted leads for yourself or clients.',
  },
  {
    id: 'platinum',
    name: 'PLATINUM PACKAGE',
    tier: 'Platinum Package',
    tagline: 'Financial Markets & Stock Trading Mastery',
    accentColor: 'from-purple-600 to-indigo-600',
    badgeGradient: 'bg-purple-600',
    cardBorder: 'border-purple-200',
    bannerBg: 'bg-purple-50',
    topics: [
      'TECHNICAL ANALYSIS',
      'PRICE ACTION STRATEGY',
      'INTRADAY & SWING TRADING',
      'RISK MANAGEMENT',
      'WEALTH ACCUMULATION',
    ],
    features: ['VIP Trading Community Access', 'Daily Market Watch Breakdown', 'Platinum Certificate'],
    rating: 5.0,
    reviewsCount: '3.9k',
    price: 8999,
    originalPrice: 12999,
    discountPercentage: 31,
    studentsEnrolled: '75k+',
    colorTheme: 'purple',
    icon: 'TrendingUp',
    description:
      'Learn how the stock market and financial charts work with proven risk-managed strategies to compound your wealth systematically.',
  },
  {
    id: 'premium',
    name: 'PREMIUM PLUS PACKAGE',
    tier: 'Premium Plus Package',
    tagline: 'Complete 360° AI & High-Ticket Authority',
    accentColor: 'from-emerald-600 via-teal-600 to-cyan-600',
    badgeGradient: 'bg-emerald-600',
    cardBorder: 'border-emerald-200',
    bannerBg: 'bg-emerald-50',
    topics: [
      'ALL PACKAGES UNLOCKED',
      'AI PROMPT ENGINEERING',
      'HIGH-TICKET SALES MASTERY',
      'PASSIVE AFFILIATE EMPIRE',
      'PERSONAL BRANDING 10X',
    ],
    features: ['Lifetime VIP Access', 'Direct WhatsApp Access to Top Mentors', 'Highest 85% Commission Tier'],
    rating: 5.0,
    reviewsCount: '6.2k',
    price: 14999,
    originalPrice: 24999,
    discountPercentage: 40,
    studentsEnrolled: '86k+',
    colorTheme: 'emerald',
    icon: 'Crown',
    description:
      'The ultimate flagship all-in-one package. Unlocks every single course, maximum affiliate payout rates, and exclusive mastermind sessions.',
  },
];
