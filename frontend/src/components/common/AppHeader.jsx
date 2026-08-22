import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, ChevronDown, ShieldCheck, LogOut, UserCircle, Menu } from 'lucide-react';

const getUserName = (user) => {
  if (user?.profile?.firstName && user?.profile?.lastName) {
    return `${user.profile.firstName} ${user.profile.lastName}`;
  }
  return user?.email?.split('@')[0] || 'User';
};

const getUserInitials = (user) => {
  if (user?.profile?.firstName && user?.profile?.lastName) {
    return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
  }
  return (user?.email?.[0] || 'U').toUpperCase();
};

const getPageTitle = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  // e.g. /admin/dashboard → Dashboard
  const last = segments[segments.length - 1];
  if (!last) return 'Dashboard';
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
};

export const AppHeader = ({ onMobileMenuToggle, unreadCount = 0 }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const name = getUserName(user);
  const initials = getUserInitials(user);
  const pageTitle = getPageTitle(location.pathname);

  const roleLabel = role === 'ADMIN' ? 'Administrator' : role === 'HR' ? 'HR Officer' : 'Employee';
  const roleColor = role === 'ADMIN' ? 'text-brand-300 bg-brand-500/15 border-brand-500/30' :
    role === 'HR' ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' :
    'text-blue-300 bg-blue-500/15 border-blue-500/30';

  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 sm:px-6 bg-[#0c0e17]/95 backdrop-blur-md border-b border-[#23273a]">
      {/* Left: Mobile menu + Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-sm font-bold text-white leading-tight">{pageTitle}</h2>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            DAYFLOW / {role}
          </p>
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button
          onClick={() => navigate(`/${role?.toLowerCase()}/notifications`)}
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#141624] border border-[#23273a] text-slate-400 hover:text-white hover:border-slate-700 transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(168,85,247,0.8)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-[#141624] border border-[#23273a] hover:border-slate-700 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-semibold text-white leading-tight">{name}</span>
              <span className="text-[10px] text-slate-500">{roleLabel}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#131622] border border-[#23273a] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* User info header */}
              <div className="p-3.5 border-b border-[#23273a] bg-[#161928]">
                <p className="text-xs font-bold text-white truncate">{name}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleColor}`}>
                  <ShieldCheck className="w-2.5 h-2.5" />
                  {roleLabel}
                </span>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate(`/${role?.toLowerCase()}/profile`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors text-left"
                >
                  <UserCircle className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
