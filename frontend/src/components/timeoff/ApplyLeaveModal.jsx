import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Modal } from '../common/Modal';
import { CalendarPlus, Send } from 'lucide-react';

export const ApplyLeaveModal = ({ isOpen, onClose }) => {
  const { employees, applyLeaveRequest } = useHRMS();

  const [form, setForm] = useState({
    employeeId: employees[0]?.id || '',
    leaveType: 'Paid Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    totalDays: 2,
    reason: ''
  });

  const handleEmpChange = (empId) => {
    setForm((prev) => ({ ...prev, employeeId: empId }));
  };

  const handleDatesChange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setForm((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
      totalDays: isNaN(diffDays) ? 1 : diffDays
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === form.employeeId) || employees[0];
    if (!emp) return;

    applyLeaveRequest({
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      avatar: emp.avatar,
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      totalDays: Number(form.totalDays) || 1,
      reason: form.reason || 'Leave requested by HR administration.'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Leave Request"
      subtitle="Log time off on behalf of employee"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Employee</label>
          <select
            value={form.employeeId}
            onChange={(e) => handleEmpChange(e.target.value)}
            className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id} className="bg-[#131622]">
                {emp.name} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Leave Category</label>
          <select
            value={form.leaveType}
            onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
            className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
          >
            <option value="Paid Leave">Paid Annual Vacation</option>
            <option value="Sick Leave">Sick / Medical Leave</option>
            <option value="Casual Leave">Casual / Personal Time Off</option>
            <option value="Unpaid Leave">Unpaid Leave of Absence</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => handleDatesChange(e.target.value, form.endDate)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => handleDatesChange(form.startDate, e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Total Days</label>
          <input
            type="number"
            min="1"
            value={form.totalDays}
            onChange={(e) => setForm({ ...form, totalDays: e.target.value })}
            className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Reason / Notes</label>
          <textarea
            rows={2}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Explain context for the leave request..."
            className="w-full bg-[#161928] border border-[#23273a] rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
          />
        </div>

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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
};
