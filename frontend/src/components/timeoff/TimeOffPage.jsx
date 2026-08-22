import React, { useState, useMemo } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { TimeOffTable } from './TimeOffTable';
import { LeaveActionModal } from './LeaveActionModal';
import { ApplyLeaveModal } from './ApplyLeaveModal';
import { EmployeeProfileModal } from '../employee/EmployeeProfileModal';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import { useMockFetch } from '../../hooks/useMockFetch';
import { exportTimeOffToCSV } from '../../utils/csvExport';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Plus,
  Download,
  CheckSquare,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';

export const TimeOffPage = () => {
  const {
    leaveRequests,
    approveLeave,
    rejectLeave,
    bulkApproveLeaves,
    bulkRejectLeaves,
    openEmployeeProfile,
    addToast
  } = useHRMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [selectedType, setSelectedType] = useState('All');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkModal, setBulkModal] = useState({
    isOpen: false,
    action: 'approve', // 'approve' | 'reject'
    remarks: ''
  });

  // Simulated fetch
  const { loading } = useMockFetch(leaveRequests, 350, [selectedStatus, selectedType]);

  // Single Action Modal (Approve / Reject)
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    request: null,
    type: 'approve' // 'approve' | 'reject'
  });

  // Metrics
  const pendingCount = leaveRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter((r) => r.status === 'Rejected').length;
  const totalDaysApproved = leaveRequests
    .filter((r) => r.status === 'Approved')
    .reduce((acc, curr) => acc + (curr.totalDays || 0), 0);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const matchSearch =
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'All' || req.status === selectedStatus;
      const matchType = selectedType === 'All' || req.leaveType === selectedType;

      return matchSearch && matchStatus && matchType;
    });
  }, [leaveRequests, searchTerm, selectedStatus, selectedType]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked, pagePendingIds) => {
    if (checked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pagePendingIds])));
    } else {
      setSelectedIds((prev) => prev.filter((id) => !pagePendingIds.includes(id)));
    }
  };

  const handleApproveClick = (req) => {
    setActionModal({
      isOpen: true,
      request: req,
      type: 'approve'
    });
  };

  const handleRejectClick = (req) => {
    setActionModal({
      isOpen: true,
      request: req,
      type: 'reject'
    });
  };

  const handleConfirmDecision = (requestId, remarks) => {
    if (actionModal.type === 'approve') {
      approveLeave(requestId, remarks);
    } else {
      rejectLeave(requestId, remarks);
    }
  };

  const handleConfirmBulkAction = () => {
    if (bulkModal.action === 'approve') {
      bulkApproveLeaves(selectedIds, bulkModal.remarks || 'Bulk authorized by Admin.');
    } else {
      bulkRejectLeaves(selectedIds, bulkModal.remarks || 'Bulk declined by Admin.');
    }
    setSelectedIds([]);
    setBulkModal({ isOpen: false, action: 'approve', remarks: '' });
  };

  const handleExportCSV = () => {
    exportTimeOffToCSV(filteredRequests);
    addToast({
      type: 'success',
      title: 'CSV Export Generated',
      message: `Downloaded ${filteredRequests.length} leave request records.`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Time Off & Leave Approvals</span>
            {pendingCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold animate-pulse">
                {pendingCount} Pending Review
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Authorize PTO requests, review medical submissions, manage holiday scheduling, and audit employee balances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-slate-700/60 text-slate-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          subtitle="Requires officer action"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Approved Requests"
          value={approvedCount}
          subtitle="Authorized this month"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Days Granted"
          value={`${totalDaysApproved} days`}
          subtitle="Accumulated leave balance"
          icon={CalendarCheck2}
          color="purple"
        />
        <StatCard
          title="Declined"
          value={rejectedCount}
          subtitle="Policy / schedule conflicts"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#131622] border border-[#23273a] shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by employee, department, reason, or request ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter chips */}
          <div className="flex items-center bg-[#161928] border border-[#23273a] p-1 rounded-xl">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatus === status
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Leave Type filter */}
          <div className="flex items-center gap-1.5 bg-[#161928] border border-[#23273a] rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#131622]">All Categories</option>
              <option value="Paid Leave" className="bg-[#131622]">Paid Leave</option>
              <option value="Sick Leave" className="bg-[#131622]">Sick Leave</option>
              <option value="Casual Leave" className="bg-[#131622]">Casual Leave</option>
              <option value="Unpaid Leave" className="bg-[#131622]">Unpaid Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 px-5 rounded-2xl bg-gradient-to-r from-brand-900/90 via-[#181b2a] to-brand-900/90 border border-brand-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5 text-xs text-white font-semibold">
            <CheckSquare className="w-4 h-4 text-brand-400" />
            <span>
              <strong className="text-brand-300 font-bold">{selectedIds.length}</strong> request{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Deselect All
            </button>

            <button
              onClick={() => setBulkModal({ isOpen: true, action: 'reject', remarks: '' })}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
            >
              Bulk Reject
            </button>

            <button
              onClick={() => setBulkModal({ isOpen: true, action: 'approve', remarks: '' })}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
            >
              Bulk Approve
            </button>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <TimeOffTable
        requests={filteredRequests}
        onApproveClick={handleApproveClick}
        onRejectClick={handleRejectClick}
        onOpenEmployeeProfile={openEmployeeProfile}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
      />

      {/* Single Action Dialog (Approve / Reject with remarks) */}
      <LeaveActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, request: null, type: 'approve' })}
        request={actionModal.request}
        actionType={actionModal.type}
        onConfirm={handleConfirmDecision}
      />

      {/* Bulk Action Confirmation Modal */}
      {bulkModal.isOpen && (
        <Modal
          isOpen={bulkModal.isOpen}
          onClose={() => setBulkModal({ isOpen: false, action: 'approve', remarks: '' })}
          title={bulkModal.action === 'approve' ? "Confirm Bulk Leave Approval" : "Confirm Bulk Leave Rejection"}
          subtitle={`Processing ${selectedIds.length} selected employee requests`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            {bulkModal.action === 'reject' && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  You are rejecting {selectedIds.length} requests in batch. Please provide reasoning below.
                </p>
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                <span>Admin Batch Remark</span>
              </label>
              <textarea
                rows={2}
                value={bulkModal.remarks}
                onChange={(e) => setBulkModal((prev) => ({ ...prev, remarks: e.target.value }))}
                placeholder={bulkModal.action === 'approve' ? "Optional approval note..." : "Reason for declining requests..."}
                className="w-full bg-[#161928] border border-[#23273a] rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-500 text-xs"
              />
            </div>

            <div className="pt-3 border-t border-[#23273a] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBulkModal({ isOpen: false, action: 'approve', remarks: '' })}
                className="px-3.5 py-1.5 rounded-xl bg-surface-100 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkAction}
                className={`px-4 py-1.5 rounded-xl text-white font-bold shadow-md ${
                  bulkModal.action === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Confirm {bulkModal.action === 'approve' ? 'Approvals' : 'Rejections'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      {/* Global Profile Modal */}
      <EmployeeProfileModal />
    </div>
  );
};
