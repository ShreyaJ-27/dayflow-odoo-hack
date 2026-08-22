import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  Bell,
  BellOff,
  CheckCheck,
  AlertCircle,
  RefreshCw,
  Info,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  Calendar
} from 'lucide-react';

const fmtRelative = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const typeIcon = (type) => {
  const map = {
    ATTENDANCE: Clock,
    LEAVE: Calendar,
    PAYROLL: FileText,
    GENERAL: Info,
    EMPLOYEE: Users,
  };
  return map[type] || Bell;
};

const typeColor = (type) => {
  const map = {
    ATTENDANCE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    LEAVE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    PAYROLL: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    GENERAL: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    EMPLOYEE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return map[type] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
};

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.notifications();
      setNotifications(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    try {
      await api.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      // Silently ignore
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error(err.message || 'Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 font-medium animate-pulse">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Activity updates and alerts from Dayflow.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e2235] hover:bg-[#232845] border border-slate-700/60 text-xs font-semibold text-slate-200 hover:text-white transition-all"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            {markingAll ? 'Marking...' : 'Mark all read'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <AlertCircle className="w-8 h-8 text-rose-400" />
          <p className="text-sm text-slate-400">{error}</p>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold">
            <RefreshCw className="w-4 h-4" />Retry
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <div className="p-6 rounded-2xl bg-[#131622] border border-[#23273a]">
            <BellOff className="w-10 h-10 text-slate-600 mx-auto" />
          </div>
          <h3 className="font-bold text-white">No notifications</h3>
          <p className="text-sm text-slate-400">You're all caught up! Nothing to see here.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#131622] border border-[#23273a] overflow-hidden">
          <div className="divide-y divide-[#23273a]/60">
            {notifications.map((n) => {
              const Icon = typeIcon(n.type);
              const iconCls = typeColor(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkRead(n.id)}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors cursor-pointer group ${
                    n.isRead ? 'opacity-60' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${iconCls}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-semibold ${n.isRead ? 'text-slate-400' : 'text-white'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-[10px] text-slate-600 whitespace-nowrap">{fmtRelative(n.createdAt)}</span>
                        {!n.isRead && <div className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;