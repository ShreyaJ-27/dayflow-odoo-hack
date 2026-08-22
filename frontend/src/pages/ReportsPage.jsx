import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  ChartNoAxesCombined,
  Users,
  Clock,
  CalendarCheck2,
  FileText,
  AlertCircle,
  RefreshCw,
  Download,
  TrendingUp
} from 'lucide-react';

const fmtDate = (v) => v ? new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtCurrency = (v) => v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—';

function ReportSection({ title, subtitle, icon: Icon, color, children, loading }) {
  const colorMap = {
    purple: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <div className="rounded-2xl bg-[#131622] border border-[#23273a] overflow-hidden shadow-xl">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#23273a]">
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-white/5 rounded-lg" />)}
          </div>
        ) : children}
      </div>
    </div>
  );
}

export const ReportsPage = () => {
  const [data, setData] = useState({
    attendance: null,
    leaves: null,
    payroll: null,
    employees: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [att, lv, pay, emp] = await Promise.allSettled([
        api.reportAttendance(),
        api.reportLeaves(),
        api.reportPayroll(),
        api.reportEmployees(),
      ]);
      setData({
        attendance: att.status === 'fulfilled' ? att.value.data : null,
        leaves: lv.status === 'fulfilled' ? lv.value.data : null,
        payroll: pay.status === 'fulfilled' ? pay.value.data : null,
        employees: emp.status === 'fulfilled' ? emp.value.data : null,
      });
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const AttendanceSummary = () => {
    if (!data.attendance) return <p className="text-xs text-slate-500">No data available.</p>;
    const records = Array.isArray(data.attendance) ? data.attendance : (data.attendance.records || []);
    const summary = {};
    records.forEach((r) => { summary[r.status] = (summary[r.status] || 0) + 1; });
    return (
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(summary).map(([status, count]) => (
          <div key={status} className="p-3 rounded-xl bg-[#161928] border border-[#23273a]">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">{status.replace('_', ' ')}</p>
            <p className="text-xl font-black text-white mt-0.5">{count}</p>
          </div>
        ))}
        {Object.keys(summary).length === 0 && <p className="text-xs text-slate-500 col-span-2">No attendance records found.</p>}
      </div>
    );
  };

  const LeavesSummary = () => {
    if (!data.leaves) return <p className="text-xs text-slate-500">No data available.</p>;
    const records = Array.isArray(data.leaves) ? data.leaves : (data.leaves.records || []);
    const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 };
    records.forEach((r) => { if (counts[r.status] !== undefined) counts[r.status]++; });
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Pending', count: counts.PENDING, color: 'text-amber-400' },
          { label: 'Approved', count: counts.APPROVED, color: 'text-emerald-400' },
          { label: 'Rejected', count: counts.REJECTED, color: 'text-rose-400' },
          { label: 'Cancelled', count: counts.CANCELLED, color: 'text-slate-400' },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-xl bg-[#161928] border border-[#23273a]">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">{item.label}</p>
            <p className={`text-xl font-black mt-0.5 ${item.color}`}>{item.count}</p>
          </div>
        ))}
      </div>
    );
  };

  const PayrollSummary = () => {
    if (!data.payroll) return <p className="text-xs text-slate-500">No data available.</p>;
    const records = Array.isArray(data.payroll) ? data.payroll : (data.payroll.records || []);
    const total = records.reduce((sum, r) => sum + (Number(r.netSalary) || 0), 0);
    const avg = records.length ? Math.round(total / records.length) : 0;
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Monthly', value: fmtCurrency(total), color: 'text-brand-300' },
          { label: 'Avg. Net Salary', value: fmtCurrency(avg), color: 'text-emerald-300' },
          { label: 'Records', value: records.length, color: 'text-white' },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-xl bg-[#161928] border border-[#23273a]">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">{item.label}</p>
            <p className={`text-xl font-black mt-0.5 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const EmployeesSummary = () => {
    if (!data.employees) return <p className="text-xs text-slate-500">No data available.</p>;
    const records = Array.isArray(data.employees) ? data.employees : (data.employees.records || []);
    const deptMap = {};
    const statusMap = {};
    records.forEach((e) => {
      const dept = e.department || 'Unknown';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
      const st = e.employmentStatus || 'Unknown';
      statusMap[st] = (statusMap[st] || 0) + 1;
    });
    return (
      <div className="space-y-4">
        <div>
          <p className="text-[10px] text-slate-500 font-semibold uppercase mb-2">By Status</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(statusMap).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#161928] border border-[#23273a]">
                <span className="text-xs text-slate-400">{status.replace('_', ' ')}</span>
                <span className="text-sm font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-semibold uppercase mb-2">By Department</p>
          <div className="space-y-1.5">
            {Object.entries(deptMap).sort(([, a], [, b]) => b - a).slice(0, 6).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#161928] border border-[#23273a]">
                <span className="text-xs text-slate-400">{dept}</span>
                <span className="text-xs font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <p className="text-sm text-slate-400">{error}</p>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold">
          <RefreshCw className="w-4 h-4" />Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Reports & Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Organization-wide insights across all modules.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e2235] hover:bg-[#232845] border border-slate-700/60 text-xs font-semibold text-slate-200 hover:text-white transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportSection title="Attendance Report" subtitle="Status breakdown" icon={Clock} color="emerald" loading={loading}>
          <AttendanceSummary />
        </ReportSection>

        <ReportSection title="Leave Report" subtitle="Request status summary" icon={CalendarCheck2} color="amber" loading={loading}>
          <LeavesSummary />
        </ReportSection>

        <ReportSection title="Payroll Report" subtitle="Compensation overview" icon={TrendingUp} color="purple" loading={loading}>
          <PayrollSummary />
        </ReportSection>

        <ReportSection title="Employee Report" subtitle="Workforce composition" icon={Users} color="blue" loading={loading}>
          <EmployeesSummary />
        </ReportSection>
      </div>
    </div>
  );
};

export default ReportsPage;