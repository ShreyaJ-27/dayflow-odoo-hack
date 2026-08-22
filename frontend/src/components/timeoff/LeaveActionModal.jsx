import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { CheckCircle2, XCircle, Calendar, MessageSquare, AlertTriangle, ShieldAlert } from 'lucide-react';
import { getLeaveTypeBadge } from '../../utils/helpers';

export const LeaveActionModal = ({ isOpen, onClose, request, actionType, onConfirm }) => {
  const [remarks, setRemarks] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setRemarks('');
    setValidationError('');
  }, [isOpen, request, actionType]);

  if (!request) return null;

  const isApprove = actionType === 'approve';

  const handleProceed = (e) => {
    e.preventDefault();
    if (!isApprove && (!remarks || !remarks.trim())) {
      setValidationError('Please specify a rejection reason for the employee.');
      return;
    }
    onConfirm(request.id, remarks);
    setRemarks('');
    setValidationError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isApprove ? "Authorize Leave Request" : "Confirm Request Rejection"}
      subtitle={`Request ID: ${request.id}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleProceed} className="space-y-4 text-xs">
        
        {/* Rejection Warning Banner */}
        {!isApprove && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 animate-in fade-in">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-white text-xs">Rejection Confirmation</h5>
              <p className="text-[11px] text-rose-300/90 mt-0.5 leading-relaxed">
                You are about to decline this leave request. This decision will update employee status immediately.
              </p>
            </div>
          </div>
        )}

        {/* Request Overview Card */}
        <div className="p-4 rounded-2xl bg-[#161928] border border-[#23273a] space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={request.avatar}
              alt={request.employeeName}
              className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/10"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{request.employeeName}</h4>
              <p className="text-slate-400">{request.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/5 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Leave Type</span>
              <span className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[11px] font-semibold ${getLeaveTypeBadge(request.leaveType)}`}>
                {request.leaveType}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Duration</span>
              <span className="font-semibold text-white mt-0.5 block">
                {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'} ({request.startDate} to {request.endDate})
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <span className="text-slate-500 block text-[10px] uppercase">Employee Stated Reason</span>
            <p className="text-slate-200 mt-1 italic leading-relaxed">
              "{request.reason}"
            </p>
          </div>
        </div>

        {/* Admin Comments Input */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
              <span>Admin Review Notes</span>
              {!isApprove && <span className="text-rose-400 font-bold">* (Required)</span>}
            </span>
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder={
              isApprove
                ? "Optional comment (e.g. Approved. Team coverage confirmed.)"
                : "Specify exact reason for declining (e.g. Overlapping project sprint deadline)..."
            }
            className={`w-full bg-[#161928] border rounded-xl p-3 text-white text-xs placeholder:text-slate-600 focus:outline-none transition-colors ${
              validationError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#23273a] focus:border-brand-500'
            }`}
          />
          {validationError && (
            <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {validationError}
            </p>
          )}
        </div>

        {/* Action confirmation buttons */}
        <div className="mt-6 pt-4 border-t border-[#23273a] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-surface-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-lg transition-all ${
              isApprove
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
            }`}
          >
            {isApprove ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Approval
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Decline Request
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
