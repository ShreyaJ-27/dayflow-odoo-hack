import React, { useState, useMemo } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { AttendanceDateFilter } from './AttendanceDateFilter';
import { AttendanceDailyTable } from './AttendanceDailyTable';
import { AttendanceWeeklyGrid } from './AttendanceWeeklyGrid';
import { MarkAttendanceModal } from './MarkAttendanceModal';
import { EmployeeProfileModal } from '../employee/EmployeeProfileModal';
import { StatCard } from '../common/StatCard';
import { useMockFetch } from '../../hooks/useMockFetch';
import { exportAttendanceToCSV } from '../../utils/csvExport';
import { Clock, UserCheck, UserX, AlertTriangle, CalendarRange, TrendingUp, Download } from 'lucide-react';

export const AttendancePage = () => {
  const { attendance, selectedDate, setSelectedDate, openEmployeeProfile, addToast } = useHRMS();

  const [viewType, setViewType] = useState('daily'); // 'daily' | 'weekly'
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Simulated fetch
  const { loading } = useMockFetch(attendance, 350, [selectedDate, selectedDept, selectedStatus, viewType]);

  // Filtered daily records
  const filteredAttendance = useMemo(() => {
    return attendance.filter((rec) => {
      const matchDept = selectedDept === 'All' || rec.department === selectedDept;
      const matchStatus = selectedStatus === 'All' || rec.status === selectedStatus;
      return matchDept && matchStatus;
    });
  }, [attendance, selectedDept, selectedStatus]);

  // Metric stats
  const totalEmployees = attendance.length;
  const presentCount = attendance.filter((r) => r.status === 'Present').length;
  const absentCount = attendance.filter((r) => r.status === 'Absent').length;
  const halfDayCount = attendance.filter((r) => r.status === 'Half-day').length;
  const leaveCount = attendance.filter((r) => r.status === 'Leave').length;
  const attendanceRate = totalEmployees > 0 ? Math.round(((presentCount + halfDayCount * 0.5) / totalEmployees) * 100) : 0;

  const handleEditRecord = (rec) => {
    setEditingRecord(rec);
    setIsMarkModalOpen(true);
  };

  const handleOpenNewMarkModal = () => {
    setEditingRecord(null);
    setIsMarkModalOpen(true);
  };

  const handleExportCSV = () => {
    exportAttendanceToCSV(filteredAttendance, selectedDate);
    addToast({
      type: 'success',
      title: 'CSV Export Started',
      message: `Downloaded attendance report for ${filteredAttendance.length} employees.`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Attendance Management</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
              {presentCount}/{totalEmployees} Present Today
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time daily check-in auditing, time off logs, shift timesheets, and weekly attendance rosters.
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Present Today"
          value={presentCount}
          subtitle="On schedule"
          icon={UserCheck}
          color="emerald"
          trend={{ value: `${attendanceRate}%`, isPositive: true, label: "turnout" }}
        />
        <StatCard
          title="Absent"
          value={absentCount}
          subtitle="Unexcused / Missing"
          icon={UserX}
          color="rose"
        />
        <StatCard
          title="Half-Day"
          value={halfDayCount}
          subtitle="Partial shifts"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="On Leave"
          value={leaveCount}
          subtitle="Authorized PTO"
          icon={CalendarRange}
          color="purple"
        />
        <StatCard
          title="Turnout Rate"
          value={`${attendanceRate}%`}
          subtitle="Organizational average"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Date & Filter Controls Bar */}
      <AttendanceDateFilter
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        viewType={viewType}
        setViewType={setViewType}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onOpenMarkModal={handleOpenNewMarkModal}
        onExportCSV={handleExportCSV}
      />

      {/* Main Table / Grid View */}
      {viewType === 'daily' ? (
        <AttendanceDailyTable
          records={filteredAttendance}
          onEditRecord={handleEditRecord}
          onOpenEmployeeProfile={openEmployeeProfile}
          loading={loading}
        />
      ) : (
        <AttendanceWeeklyGrid onOpenEmployeeProfile={openEmployeeProfile} />
      )}

      {/* Modals */}
      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => {
          setIsMarkModalOpen(false);
          setEditingRecord(null);
        }}
        initialData={editingRecord}
      />

      <EmployeeProfileModal />
    </div>
  );
};
