import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { CalendarRange, Clock, Sparkles } from 'lucide-react';

export const AttendanceWeeklyGrid = ({ onOpenEmployeeProfile }) => {
  const { weeklyAttendance } = useHRMS();

  const daysHeader = [
    { name: 'Mon', date: 'Aug 17' },
    { name: 'Tue', date: 'Aug 18' },
    { name: 'Wed', date: 'Aug 19' },
    { name: 'Thu', date: 'Aug 20' },
    { name: 'Fri', date: 'Aug 21' },
    { name: 'Sat', date: 'Aug 22' },
    { name: 'Sun', date: 'Aug 23' }
  ];

  const getDayBadge = (status, hours) => {
    switch (status) {
      case 'Present':
        return (
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center">
              P
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1">{hours}h</span>
          </div>
        );
      case 'Half-day':
        return (
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center">
              HD
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-1">{hours}h</span>
          </div>
        );
      case 'Leave':
        return (
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-300 font-bold text-xs flex items-center justify-center">
              L
            </span>
            <span className="text-[10px] text-brand-400 font-mono mt-1">Paid</span>
          </div>
        );
      case 'Absent':
        return (
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center">
              A
            </span>
            <span className="text-[10px] text-rose-400 font-mono mt-1">0h</span>
          </div>
        );
      case 'Off':
      default:
        return (
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-xl bg-surface-100 border border-slate-700/50 text-slate-500 font-medium text-xs flex items-center justify-center">
              OFF
            </span>
            <span className="text-[10px] text-slate-600 font-mono mt-1">—</span>
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl">
      {/* Legend banner */}
      <div className="p-4 bg-[#161928] border-b border-[#23273a] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-white font-semibold">
          <CalendarRange className="w-4 h-4 text-brand-400" />
          <span>Weekly Timesheet Matrix (Week 34: Aug 17 - Aug 23, 2026)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Present (P)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Half-Day (HD)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400" /> Leave (L)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Off
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#141624] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-[#23273a]">
            <tr>
              <th className="px-5 py-4 min-w-[220px]">Employee</th>
              {daysHeader.map((d, idx) => (
                <th key={idx} className="px-3 py-4 text-center min-w-[90px]">
                  <div>{d.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{d.date}</div>
                </th>
              ))}
              <th className="px-5 py-4 text-right min-w-[120px]">Total Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23273a]/60">
            {weeklyAttendance.map((emp) => (
              <tr key={emp.employeeId} className="hover:bg-white/[0.02] transition-colors">
                {/* Employee column */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div
                    onClick={() => onOpenEmployeeProfile(emp.employeeId)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-brand-500 transition-all"
                    />
                    <div>
                      <div className="font-bold text-white group-hover:text-brand-300 transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{emp.department}</div>
                    </div>
                  </div>
                </td>

                {/* Day Columns */}
                {emp.days.map((dayItem, idx) => (
                  <td key={idx} className="px-3 py-4 text-center whitespace-nowrap">
                    {getDayBadge(dayItem.status, dayItem.hours)}
                  </td>
                ))}

                {/* Total weekly hours */}
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 font-mono font-bold text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{emp.totalWeeklyHours}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
