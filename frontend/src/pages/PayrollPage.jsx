import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  FileText,
  TrendingUp,
  Calendar,
  AlertCircle,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  DollarSign
} from 'lucide-react';

const fmtCurrency = (v) => v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—';
const fmtDate = (v) => v ? new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

// ─── Status badge helper ─────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    ACTIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    INACTIVE: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    ON_LEAVE: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[status] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

// ─── Employee Payroll (Self-View) ─────────────────────────────────────────────
function EmployeePayroll() {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [curr, hist] = await Promise.all([
        api.myPayroll(),
        api.myPayrollHistory()
      ]);
      setCurrent(curr.data);
      setHistory(hist.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={load} />;

  if (!current) {
    return (
      <EmptyState
        title="No payroll record"
        description="No salary structure has been set up for your account yet. Please contact HR."
        icon={FileText}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          Payroll
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
            Current
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Your compensation details and salary structure.</p>
      </div>

      {/* Current Salary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161928] via-[#131622] to-brand-950/20 border border-[#23273a] shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">CURRENT SALARY</p>
            <div className="text-4xl font-black text-white tracking-tight">
              {fmtCurrency(current.netSalary)}
            </div>
            <p className="text-sm text-slate-400 mt-1">Monthly net take-home</p>
            <p className="text-xs text-slate-500 mt-0.5">Effective from {fmtDate(current.effectiveDate)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20">
            <DollarSign className="w-6 h-6 text-brand-400" />
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Basic Salary', value: fmtCurrency(current.basicSalary), color: 'text-white' },
            { label: 'Allowances', value: fmtCurrency(current.allowances), color: 'text-emerald-400' },
            { label: 'Gross Salary', value: fmtCurrency(current.grossSalary), color: 'text-brand-400' },
            { label: 'Deductions', value: fmtCurrency(current.deductions), color: 'text-rose-400' },
          ].map((item) => (
            <div key={item.label} className="p-3.5 rounded-xl bg-[#161928] border border-[#23273a]">
              <p className="text-[10px] text-slate-500 font-medium mb-1">{item.label}</p>
              <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History toggle */}
      {history.length > 1 && (
        <div className="rounded-2xl bg-[#131622] border border-[#23273a] overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              Salary History ({history.length} records)
            </div>
            {showHistory ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {showHistory && (
            <div className="border-t border-[#23273a] overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#161928] text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Effective Date</th>
                    <th className="px-5 py-3 text-right">Basic</th>
                    <th className="px-5 py-3 text-right">Allowances</th>
                    <th className="px-5 py-3 text-right">Deductions</th>
                    <th className="px-5 py-3 text-right">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23273a]/60">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-slate-300">{fmtDate(record.effectiveDate)}</td>
                      <td className="px-5 py-3 text-right">{fmtCurrency(record.basicSalary)}</td>
                      <td className="px-5 py-3 text-right text-emerald-400">{fmtCurrency(record.allowances)}</td>
                      <td className="px-5 py-3 text-right text-rose-400">{fmtCurrency(record.deductions)}</td>
                      <td className="px-5 py-3 text-right font-bold text-white">{fmtCurrency(record.netSalary)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-2.5 text-xs text-blue-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
        <p>Salary information is confidential. For questions about your compensation, contact HR.</p>
      </div>
    </div>
  );
}

// ─── Admin/HR Payroll ─────────────────────────────────────────────────────────
function AdminPayroll() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.reportPayroll();
      setRecords(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load payroll records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={load} />;

  const total = records.reduce((sum, r) => sum + (Number(r.netSalary) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Payroll Records</h1>
          <p className="text-sm text-slate-400 mt-1">Compensation overview across all employees.</p>
        </div>
      </div>

      {/* Aggregate metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#131622] border border-[#23273a]">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Monthly</p>
          <p className="text-2xl font-black text-brand-300 mt-1">{fmtCurrency(total)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#131622] border border-[#23273a]">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Employees</p>
          <p className="text-2xl font-black text-white mt-1">{records.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#131622] border border-[#23273a]">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Avg. Net Salary</p>
          <p className="text-2xl font-black text-emerald-300 mt-1">
            {records.length ? fmtCurrency(Math.round(total / records.length)) : '—'}
          </p>
        </div>
      </div>

      {records.length === 0 ? (
        <EmptyState title="No payroll records" description="No salary structures have been configured yet." icon={FileText} />
      ) : (
        <div className="rounded-2xl bg-[#131622] border border-[#23273a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#161928] text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-[#23273a]">
                <tr>
                  <th className="px-5 py-3 text-left">Employee</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-right">Basic</th>
                  <th className="px-5 py-3 text-right">Allowances</th>
                  <th className="px-5 py-3 text-right">Deductions</th>
                  <th className="px-5 py-3 text-right">Net Salary</th>
                  <th className="px-5 py-3 text-right">Effective</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23273a]/60">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-white">
                        {record.employee?.firstName} {record.employee?.lastName}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">{record.employee?.user?.employeeId}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{record.employee?.department || '—'}</td>
                    <td className="px-5 py-3.5 text-right text-slate-300">{fmtCurrency(record.basicSalary)}</td>
                    <td className="px-5 py-3.5 text-right text-emerald-400">{fmtCurrency(record.allowances)}</td>
                    <td className="px-5 py-3.5 text-right text-rose-400">{fmtCurrency(record.deductions)}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-white">{fmtCurrency(record.netSalary)}</td>
                    <td className="px-5 py-3.5 text-right text-slate-400">{fmtDate(record.effectiveDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-1/3 bg-white/5 rounded-xl" />
      <div className="h-40 bg-white/5 rounded-2xl" />
      <div className="h-60 bg-white/5 rounded-2xl" />
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <AlertCircle className="w-10 h-10 text-rose-400" />
      <p className="text-sm text-slate-400">{error}</p>
      <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors">
        <RefreshCw className="w-4 h-4" />Retry
      </button>
    </div>
  );
}

function EmptyState({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
      <div className="p-4 rounded-2xl bg-[#131622] border border-[#23273a]">
        <Icon className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm">{description}</p>
    </div>
  );
}

// ─── Exported PayrollPage ─────────────────────────────────────────────────────

export const PayrollPage = () => {
  const { isEmployee } = useAuth();
  return isEmployee ? <EmployeePayroll /> : <AdminPayroll />;
};

export default PayrollPage;