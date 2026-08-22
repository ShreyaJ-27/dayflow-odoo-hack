import React, { useState, useMemo } from 'react';
import { Table } from '../common/Table';
import { getStatusBadgeStyle } from '../../utils/helpers';
import { Clock, AlertTriangle, Edit2 } from 'lucide-react';

export const AttendanceDailyTable = ({ records, onEditRecord, onOpenEmployeeProfile, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return records.slice(start, start + pageSize);
  }, [records, currentPage, pageSize]);

  const columns = [
    { header: 'Employee', className: 'min-w-[220px]' },
    { header: 'Check-In', className: 'min-w-[100px]' },
    { header: 'Check-Out', className: 'min-w-[100px]' },
    { header: 'Total Hours', className: 'min-w-[110px]' },
    { header: 'Status', className: 'min-w-[120px]' },
    { header: 'Notes / Flags', className: 'min-w-[140px]' },
    { header: 'Actions', align: 'right', className: 'min-w-[100px]' }
  ];

  const renderRow = (rec) => (
    <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors group">
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

      {/* Check-In */}
      <td className="px-4 py-4 whitespace-nowrap font-mono text-slate-200 font-medium">
        {rec.checkIn !== '-' ? rec.checkIn : <span className="text-slate-500">—</span>}
      </td>

      {/* Check-Out */}
      <td className="px-4 py-4 whitespace-nowrap font-mono text-slate-200 font-medium">
        {rec.checkOut !== '-' ? rec.checkOut : <span className="text-slate-500">—</span>}
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
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${getStatusBadgeStyle(rec.status)}`}>
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
            <span className="text-[11px] text-slate-500">Standard shift</span>
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

  return (
    <Table
      columns={columns}
      data={paginatedRecords}
      loading={loading}
      emptyType="attendance"
      emptyTitle="No attendance records found"
      emptyDescription="No employee check-ins matching this date or status filter."
      renderRow={renderRow}
      pagination={{
        currentPage,
        totalItems: records.length,
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
