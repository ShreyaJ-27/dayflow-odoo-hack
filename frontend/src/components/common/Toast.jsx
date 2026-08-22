import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert, Sparkles } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useHRMS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-brand-500/40';
        let bgClass = 'bg-[#131622]/95';
        let iconColor = 'text-brand-400';
        let accentGlow = 'shadow-[0_8px_30px_rgba(168,85,247,0.2)]';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40';
          iconColor = 'text-emerald-400';
          accentGlow = 'shadow-[0_8px_30px_rgba(16,185,129,0.2)]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/40';
          iconColor = 'text-rose-400';
          accentGlow = 'shadow-[0_8px_30px_rgba(244,63,94,0.2)]';
        } else if (toast.type === 'warning') {
          Icon = ShieldAlert;
          borderClass = 'border-amber-500/40';
          iconColor = 'text-amber-400';
          accentGlow = 'shadow-[0_8px_30px_rgba(245,158,11,0.2)]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${borderClass} ${bgClass} ${accentGlow} backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-top-4 fade-in`}
          >
            <div className={`p-1.5 rounded-xl bg-white/5 shrink-0 mt-0.5 ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white tracking-wide">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
