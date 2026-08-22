import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHRMS } from '../../context/HRMSContext';
import { StatCard } from '../common/StatCard';
import { StatGridSkeleton } from '../common/SkeletonLoader';
import { useMockFetch } from '../../hooks/useMockFetch';
import { getStatusBadgeStyle, getLeaveTypeBadge } from '../../utils/helpers';
import {
  Users,
  Clock,
  CalendarCheck2,
  TrendingUp,
  UserCheck,
  UserX,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  UserPlus
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    role,
    currentUser,
    employees,
    attendance,
    leaveRequests,
    approveLeave,
    rejectLeave,
    openEmployeeProfile
  } = useHRMS();

  // Simulated fetch with smooth skeleton loading
  const { loading } = useMockFetch({ employees, attendance, leaveRequests }, 300);

  // Calculations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.employmentStatus === 'Active').length;
  const onLeaveEmployees = employees.filter((e) => e.employmentStatus === 'On Leave').length;
  const probationEmployees = employees.filter((e) => e.employmentStatus === 'Probation').length;

  const presentCount = attendance.filter((r) => r.status === 'Present').length;
  const absentCount = attendance.filter((r) => r.status === 'Absent').length;
  const halfDayCount = attendance.filter((r) => r.status === 'Half-day').length;
  const attendanceRate = totalEmployees > 0 ? Math.round(((presentCount + halfDayCount * 0.5) / totalEmployees) * 100) : 0;

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending');
  const pendingCount = pendingLeaves.length;
  const approvedThisMonth = leaveRequests.filter((r) => r.status === 'Approved').length;

  // Department distribution
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="h-16 w-1/3 bg-white/5 rounded-2xl skeleton-shimmer" />
        <StatGridSkeleton count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-white/5 rounded-2xl skeleton-shimmer" />
          <div className="h-72 bg-white/5 rounded-2xl skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome & Role Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#161928] via-[#131622] to-brand-950/30 border border-[#23273a] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Executive Dashboard
            </span>
            <span className="text-xs text-slate-400 font-medium">Aug 22, 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Logged in with <strong className="text-brand-300">{role === 'admin' ? 'Super Administrator' : 'HR Officer'}</strong> clearance. Here is your organizational pulse today.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-slate-700/60 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Directory</span>
          </button>

          <button
            onClick={() => navigate('/time-off')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.02] transition-all"
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Review Approvals ({pendingCount})</span>
          </button>
        </div>
      </div>

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Workforce"
          value={totalEmployees}
          subtitle={`${activeEmployees} active on roster`}
          icon={Users}
          color="purple"
          trend={{ value: `${probationEmployees} on probation`, isPositive: true, label: "review pending" }}
        />
        <StatCard
          title="Today's Attendance"
          value={`${attendanceRate}%`}
          subtitle={`${presentCount} of ${totalEmployees} checked in`}
          icon={TrendingUp}
          color="emerald"
          trend={{ value: `${absentCount} absent today`, isPositive: absentCount === 0, label: "status" }}
        />
        <StatCard
          title="Pending Time Off"
          value={pendingCount}
          subtitle="Awaiting officer decision"
          icon={CalendarCheck2}
          color="amber"
          trend={{ value: `${approvedThisMonth} approved`, isPositive: true, label: "this month" }}
        />
        <StatCard
          title="Staff On Leave"
          value={onLeaveEmployees}
          subtitle="Authorized PTO today"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Main Row: Attendance Gauge & Pending Approvals Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent Action Queue: Pending Leaves (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#23273a]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Pending Leave Requests</h3>
                  <p className="text-xs text-slate-400">Items requiring immediate HR/Admin authorization</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/time-off')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>View All ({leaveRequests.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Request Items */}
            <div className="mt-4 divide-y divide-[#23273a]/60">
              {pendingLeaves.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  All leave requests are up to date! Zero pending items.
                </div>
              ) : (
                pendingLeaves.slice(0, 3).map((req) => (
                  <div key={req.id} className="py-3.5 flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.avatar}
                        alt={req.employeeName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{req.employeeName}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${getLeaveTypeBadge(req.leaveType)}`}>
                            {req.leaveType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {req.startDate} to {req.endDate} ({req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}) • <span className="italic text-slate-300">"{req.reason}"</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => rejectLeave(req.id, 'Declined via Dashboard')}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveLeave(req.id, 'Approved via Dashboard')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#23273a] flex items-center justify-between text-xs text-slate-400">
            <span>Showing {Math.min(pendingLeaves.length, 3)} of {pendingLeaves.length} pending items</span>
            <button
              onClick={() => navigate('/time-off')}
              className="text-brand-400 hover:underline font-medium"
            >
              Open Full Approvals Table →
            </button>
          </div>
        </div>

        {/* Attendance Pulse & Department Summary (1 Column) */}
        <div className="space-y-6">
          
          {/* Turnout Gauge Card */}
          <div className="rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#23273a]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Daily Attendance Ratio</h4>
              </div>
              <button
                onClick={() => navigate('/attendance')}
                className="text-xs text-brand-400 hover:underline"
              >
                Log Details
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Turnout Capacity</span>
                  <span className="font-bold text-emerald-400">{attendanceRate}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#161928] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
              </div>

              {/* Status pills breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#161928] border border-[#23273a] flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Present
                  </span>
                  <span className="font-bold text-white">{presentCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#161928] border border-[#23273a] flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Absent
                  </span>
                  <span className="font-bold text-white">{absentCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#161928] border border-[#23273a] flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Half-Day
                  </span>
                  <span className="font-bold text-white">{halfDayCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#161928] border border-[#23273a] flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-400" /> On Leave
                  </span>
                  <span className="font-bold text-white">{onLeaveEmployees}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#23273a]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-400" />
                <h4 className="text-sm font-bold text-white">Department Headcount</h4>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              {Object.entries(departmentCounts).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-300">{dept}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{count}</span>
                    <span className="text-[10px] text-slate-500">
                      ({Math.round((count / totalEmployees) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
