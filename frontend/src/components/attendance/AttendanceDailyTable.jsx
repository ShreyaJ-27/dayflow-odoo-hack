import React from 'react';
import { getStatusBadgeStyle } from '../../utils/helpers';
import { Clock, AlertTriangle, CheckCircle2, Edit2, ArrowRight } from 'lucide-react';

export const AttendanceDailyTable = ({ records, onEditRecord, onOpenEmployeeProfile }) => {
  if (records.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#131622] border border-[#23273a] flex flex-col items-center justify-center">
        <Clock className="w-12 h-12 text-slate-500 mb-3" />
        <h3 className="text-base font-bold text-white">No attendance records found</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          No records matched the selected date and filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#161928] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-[#23273a]">
            <tr>
              <th className="px-5 py-4">Employee</th>
              <th className="px-4 py-4">Check-In</th>
              <th className="px-4 py-4">Check-Out</th>
              <th className="px-4 py-4">Total Hours</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Notes / Flags</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23273a]/60">
            {records.map((rec) => {
              return (
                <tr
                  key={rec.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Employee Info */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div
                      onClick={() => onOpenEmployeeProfile(rec.employeeId)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={rec.avatar}
                        alt={rec.employeeName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-brand-500 transition-all"
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-brand-300 transition-colors">
                          {rec.employeeName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">{rec.department}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({rec.employeeId})</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Check-In Time */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-mono text-slate-200 font-medium">
                      {rec.checkIn !== '-' ? rec.checkIn : <span className="text-slate-500">—</span>}
                    </div>
                  </td>

                  {/* Check-Out Time */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-mono text-slate-200 font-medium">
                      {rec.checkOut !== '-' ? rec.checkOut : <span className="text-slate-500">—</span>}
                    </div>
                  </td>

                  {/* Total Hours */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-bold text-white font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>{rec.totalHours}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${getStatusBadgeStyle(
                        rec.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          rec.status === 'Present'
                            ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                            : rec.status === 'Absent'
                            ? 'bg-rose-400'
                            : rec.status === 'Half-day'
                            ? 'bg-amber-400'
                            : 'bg-brand-400'
                        }`}
                      />
                      {rec.status}
                    </span>
                  </td>

                  {/* Notes / Late / Overtime */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {rec.isLate && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" /> Late Arrival
                        </span>
                      )}
                      {rec.overtime && rec.overtime !== '-' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          +{rec.overtime} OT
                        </span>
                      )}
                      {!rec.isLate && (!rec.overtime || rec.overtime === '-') && (
                        <span className="text-[11px] text-slate-500">Regular shift</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onEditRecord(rec)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-slate-700/60 text-slate-300 hover:text-white font-medium transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-brand-400" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
