import React, { useState, useEffect } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Modal } from '../common/Modal';
import { Clock, Save, X } from 'lucide-react';

export const MarkAttendanceModal = ({ isOpen, onClose, initialData }) => {
  const { employees, updateAttendanceRecord, selectedDate } = useHRMS();

  const [record, setRecord] = useState({
    employeeId: '',
    date: selectedDate,
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
    totalHours: '8h 00m',
    status: 'Present',
    isLate: false,
    overtime: '-'
  });

  useEffect(() => {
    if (initialData) {
      setRecord({ ...initialData });
    } else if (employees.length > 0) {
      setRecord({
        id: `ATT-${Date.now().toString().slice(-4)}`,
        employeeId: employees[0].id,
        employeeName: employees[0].name,
        department: employees[0].department,
        avatar: employees[0].avatar,
        date: selectedDate,
        checkIn: '09:00 AM',
        checkOut: '05:00 PM',
        totalHours: '8h 00m',
        status: 'Present',
        isLate: false,
        overtime: '-'
      });
    }
  }, [initialData, employees, selectedDate]);

  const handleEmployeeSelect = (empId) => {
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setRecord((prev) => ({
        ...prev,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        avatar: emp.avatar
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialData?.id) {
      updateAttendanceRecord(initialData.id, record);
    } else {
      updateAttendanceRecord(record.id, record);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Attendance Record" : "Manual Attendance Log"}
      subtitle={`Date: ${record.date}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Select Employee</label>
          <select
            value={record.employeeId}
            onChange={(e) => handleEmployeeSelect(e.target.value)}
            disabled={!!initialData}
            className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 disabled:opacity-60"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id} className="bg-[#131622]">
                {emp.name} ({emp.department} - {emp.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Check-In Time</label>
            <input
              type="text"
              value={record.checkIn}
              onChange={(e) => setRecord({ ...record, checkIn: e.target.value })}
              placeholder="e.g. 09:00 AM"
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Check-Out Time</label>
            <input
              type="text"
              value={record.checkOut}
              onChange={(e) => setRecord({ ...record, checkOut: e.target.value })}
              placeholder="e.g. 05:00 PM"
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Total Hours</label>
            <input
              type="text"
              value={record.totalHours}
              onChange={(e) => setRecord({ ...record, totalHours: e.target.value })}
              placeholder="e.g. 8h 15m"
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Attendance Status</label>
            <select
              value={record.status}
              onChange={(e) => setRecord({ ...record, status: e.target.value })}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half-day">Half-day</option>
              <option value="Leave">Leave</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={record.isLate}
              onChange={(e) => setRecord({ ...record, isLate: e.target.checked })}
              className="rounded bg-[#161928] border-[#23273a] text-brand-600 focus:ring-brand-500"
            />
            <span>Mark as Late Arrival</span>
          </label>

          <div className="flex items-center gap-2 flex-1">
            <span className="text-slate-400">Overtime:</span>
            <input
              type="text"
              placeholder="e.g. 30m"
              value={record.overtime === '-' ? '' : record.overtime}
              onChange={(e) => setRecord({ ...record, overtime: e.target.value || '-' })}
              className="bg-[#161928] border border-[#23273a] rounded-lg px-2.5 py-1 text-white w-24"
            />
          </div>
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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30"
          >
            <Save className="w-4 h-4" />
            Save Attendance
          </button>
        </div>
      </form>
    </Modal>
  );
};
