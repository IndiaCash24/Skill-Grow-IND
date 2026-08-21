import React from 'react';
import { X, PlayCircle, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { CourseItem } from '../types';

interface CoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseItem[];
}

export const CoursesModal: React.FC<CoursesModalProps> = ({ isOpen, onClose, courses }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        id="courses-modal-container"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-teal-200" />
            <div>
              <h3 className="font-bold text-lg">My Training Courses</h3>
              <p className="text-xs text-teal-100">Included in your Expert Package access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col sm:flex-row bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80 hover:shadow-md transition-shadow group"
            >
              <div className="sm:w-36 h-28 relative overflow-hidden bg-slate-800 shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-teal-700 mb-1">
                    <span className="bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {course.category}
                    </span>
                    <span className="text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {course.duration}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
                    {course.title}
                  </h4>
                </div>

                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold text-gray-800">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
