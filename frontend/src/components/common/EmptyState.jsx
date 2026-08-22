import React from 'react';
import { Search, Calendar, Clock, Sparkles } from 'lucide-react';

export const EmptyState = ({
  type = 'search',
  title = 'No records found',
  description = 'Try adjusting your filters or search terms.',
  actionText,
  onAction
}) => {
  const renderIllustration = () => {
    switch (type) {
      case 'search':
        return (
          <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            {/* Ambient glowing circles */}
            <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-[#161928] border border-[#23273a] shadow-2xl flex items-center justify-center">
              <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="16" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
                <circle cx="28" cy="28" r="10" fill="#a855f7" fillOpacity="0.15" stroke="#c084fc" strokeWidth="2" />
                <path d="M40 40L54 54" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
                <circle cx="24" cy="24" r="2.5" fill="#f3e8ff" />
                <path d="M48 20L52 24M52 20L48 24" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-[#161928] border border-[#23273a] shadow-2xl flex items-center justify-center">
              <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="14" width="40" height="38" rx="8" stroke="#10b981" strokeWidth="2.5" fill="#10b981" fillOpacity="0.1" />
                <path d="M12 24H52" stroke="#10b981" strokeWidth="2" />
                <path d="M22 10V16M42 10V16" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                <circle cx="32" cy="38" r="7" stroke="#38bdf8" strokeWidth="2" />
                <path d="M32 34V38L35 40" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        );

      case 'timeoff':
      case 'leave':
        return (
          <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-[#161928] border border-[#23273a] shadow-2xl flex items-center justify-center">
              <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="16" y="10" width="32" height="44" rx="6" stroke="#8b5cf6" strokeWidth="2.5" fill="#8b5cf6" fillOpacity="0.1" />
                <rect x="24" y="6" width="16" height="8" rx="3" fill="#a855f7" />
                <path d="M24 24H40M24 32H36M24 40H32" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" />
                <circle cx="44" cy="44" r="8" fill="#10b981" />
                <path d="M41 44L43.5 46.5L47 42" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-xl" />
            <div className="relative w-24 h-24 rounded-3xl bg-[#161928] border border-[#23273a] shadow-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-brand-400" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl flex flex-col items-center justify-center animate-in fade-in duration-200">
      {renderIllustration()}
      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1.5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-xs font-semibold bg-brand-500/15 text-brand-300 hover:bg-brand-500/25 border border-brand-500/30 rounded-xl transition-all shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
