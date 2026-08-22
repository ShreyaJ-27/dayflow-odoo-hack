import React, { useState, useMemo } from 'react';
import { Table } from '../common/Table';
import { getStatusBadgeStyle, getLeaveTypeBadge } from '../../utils/helpers';
import { Check, X, Calendar, MessageSquare, Clock } from 'lucide-react';

export const TimeOffTable = ({
  requests,
  onApproveClick,
  onRejectClick,
  onOpenEmployeeProfile,
  loading = false,
  selectedIds = [],
  onToggleSelect = null,
  onSelectAll = null
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return requests.slice(start, start + pageSize);
  }, [requests, currentPage, pageSize]);

  // Check if all pending requests on current page are selected
  const pendingOnPage = paginatedRequests.filter((r) => r.status === 'Pending');
  const allPendingSelected =
    pendingOnPage.length > 0 && pendingOnPage.every((r) => selectedIds.includes(r.id));
  const somePendingSelected =
    pendingOnPage.some((r) => selectedIds.includes(r.id)) && !allPendingSelected;

  const columns = [
    { header: 'Employee', className: 'min-w-[220px]' },
    { header: 'Leave Type', className: 'min-w-[120px]' },
    { header: 'Duration & Dates', className: 'min-w-[170px]' },
    { header: 'Status', className: 'min-w-[120px]' },
    { header: 'Reason & Notes', className: 'min-w-[200px]' },
    { header: 'Decision', align: 'right', className: 'min-w-[140px]' }
  ];

  const renderRow = (req) => {
    const isPending = req.status === 'Pending';
    const isChecked = selectedIds.includes(req.id);

    return (
      <tr
        key={req.id}
        className={`hover:bg-white/[0.02] transition-colors group ${
          isChecked ? 'bg-brand-500/[0.06]' : ''
        }`}
      >
        {/* Bulk Selection Checkbox */}
        <td className="px-4 py-4 text-center">
          {isPending ? (
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggleSelect && onToggleSelect(req.id)}
              className="w-4 h-4 rounded bg-[#131622] border-[#23273a] text-brand-600 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
            />
          ) : (
            <span className="text-slate-600 text-xs">—</span>
          )}
        </td>

        {/* Employee Info */}
        <td className="px-4 py-4 whitespace-nowrap">
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

        {/* Duration & Dates */}
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>
              {req.startDate} → {req.endDate}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            <span className="font-bold text-slate-300">
              {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
            </span>
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
        <td className="px-4 py-4 whitespace-nowrap text-right">
          {isPending ? (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => onRejectClick(req)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold transition-all hover:scale-105 active:scale-95"
                title="Decline Request"
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
  };

  return (
    <Table
      columns={columns}
      data={paginatedRequests}
      loading={loading}
      emptyType="leave"
      emptyTitle="No time off requests found"
      emptyDescription="No leave requests match your search or selected category filter."
      renderRow={renderRow}
      selectable={true}
      allSelected={allPendingSelected}
      isIndeterminate={somePendingSelected}
      onSelectAll={(checked) => onSelectAll && onSelectAll(checked, pendingOnPage.map((r) => r.id))}
      pagination={{
        currentPage,
        totalItems: requests.length,
        pageSize,
        onPageChange: setCurrentPage,
        onPageSizeChange: (s) => {
          setPageSize(s);
          setCurrentPage(1);
        },
        pageSizeOptions: [5, 10, 20]
      }}
    />
  );
};
