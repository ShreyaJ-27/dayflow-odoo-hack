import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useHRMS } from '../../context/HRMSContext';
import { NotificationPanel } from './NotificationPanel';
import {
  Users,
  Clock,
  CalendarCheck2,
  Bell,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Sparkles,
  LogOut,
  User,
  Settings,
  Layers
} from 'lucide-react';

export const TopNav = () => {
  const { role, toggleRole, currentUser, pendingLeavesCount, notifications } = useHRMS();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/employees', label: 'Employee', icon: Users, badge: null },
    { to: '/attendance', label: 'Attendance', icon: Clock, badge: null },
    { to: '/time-off', label: 'Time Off', icon: CalendarCheck2, badge: pendingLeavesCount > 0 ? pendingLeavesCount : null }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#23273a] bg-[#0c0e17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* LEFT: Logo Branding */}
          <div className="flex items-center gap-8">
            <NavLink to="/employees" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-fuchsia flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform duration-200">
                <Layers className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white font-sans">Dayflow</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    HRMS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">Admin Workspace</span>
              </div>
            </NavLink>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[#141624]/70 p-1 rounded-xl border border-[#23273a]">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.to) || (item.to === '/employees' && location.pathname === '/');

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.35)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== null && (
                      <span className={`px-1.5 py-0.2 text-[11px] font-bold rounded-full ${
                        isActive 
                          ? 'bg-white text-brand-700' 
                          : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* RIGHT: Role Switcher, Notifications, User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Role Switcher Pill */}
            <div className="flex items-center">
              <button
                onClick={toggleRole}
                title="Click to switch between Administrator and HR Officer role"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  role === 'admin'
                    ? 'bg-brand-500/10 border-brand-500/30 text-brand-300 hover:bg-brand-500/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                }`}
              >
                {role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                    <span className="hidden sm:inline">Role:</span>
                    <span className="font-bold">Admin</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Role:</span>
                    <span className="font-bold">HR Officer</span>
                  </>
                )}
                <span className="text-[10px] text-slate-400 opacity-60 ml-0.5">⇄</span>
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className={`relative p-2.5 rounded-xl border transition-all duration-200 ${
                  isNotifOpen
                    ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                    : 'bg-[#141624] border-[#23273a] text-slate-400 hover:text-white hover:border-slate-700'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              <NotificationPanel
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-[#141624] border border-[#23273a] hover:border-slate-700 transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-brand-500/40"
                />
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-semibold text-white leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {role === 'admin' ? 'Super Admin' : 'HR Officer'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-[#131622] border border-[#23273a] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-4 border-b border-[#23273a] bg-[#161928]">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                        role === 'admin' 
                          ? 'bg-brand-500/15 text-brand-300 border-brand-500/30' 
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {role === 'admin' ? 'Administrator Privilege' : 'HR Officer Privilege'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 divide-y divide-[#23273a]/50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          toggleRole();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors text-left"
                      >
                        <Sparkles className="w-4 h-4 text-brand-400" />
                        Switch to {role === 'admin' ? 'HR Officer View' : 'Admin View'}
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert('Dayflow System: Logged out demo session.');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden py-2.5 border-t border-[#23273a] gap-2 overflow-x-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.to) || (item.to === '/employees' && location.pathname === '/');

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-[#141624]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-brand-500/20 text-brand-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Simple My Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#131622] border border-[#23273a] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                <p className="text-xs text-brand-400 font-semibold">{currentUser.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs bg-[#161928] p-4 rounded-xl border border-[#23273a]">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Current Role</span>
                <span className="font-semibold text-white uppercase">{role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold text-white">Management & HR Operations</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Access Level</span>
                <span className="font-semibold text-emerald-400">
                  {role === 'admin' ? 'Unrestricted (Salary & System)' : 'HR Management (Restricted Salary)'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
