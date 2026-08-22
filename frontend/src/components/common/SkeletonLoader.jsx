import React from 'react';

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl animate-in fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#161928] border-b border-[#23273a]">
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-5 py-4">
                  <div className="h-3.5 w-20 bg-white/5 rounded-lg skeleton-shimmer" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23273a]/60">
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} className="p-4">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 skeleton-shimmer shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-28 bg-white/5 rounded skeleton-shimmer" />
                      <div className="h-2.5 w-16 bg-white/5 rounded skeleton-shimmer" />
                    </div>
                  </div>
                </td>
                {Array.from({ length: cols - 1 }).map((_, c) => (
                  <td key={c} className="px-4 py-4">
                    <div
                      className="h-3.5 bg-white/5 rounded skeleton-shimmer"
                      style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CardGridSkeleton = ({ cards = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-in fade-in">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 skeleton-shimmer shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-white/5 rounded skeleton-shimmer" />
              <div className="h-3 w-20 bg-white/5 rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="h-3 w-full bg-white/5 rounded skeleton-shimmer" />
            <div className="h-3 w-4/5 bg-white/5 rounded skeleton-shimmer" />
          </div>
          <div className="pt-2 border-t border-white/5 flex justify-between">
            <div className="h-3 w-20 bg-white/5 rounded skeleton-shimmer" />
            <div className="h-3 w-16 bg-white/5 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const StatGridSkeleton = ({ count = 4 }) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-${count} gap-3.5 sm:gap-4 animate-in fade-in`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-5 rounded-2xl space-y-3">
          <div className="h-3 w-20 bg-white/5 rounded skeleton-shimmer" />
          <div className="h-7 w-16 bg-white/5 rounded skeleton-shimmer" />
          <div className="h-2.5 w-28 bg-white/5 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
};
