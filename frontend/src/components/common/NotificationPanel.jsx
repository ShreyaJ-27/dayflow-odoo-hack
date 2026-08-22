import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Clock, Check, Info } from 'lucide-react';

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useHRMS();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleItemClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#131622] border border-[#23273a] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#23273a] flex items-center justify-between bg-[#161928]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-400" />
          <h4 className="text-sm font-bold text-white">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#23273a]/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">No notifications yet</div>
        ) : (
          notifications.map((n) => {
            let Icon = Info;
            let iconColor = 'text-brand-400 bg-brand-500/10 border-brand-500/20';

            if (n.type === 'leave') {
              Icon = Calendar;
              iconColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            } else if (n.type === 'attendance') {
              Icon = Clock;
              iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            }

            return (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-4 flex items-start gap-3 hover:bg-white/[0.03] cursor-pointer transition-colors ${
                  n.unread ? 'bg-brand-500/[0.04]' : ''
                }`}
              >
                <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold ${n.unread ? 'text-white' : 'text-slate-300'}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.description}</p>
                </div>
                {n.unread && (
                  <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-[#23273a] bg-[#161928]/60 text-center">
        <span className="text-[11px] text-slate-400">Dayflow Activity Stream</span>
      </div>
    </div>
  );
};
