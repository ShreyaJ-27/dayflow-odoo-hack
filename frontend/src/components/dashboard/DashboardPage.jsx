import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StatCard } from '../common/StatCard';
import { toast } from 'sonner';
import {
  Users,
  Clock,
  CalendarCheck2,
  TrendingUp,
  UserCheck,
  UserX,
  CheckCircle2,
  Building2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (v) => v ? new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtTime = (v) => v ? new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
const fmtCurrency = (v) => v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—';

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 w-full bg-white/5 rounded-3xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white/5 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-white/5 rounded-2xl" />
        <div className="h-72 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

function ErrorDashboard({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>
      <div className="text-center">
        <h3 className="text-white font-bold">Dashboard failed to load</h3>
        <p className="text-sm text-slate-400 mt-1">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}

// ─── Admin/HR Dashboard ───────────────────────────────────────────────────────

function AdminDashboard({ data, user }) {
  const navigate = useNavigate();
  const roleRoot = `/${user.role.toLowerCase()}`;

  // today attendance counts
  const counts = {};
  if (Array.isArray(data.todayAttendance)) {
    data.todayAttendance.forEach((item) => {
      counts[item.status] = item._count?._all || item._count || 0;
    });
  }

  const presentCount = counts.PRESENT || 0;
  const leaveCount = counts.LEAVE || 0;
  const halfDayCount = counts.HALF_DAY || 0;
  const absentCount = counts.ABSENT || 0;
  const totalCheckedIn = presentCount + halfDayCount;

  const greetingName = user.profile?.firstName || user.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#161928] via-[#131622] to-brand-950/30 border border-[#23273a] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {user.role === 'ADMIN' ? 'Admin Dashboard' : 'HR Dashboard'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            Good morning, {greetingName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's your organizational pulse for today.
          </p>
        </div>
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={() => navigate(`${roleRoot}/employees`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e2235] hover:bg-[#232845] border border-slate-700/60 text-xs font-semibold text-slate-200 hover:text-white transition-all"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Directory
          </button>
          <button
            onClick={() => navigate(`${roleRoot}/leave`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.02] transition-all"
          >
            <CalendarCheck2 className="w-3.5 h-3.5" />
            Leave Approvals ({data.pendingLeaveRequests || 0})
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Total Workforce"
          value={data.employeeCount ?? 0}
          subtitle={`${data.activeEmployees ?? 0} active on roster`}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Today's Attendance"
          value={`${totalCheckedIn}`}
          subtitle={`of ${data.employeeCount ?? 0} checked in`}
          icon={TrendingUp}
          color="emerald"
          trend={{ value: `${absentCount} absent`, isPositive: absentCount === 0, label: "today" }}
        />
        <StatCard
          title="Pending Leave"
          value={data.pendingLeaveRequests ?? 0}
          subtitle="Awaiting authorization"
          icon={CalendarCheck2}
          color="amber"
        />
        <StatCard
          title="On Leave Today"
          value={leaveCount}
          subtitle="Authorized absences"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's attendance breakdown */}
        <div className="lg:col-span-2 rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl p-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#23273a]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Today at a glance</h3>
                <p className="text-xs text-slate-400">Real-time attendance summary</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`${roleRoot}/attendance`)}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View Full Log <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Present', count: presentCount, color: 'bg-emerald-400', text: 'text-emerald-400' },
              { label: 'Absent', count: absentCount, color: 'bg-rose-400', text: 'text-rose-400' },
              { label: 'Half-Day', count: halfDayCount, color: 'bg-amber-400', text: 'text-amber-400' },
              { label: 'On Leave', count: leaveCount, color: 'bg-brand-400', text: 'text-brand-400' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-2xl bg-[#161928] border border-[#23273a] flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-slate-400">{item.label}</span>
                </div>
                <span className={`text-2xl font-black ${item.text}`}>{item.count}</span>
              </div>
            ))}
          </div>

          {/* Attendance rate bar */}
          {data.employeeCount > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Attendance rate</span>
                <span className="font-bold text-emerald-400">
                  {Math.round((totalCheckedIn / data.employeeCount) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#161928] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${Math.round((totalCheckedIn / data.employeeCount) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl p-5">
          <div className="pb-3 border-b border-[#23273a]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h4 className="text-sm font-bold text-white">Quick Actions</h4>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { label: 'Manage Employees', icon: Users, path: `${roleRoot}/employees` },
              { label: 'Attendance Log', icon: Clock, path: `${roleRoot}/attendance` },
              { label: 'Leave Requests', icon: CalendarCheck2, path: `${roleRoot}/leave` },
              { label: 'Payroll Records', icon: TrendingUp, path: `${roleRoot}/payroll` },
              { label: 'Reports', icon: Building2, path: `${roleRoot}/reports` },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161928] hover:bg-[#1e2235] border border-[#23273a] hover:border-brand-500/30 text-xs font-semibold text-slate-300 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 transition-colors" />
                    {item.label}
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-brand-400 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Dashboard ────────────────────────────────────────────────────────

function EmployeeDashboard({ data, user }) {
  const navigate = useNavigate();
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [attendance, setAttendance] = useState(data.todayAttendance);

  const greetingName = user.profile?.firstName || user.email?.split('@')[0] || 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const result = await api.checkIn();
      setAttendance(result.data);
      toast.success('Checked in successfully!');
    } catch (err) {
      toast.error(err.message || 'Unable to check in');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    try {
      const result = await api.checkOut();
      setAttendance(result.data);
      toast.success('Checked out successfully!');
    } catch (err) {
      toast.error(err.message || 'Unable to check out');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#161928] via-[#131622] to-brand-950/30 border border-[#23273a] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            My Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            {greeting}, {greetingName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's what's happening in your workday.
          </p>
        </div>
      </div>

      {/* Attendance Hero */}
      <div className="p-6 rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">TODAY'S ATTENDANCE</span>
          <h2 className="text-lg font-black text-white mt-1">
            {attendance?.checkIn
              ? attendance?.checkOut
                ? 'Day complete ✓'
                : 'You are checked in'
              : 'Ready when you are'}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {attendance?.checkIn
              ? `Checked in at ${fmtTime(attendance.checkIn)}${attendance.checkOut ? ` · Checked out at ${fmtTime(attendance.checkOut)}` : ''}`
              : 'Start your day with a single click.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckIn}
            disabled={!!attendance?.checkIn || checkingIn}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-sm font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {checkingIn ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Checking in...</> : <><Clock className="w-4 h-4" />Check in</>}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!attendance?.checkIn || !!attendance?.checkOut || checkingOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e2235] hover:bg-[#232845] border border-slate-700 text-sm font-semibold text-slate-200 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingOut ? <><div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />Checking out...</> : 'Check out'}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Current Salary"
          value={data.salarySummary?.netSalary != null ? fmtCurrency(data.salarySummary.netSalary) : '—'}
          subtitle="Net monthly take-home"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Leave Requests"
          value={data.recentLeaves?.length || 0}
          subtitle="Recent requests on record"
          icon={CalendarCheck2}
          color="amber"
        />
        <StatCard
          title="Notifications"
          value={data.unreadNotifications || 0}
          subtitle="Unread alerts"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Recent Leave Requests */}
      <div className="rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl p-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#23273a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <CalendarCheck2 className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Recent Leave Requests</h3>
          </div>
          <button
            onClick={() => navigate('/employee/leave')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            Apply for leave <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {data.recentLeaves?.length > 0 ? (
          <div className="mt-4 divide-y divide-[#23273a]/60">
            {data.recentLeaves.slice(0, 5).map((leave) => (
              <div key={leave.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{leave.type}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      leave.status === 'APPROVED' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                      leave.status === 'REJECTED' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                      leave.status === 'CANCELLED' ? 'bg-slate-500/15 text-slate-300 border border-slate-500/30' :
                      'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {fmtDate(leave.startDate)} — {fmtDate(leave.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center py-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs text-slate-400">No leave requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main DashboardPage Component ────────────────────────────────────────────

export const DashboardPage = () => {
  const { user, role, isAdminOrHR } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = isAdminOrHR
        ? await api.adminDashboard()
        : await api.employeeDashboard();
      setData(result.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [isAdminOrHR]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <LoadingDashboard />;
  if (error) return <ErrorDashboard error={error} onRetry={fetchDashboard} />;
  if (!data) return null;

  if (isAdminOrHR) {
    return <AdminDashboard data={data} user={user} />;
  }
  return <EmployeeDashboard data={data} user={user} />;
};

export default DashboardPage;
