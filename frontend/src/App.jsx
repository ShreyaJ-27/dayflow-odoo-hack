import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

// Auth
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/auth/ForgotPasswordPage';

// Layout
import { Sidebar } from './components/common/Sidebar';
import { AppHeader } from './components/common/AppHeader';

// Dashboard
import { DashboardPage } from './components/dashboard/DashboardPage';

// Employee Management
import { EmployeeList } from './components/employee/EmployeeList';

// Attendance
import { AttendancePage } from './components/attendance/AttendancePage';

// Leave / Time Off
import { TimeOffPage } from './components/timeoff/TimeOffPage';

// Pages (to be connected to real API)
import { PayrollPage } from './pages/PayrollPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReportsPage } from './pages/ReportsPage';

// HRMSContext (for legacy UI state — toasts, modals, mock data kept for attendance/employee UI)
import { HRMSProvider } from './context/HRMSContext';

// Toast
import { ToastContainer } from './components/common/Toast';

import api from './services/api';

// ─── App Shell (authenticated) ────────────────────────────────────────────────

function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Fetch unread notification count
  useEffect(() => {
    api.unreadCount()
      .then((r) => setUnreadCount(r.data?.count || 0))
      .catch(() => {}); // Silently ignore
  }, [location.pathname]); // Refresh on every page navigation

  return (
    <div className="flex h-screen overflow-hidden bg-[#090a0f] text-slate-100 font-sans selection:bg-brand-500/30 selection:text-brand-200">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
          unreadCount={unreadCount}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Role-based redirect ───────────────────────────────────────────────────────

function RoleRedirect() {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (!role) return <Navigate to="/login" replace />;
  return <Navigate to={`/${role.toLowerCase()}/dashboard`} replace />;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Root redirect */}
      <Route path="/" element={<RoleRedirect />} />

      {/* ── ADMIN routes ─────────────────────────────────────────────────── */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><DashboardPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><EmployeeList /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><AttendancePage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leave"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><TimeOffPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payroll"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><PayrollPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/documents"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><DocumentsPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><NotificationsPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><ReportsPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppShell><ProfilePage /></AppShell>
          </ProtectedRoute>
        }
      />

      {/* ── HR routes ────────────────────────────────────────────────────── */}
      <Route
        path="/hr/dashboard"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><DashboardPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><EmployeeList /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/attendance"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><AttendancePage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/leave"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><TimeOffPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/payroll"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><PayrollPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/documents"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><DocumentsPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/notifications"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><NotificationsPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/reports"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><ReportsPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/profile"
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <AppShell><ProfilePage /></AppShell>
          </ProtectedRoute>
        }
      />

      {/* ── EMPLOYEE routes ───────────────────────────────────────────────── */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <AppShell><DashboardPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <AppShell><AttendancePage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/leave"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <AppShell><TimeOffPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/payroll"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <AppShell><PayrollPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/documents"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <AppShell><DocumentsPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/notifications"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <AppShell><NotificationsPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <AppShell><ProfilePage /></AppShell>
          </ProtectedRoute>
        }
      />

      {/* Catch-all → role-based redirect */}
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export function App() {
  return (
    <AuthProvider>
      <HRMSProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                background: '#131622',
                border: '1px solid #23273a',
                color: '#e2e8f0',
              },
            }}
          />
          <AppRoutes />
          <ToastContainer />
        </BrowserRouter>
      </HRMSProvider>
    </AuthProvider>
  );
}

export default App;
