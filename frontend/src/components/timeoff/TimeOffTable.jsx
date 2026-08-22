import React from 'react';
import { getStatusBadgeStyle, getLeaveTypeBadge, formatDate } from '../../utils/helpers';
import { Check, X, Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const TimeOffTable = ({ requests, onApproveClick, onRejectClick, onOpenEmployeeProfile }) => {
  if (requests.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#131622] border border-[#23273a] flex flex-col items-center justify-center">
        <Calendar className="w-12 h-12 text-slate-500 mb-3" />
        <h3 className="text-base font-bold text-white">No leave requests found</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          No records match the current status filter.
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
              <th className="px-4 py-4">Time Off Type</th>
              <th className="px-4 py-4">Duration & Dates</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Reason & Admin Notes</th>
              <th className="px-5 py-4 text-right">Decision / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23273a]/60">
            {requests.map((req) => {
              const isPending = req.status === 'Pending';

              return (
                <tr
                  key={req.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Employee Info */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div
                      onClick={() => onOpenEmployeeProfile(req.employeeId)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={req.avatar}
                        alt={req.employeeName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-brand-500 transition-all"
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-brand-300 transition-colors">
                          {req.employeeName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">{req.department}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({req.id})</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Leave Type */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-semibold text-xs ${getLeaveTypeBadge(
                        req.leaveType
                      )}`}
                    >
                      {req.leaveType}
                    </span>
                  </td>

                  {/* Duration and Dates */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <Calendar className="w-3.5 h-3.5 text-brand-400" />
                      <span>
                        {req.startDate} → {req.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      <span className="font-bold text-slate-300">{req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}</span>
                      <span className="text-slate-500 ml-1.5">Applied: {req.appliedOn}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${getStatusBadgeStyle(
                        req.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          req.status === 'Approved'
                            ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                            : req.status === 'Rejected'
                            ? 'bg-rose-400'
                            : 'bg-amber-400 animate-pulse'
                        }`}
                      />
                      {req.status}
                    </span>
                  </td>

                  {/* Reason & Admin Remark */}
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-slate-200 line-clamp-1 italic font-medium">"{req.reason}"</p>
                    {req.adminRemarks && (
                      <div className="flex items-center gap-1 text-[11px] text-brand-300 mt-1 line-clamp-1">
                        <MessageSquare className="w-3 h-3 shrink-0" />
                        <span>Admin: {req.adminRemarks}</span>
                      </div>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    {isPending ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onRejectClick(req)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold transition-all hover:scale-105 active:scale-95"
                          title="Reject Request"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => onApproveClick(req)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95"
                          title="Approve Request"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-surface-100 rounded-lg">
                        {req.status === 'Approved' ? '✓ Authorized' : '✗ Declined'}
                      </span>
                    )}
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
