import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Star,
  Users,
  Eye,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Video,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Zap,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Layers,
  Clock,
  PlayCircle,
  LayoutDashboard,
} from 'lucide-react';
import { coursePackages, CoursePackage } from '../data/coursesData';
import { PackageBox3D } from './PackageBox3D';
import { FloatingNeedHelp } from './FloatingNeedHelp';
import confetti from 'canvas-confetti';

interface HomePageProps {
  onNavigateToDashboard: () => void;
  onOpenCourses: () => void;
  onOpenLeaderboard: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToDashboard,
  onOpenCourses,
  onOpenLeaderboard,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<CoursePackage | null>(null);
  const [isEnrollSuccessModalOpen, setIsEnrollSuccessModalOpen] = useState(false);
  const [enrolledPackageName, setEnrolledPackageName] = useState('');

  const handleEnrollClick = (pkg: CoursePackage) => {
    setEnrolledPackageName(pkg.name);
    setIsEnrollSuccessModalOpen(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div id="skill-grow-home-page" className="w-full bg-[#FFFFFF] text-slate-900 font-['Poppins',sans-serif]">
      
      {/* 1. TOP EVENT BANNER / ANNUAL MEETUP HERO (From Screenshot 1) */}
      <section id="event-meetup-hero" className="w-full bg-gradient-to-r from-[#111827] via-[#1E1B4B] to-[#311042] text-white relative overflow-hidden border-b border-orange-500/30">
        {/* Glow & Sparkles accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="px-4 py-6 sm:py-8 max-w-4xl mx-auto flex flex-col items-center text-center space-y-4">
          {/* Main Event Headline */}
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1 text-xs font-semibold text-gray-300">
              <span>Skill</span>
              <span className="text-orange-400 font-bold">Grow</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-bold">IND</span>
              <span className="text-gray-400 italic ml-1">· Celebrating Growth, Together!</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md">
              Skill Grow <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Mega Meetup</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto font-normal">
              Let's Celebrate the Journey, Recognize the Efforts & Plan the Future Together!
            </p>
          </div>

          {/* Event Feature Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-2xl pt-2">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex flex-col items-center text-center">
              <Zap className="w-4 h-4 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold text-white">Powerful Sessions</span>
              <span className="text-[9px] text-gray-300">Learn. Apply. Grow.</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex flex-col items-center text-center">
              <Users className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold text-white">Meet & Network</span>
              <span className="text-[9px] text-gray-300">Connect with Leaders</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex flex-col items-center text-center">
              <Award className="w-4 h-4 text-yellow-400 mb-1" />
              <span className="text-[11px] font-bold text-white">Recognition</span>
              <span className="text-[9px] text-gray-300">Celebrate Achievers</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex flex-col items-center text-center">
              <TrendingUp className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-[11px] font-bold text-white">Future Roadmap</span>
              <span className="text-[9px] text-gray-300">New Opportunities</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <button
              onClick={() => {
                const coursesSection = document.getElementById('premier-courses-section');
                coursesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-2.5 rounded-full shadow-lg transition-transform active:scale-95 flex items-center space-x-1.5"
            >
              <span>Explore All Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToDashboard}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold px-5 py-2.5 rounded-full border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-pink-300" />
              <span>Affiliate Dashboard ➔</span>
            </button>
          </div>

          <div className="text-[10px] text-amber-300/90 font-semibold tracking-wider uppercase pt-1">
            ★ ONE TEAM. ONE VISION. ONE CELEBRATION. BE THERE. BE PROUD! ★
          </div>
        </div>
      </section>

      {/* 2. EXPLORE PREMIER COURSES SECTION HEADER (From Screenshot 1) */}
      <section id="premier-courses-section" className="px-4 pt-8 pb-4 max-w-4xl mx-auto">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-500 tracking-tight">
            Explore Skill Grow Premier Courses
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-2xl font-normal">
            Welcome to Skill Grow's expert courses! Explore Skill Grow's distinctive selection of courses
            designed to enhance your knowledge and transform you into a highly skilled and industry-ready professional.
          </p>

          <div className="pt-1">
            <button
              onClick={() => {
                const firstPackage = document.getElementById('package-silver');
                firstPackage?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md active:scale-95 transition-all"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. COURSES PACKAGES SHOWCASE (From Screenshot 1 & 2) */}
      <section className="px-4 py-4 max-w-4xl mx-auto space-y-8">
        {coursePackages.map((pkg) => (
          <div
            key={pkg.id}
            id={`package-${pkg.id}`}
            className="bg-white rounded-3xl border border-gray-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] overflow-hidden transition-all hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)]"
          >
            {/* 3D Box Illustration area */}
            <div className="bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 border-b border-gray-100 relative">
              <PackageBox3D pkg={pkg} />
            </div>

            {/* Package Content & Details Area */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Package Title */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-orange-500 tracking-tight uppercase">
                  {pkg.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{pkg.tagline}</p>
              </div>

              {/* Topics Included Pipe-separated List */}
              <div className="border-t border-dashed border-gray-200 pt-3 pb-1">
                <p className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide leading-relaxed">
                  {pkg.topics.join(' | ')}
                </p>
              </div>

              {/* Support & Star Rating Row */}
              <div className="flex items-center justify-between text-xs text-gray-600 py-1">
                <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                  <Users className="w-4 h-4 text-slate-900" />
                  <span>Chat & Call Support</span>
                </div>

                <div className="flex items-center space-x-1 font-semibold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-slate-800 font-bold">{pkg.rating}</span>
                  <span className="text-gray-400">({pkg.reviewsCount})</span>
                </div>
              </div>

              {/* Action Buttons & Pricing Row */}
              <div className="border-t border-dashed border-gray-200 pt-3 flex flex-wrap items-center justify-between gap-3">
                
                {/* Buttons: Enroll Now + View */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEnrollClick(pkg)}
                    className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-md active:scale-95 transition-all"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="inline-flex items-center space-x-1 border border-orange-500 text-orange-600 hover:bg-orange-50 font-bold text-xs px-4 py-2.5 rounded-full active:scale-95 transition-all"
                  >
                    <span>View</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price Display */}
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-black text-orange-500 tracking-tight leading-none">
                    ₹{pkg.price.toFixed(2)} /-
                  </div>
                  <div className="text-xs text-gray-400 line-through mt-0.5">
                    ₹{pkg.originalPrice.toFixed(2)}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 4. STATS COUNTER METRICS SECTION (From Screenshot 3) */}
      <section id="stats-section" className="px-4 py-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          
          {/* Card 1: 525.7k+ Total Students */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center space-y-3 border border-orange-100/80 shadow-xs">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-100/70 flex items-center justify-center p-3 relative">
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
              <span className="absolute -bottom-1 -right-1 bg-white text-orange-600 p-1 rounded-full shadow-xs border border-orange-200">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-orange-500 tracking-tight">
                525.7k+
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                Total Students
              </p>
            </div>
          </div>

          {/* Card 2: 50 Total Courses */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center space-y-3 border border-orange-100/80 shadow-xs">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100/70 flex items-center justify-center p-3 relative">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />
              <span className="absolute -bottom-1 -right-1 bg-white text-amber-600 p-1 rounded-full shadow-xs border border-amber-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-orange-500 tracking-tight">
                50+
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                Total Courses
              </p>
            </div>
          </div>

          {/* Card 3: 1,001 Total Videos */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center space-y-3 border border-orange-100/80 shadow-xs">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100/70 flex items-center justify-center p-3 relative">
              <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
              <span className="absolute -bottom-1 -right-1 bg-white text-blue-600 p-1 rounded-full shadow-xs border border-blue-200">
                <Video className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-orange-500 tracking-tight">
                1,001
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                Total Videos
              </p>
            </div>
          </div>

          {/* Card 4: 569.4k+ Total Courses Watch */}
          <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center space-y-3 border border-orange-100/80 shadow-xs">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100/70 flex items-center justify-center p-3 relative">
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
              <span className="absolute -bottom-1 -right-1 bg-white text-emerald-600 p-1 rounded-full shadow-xs border border-emerald-200">
                <Users className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-orange-500 tracking-tight">
                569.4k+
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                Total Courses Watch
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. "TRANSFORM YOUR EXPERIENCE WITH SKILL GROW" BANNER (From Screenshot 3) */}
      <section className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 py-4 px-4 text-center text-white shadow-md">
        <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight drop-shadow-xs">
          Transform Your Experience with Skill Grow
        </h3>
      </section>

      {/* 6. THREE VALUE PILLAR CARDS (From Screenshot 4) */}
      <section className="px-4 py-8 max-w-4xl mx-auto space-y-5">
        
        {/* Pillar 1: Learn The Essential Skills */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-orange-50 flex items-center justify-center p-4 border border-orange-200/60 shadow-xs">
            <svg className="w-14 h-14 text-orange-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="42" fill="#FED7AA" fillOpacity="0.5"/>
              <rect x="25" y="25" width="22" height="22" rx="4" fill="#F97316"/>
              <rect x="53" y="25" width="22" height="22" rx="4" fill="#FBBF24"/>
              <rect x="25" y="53" width="22" height="22" rx="4" fill="#F59E0B"/>
              <rect x="53" y="53" width="22" height="22" rx="4" fill="#EA580C"/>
            </svg>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Learn The Essential Skills
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Like Digital Marketing, Stock Market, Graphic Designing, AI Tools, Copywriting & Video Editing
            </p>
            <div className="w-12 h-0.5 bg-orange-400 mx-auto mt-2 rounded-full" />
          </div>
        </div>

        {/* Pillar 2: Earn Certificates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-50 flex items-center justify-center p-4 border border-amber-200/60 shadow-xs">
            <Award className="w-12 h-12 text-amber-500" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Earn Certificates
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Download the official Skill Grow course certificates and showcase your industry-ready skills to the world.
            </p>
            <div className="w-12 h-0.5 bg-amber-400 mx-auto mt-2 rounded-full" />
          </div>
        </div>

        {/* Pillar 3: High Affiliate Income & Financial Growth */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-50 flex items-center justify-center p-4 border border-emerald-200/60 shadow-xs">
            <TrendingUp className="w-12 h-12 text-emerald-500" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Earn High Affiliate Income
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Promote Skill Grow courses and earn up to 70% to 85% high direct & passive commission on every sale.
            </p>
            <div className="w-12 h-0.5 bg-emerald-400 mx-auto mt-2 rounded-full" />
          </div>
        </div>

      </section>

      {/* 7. FULL FOOTER SECTION (From Screenshot 5) */}
      <footer id="main-footer" className="bg-[#FAF9F6] border-t border-gray-200/90 pt-10 pb-12 px-5 text-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Logo & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="font-['Poppins'] font-black text-2xl tracking-tight">
                <span className="text-orange-500">Skill</span>
                <span className="text-slate-900 ml-1">Grow</span>
              </div>
              <span className="text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md">IND</span>
            </div>

            <p className="text-sm text-gray-600 italic font-serif">
              Earn knowledge ! Earn money
            </p>
            <p className="text-xs text-gray-600 max-w-md pt-1">
              Gain knowledge and embark on your skilled professional journey with India's leading e-learning platform.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center space-x-2.5 pt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <span className="font-bold text-xs">f</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <span className="font-bold text-xs">ig</span>
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <SendIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 pt-2">
            <h5 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-wide">
              Quick Links
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold text-gray-700">
              {coursePackages.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => {
                      const el = document.getElementById(`package-${p.id}`);
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-orange-500 transition-colors text-left uppercase"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Details */}
          <div className="space-y-3 pt-2">
            <h5 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-wide">
              Contact Us
            </h5>
            
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-700">
              <a
                href="tel:+916265083155"
                className="flex items-center space-x-3 hover:text-orange-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-semibold">(+91) 6265 083 155</span>
              </a>

              <a
                href="mailto:support@skillgrowind.com"
                className="flex items-center space-x-3 hover:text-orange-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-semibold">support@skillgrowind.com</span>
              </a>

              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-semibold">Zone-2, MP Nagar, Bhopal, India</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-200 text-center text-[11px] text-gray-500 space-y-1">
            <p>© 2026 Skill Grow IND. All Rights Reserved.</p>
            <p className="italic font-serif text-gray-400">Earn knowledge ! Earn money</p>
          </div>

        </div>
      </footer>

      {/* 8. FLOATING "NEED HELP" BUTTON (Visible in all screenshots) */}
      <FloatingNeedHelp />

      {/* Package Detail Modal (When user clicks "View 👁") */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-black text-lg text-orange-500 uppercase">
                  {selectedPackage.name}
                </h4>
                <p className="text-xs text-gray-500">{selectedPackage.tagline}</p>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {selectedPackage.description}
            </p>

            <div>
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Modules & Skills Covered:
              </h5>
              <div className="space-y-1.5">
                {selectedPackage.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-xs font-medium text-slate-700 bg-gray-50 p-2 rounded-lg"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-orange-500">
                  ₹{selectedPackage.price.toFixed(2)} /-
                </div>
                <div className="text-[11px] text-gray-400 line-through">
                  ₹{selectedPackage.originalPrice.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPackage(null);
                  handleEnrollClick(selectedPackage);
                }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md hover:opacity-95"
              >
                Enroll Now ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Success Notification Modal */}
      {isEnrollSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-scale-up">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Enrollment Portal</h4>
              <p className="text-xs text-gray-600">
                You selected <span className="font-bold text-orange-500">{enrolledPackageName}</span>.
              </p>
              <p className="text-[11px] text-gray-500">
                Your affiliate account will track this commission instantly in your Earning Dashboard!
              </p>
            </div>

            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsEnrollSuccessModalOpen(false);
                  onNavigateToDashboard();
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
              >
                Open My Earning Dashboard
              </button>

              <button
                onClick={() => setIsEnrollSuccessModalOpen(false)}
                className="w-full bg-gray-100 text-gray-700 font-semibold text-xs py-2 rounded-xl"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function SendIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}
