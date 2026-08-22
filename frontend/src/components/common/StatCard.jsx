import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'purple', trend }) => {
  const colorMap = {
    purple: {
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
      icon: 'text-brand-400',
      glow: 'group-hover:border-brand-500/40'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      glow: 'group-hover:border-emerald-500/40'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      glow: 'group-hover:border-amber-500/40'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      icon: 'text-rose-400',
      glow: 'group-hover:border-rose-500/40'
    },
    blue: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      icon: 'text-sky-400',
      glow: 'group-hover:border-sky-500/40'
    }
  };

  const scheme = colorMap[color] || colorMap.purple;

  return (
    <div className={`group glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-200 ${scheme.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.border} border`}>
            <Icon className={`w-5 h-5 ${scheme.icon}`} />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center text-xs text-slate-400">
          <span className={trend.isPositive ? 'text-emerald-400 font-medium mr-1.5' : 'text-rose-400 font-medium mr-1.5'}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
};
