import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck2,
  FileText,
  Bell,
  ChartNoAxesCombined,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  Menu
} from 'lucide-react';

const getNavItems = (role) => {
  const base = [
    { to: `/${role}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { to: `/${role}/attendance`, label: 'Attendance', icon: Clock },
    { to: `/${role}/leave`, label: role === 'employee' ? 'Time Off' : 'Leave', icon: CalendarCheck2 },
    { to: `/${role}/payroll`, label: 'Payroll', icon: FileText },
    { to: `/${role}/documents`, label: 'Documents', icon: FileText },
    { to: `/${role}/notifications`, label: 'Notifications', icon: Bell },
  ];

  if (role === 'admin' || role === 'hr') {
    base.splice(1, 0, { to: `/${role}/employees`, label: 'Employees', icon: Users });
    base.push({ to: `/${role}/reports`, label: 'Reports', icon: ChartNoAxesCombined });
  }

  base.push({ to: `/${role}/profile`, label: 'Profile', icon: UserCircle });

  return base;
};

const getRoleBadge = (role) => {
  if (role === 'ADMIN') return { label: 'Administrator', color: 'brand' };
  if (role === 'HR') return { label: 'HR Officer', color: 'emerald' };
  return { label: 'Employee', color: 'blue' };
};

const getUserInitials = (user) => {
  if (user?.profile?.firstName && user?.profile?.lastName) {
    return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
  }
  return (user?.email?.[0] || 'U').toUpperCase();
};

const getUserName = (user) => {
  if (user?.profile?.firstName && user?.profile?.lastName) {
    return `${user.profile.firstName} ${user.profile.lastName}`;
  }
  return user?.email?.split('@')[0] || 'User';
};

export const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const roleKey = role?.toLowerCase() || 'employee';
  const navItems = getNavItems(roleKey);
  const badge = getRoleBadge(role);
  const initials = getUserInitials(user);
  const name = getUserName(user);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-[#0c0e17] border-r border-[#23273a] transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#23273a] ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-fuchsia flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.35)] shrink-0">
          <Layers className="w-4.5 h-4.5 text-white stroke-[2.2]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-base font-black text-white leading-tight">Dayflow</span>
            <span className="text-[10px] text-slate-500 font-medium">HRMS Platform</span>
          </div>
        )}
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex ml-auto items-center justify-center w-6 h-6 rounded-md text-slate-500 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="flex lg:hidden ml-auto items-center justify-center w-6 h-6 rounded-md text-slate-500 hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-[#23273a]">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            badge.color === 'brand' ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30' :
            badge.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
            'bg-blue-500/15 text-blue-300 border border-blue-500/30'
          }`}>
            <ShieldCheck className="w-3 h-3" />
            {badge.label}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={`border-t border-[#23273a] p-3 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        ) : (
          <div
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-xs font-bold text-white"
            title={name}
          >
            {initials}
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Sign out"
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="relative flex shrink-0">
            {sidebarContent}
          </div>
          {/* Scrim */}
          <button
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-label="Close navigation"
          />
        </div>
      )}
    </>
  );
};

export const MobileMenuButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex lg:hidden items-center justify-center w-9 h-9 rounded-xl bg-[#141624] border border-[#23273a] text-slate-400 hover:text-white transition-colors"
    aria-label="Open navigation"
  >
    <Menu className="w-4 h-4" />
  </button>
);

export default Sidebar;
