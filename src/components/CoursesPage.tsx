import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  PlayCircle,
  Clock,
  CheckCircle2,
  Award,
  Download,
  Search,
  Filter,
  Layers,
  ArrowLeft,
  ChevronRight,
  Video,
  FileText,
  Lock,
  Flame,
} from 'lucide-react';
import { CourseItem, UserProfile } from '../types';
import { coursePackages } from '../data/coursesData';
import { PackageBox3D } from './PackageBox3D';
import confetti from 'canvas-confetti';

interface CoursesPageProps {
  courses: CourseItem[];
  profile: UserProfile;
  onNavigate: (view: any) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ courses, profile, onNavigate }) => {
  const [selectedTab, setSelectedTab] = useState<'my-courses' | 'all-packages' | 'certificates'>('my-courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourseVideo, setActiveCourseVideo] = useState<CourseItem | null>(courses[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [certDownloaded, setCertDownloaded] = useState(false);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadCertificate = () => {
    setCertDownloaded(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCertDownloaded(false), 3000);
  };

  return (
    <div id="courses-page" className="w-full bg-[#FAF9F6] min-h-screen text-slate-900 pb-16 font-['Poppins',sans-serif]">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <span className="text-[11px] font-bold bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
              {profile.packageTier} Active
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Skill Grow Learning Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100">
              Master high-income digital skills, complete video modules, and download verified certificates.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedTab('my-courses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                selectedTab === 'my-courses'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>My Enrolled Courses ({courses.length})</span>
            </button>

            <button
              onClick={() => setSelectedTab('all-packages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                selectedTab === 'all-packages'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explore All Packages ({coursePackages.length})</span>
            </button>

            <button
              onClick={() => setSelectedTab('certificates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                selectedTab === 'certificates'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificates</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* TAB 1: MY ENROLLED COURSES & VIDEO PLAYER */}
        {selectedTab === 'my-courses' && (
          <div className="space-y-6">
            
            {/* Active Video Player Simulator */}
            {activeCourseVideo && (
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
                <div className="relative aspect-video bg-slate-950 flex items-center justify-center group overflow-hidden">
                  <img
                    src={activeCourseVideo.thumbnail}
                    alt={activeCourseVideo.title}
                    className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-80' : 'opacity-40'}`}
                  />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute z-10 w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 active:scale-95"
                  >
                    <PlayCircle className="w-10 h-10" />
                  </button>

                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>HD 1080p · Skill Grow Video Masterclass</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/70 px-2.5 py-1 rounded-md text-white text-[11px] font-mono">
                    {activeCourseVideo.duration}
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {activeCourseVideo.category}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activeCourseVideo.duration} Total Duration</span>
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeCourseVideo.title}
                  </h2>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600 font-medium">
                      <span>Course Progress</span>
                      <span className="font-bold text-slate-900">{activeCourseVideo.progress}% Completed</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${activeCourseVideo.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Course List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-slate-900">
                All Training Modules ({filteredCourses.length})
              </h3>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                />
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => {
                    setActiveCourseVideo(course);
                    setIsPlaying(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`bg-white rounded-2xl border p-3.5 sm:p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between space-y-3 ${
                    activeCourseVideo?.id === course.id
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-gray-200/90'
                  }`}
                >
                  <div className="flex space-x-3">
                    <div className="w-24 h-18 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative group">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {course.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {course.duration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-gray-100">
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Completed</span>
                      <span className="font-bold text-emerald-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: EXPLORE ALL PACKAGES */}
        {selectedTab === 'all-packages' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-200 p-4 rounded-2xl flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-orange-600 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-800 font-medium">
                Want to upgrade your skills or promote higher commission tiers? Explore all 5 Skill Grow packages below with interactive 3D package models!
              </p>
            </div>

            <div className="space-y-6">
              {coursePackages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* 3D Box Header */}
                  <div className="bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50 border-b border-gray-100">
                    <PackageBox3D pkg={pkg} />
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-black text-orange-500 uppercase">{pkg.name}</span>
                          <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                            {pkg.studentsEnrolled} Students
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{pkg.tagline}</p>
                      </div>

                      {/* Right Side: Package Amount & Discount Amount */}
                      <div className="text-left sm:text-right flex flex-col items-start sm:items-end justify-center">
                        <div className="text-xl font-black text-orange-500 tracking-tight leading-none">
                          ₹{pkg.price.toFixed(2)} /-
                        </div>
                        <div className="flex items-center space-x-1.5 mt-1">
                          <span className="text-xs text-gray-400 line-through font-medium">
                            ₹{pkg.originalPrice.toFixed(2)}
                          </span>
                          <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">
                            {pkg.discountPercentage}% OFF
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Included Modules:
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-medium"
                          >
                            ✓ {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-emerald-600 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified Certificate Included
                      </span>

                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs hover:opacity-95 active:scale-95 transition-all"
                      >
                        Promote & Earn Commission ➔
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VERIFIED CERTIFICATES */}
        {selectedTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm space-y-6">
              
              {/* Certificate Preview Card */}
              <div className="relative border-4 border-double border-amber-600/40 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 rounded-2xl p-6 sm:p-10 text-center space-y-4 shadow-md">
                
                <div className="flex items-center justify-center space-x-2">
                  <div className="font-['Poppins'] font-black text-2xl text-slate-900">
                    <span className="text-orange-500">Skill</span>Grow <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded">IND</span>
                  </div>
                </div>

                <p className="text-[11px] tracking-widest text-gray-500 uppercase font-semibold">
                  Certificate of Professional Achievement
                </p>

                <div className="py-2">
                  <p className="text-xs text-gray-500 italic">This is proudly awarded to</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-orange-600 font-serif mt-1">
                    {profile.name}
                  </h3>
                  <p className="text-[11px] text-gray-400">Affiliate ID: {profile.referralId}</p>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
                  For successfully mastering the <strong>{profile.packageTier}</strong> curriculum covering Digital Marketing, Graphic Design, Lead Generation, and Affiliate Growth Strategies.
                </p>

                <div className="pt-6 flex items-center justify-between border-t border-amber-200/80 text-[10px] text-gray-500">
                  <div>
                    <p className="font-bold text-slate-800">ISO 9001:2015</p>
                    <p>Verified Training Partner</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-amber-400 bg-amber-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Skill Grow IND</p>
                    <p>Authorized Certificate Authority</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleDownloadCertificate}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{certDownloaded ? 'Downloaded Successfully! ✓' : 'Download High-Res PDF Certificate'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
