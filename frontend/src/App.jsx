import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HRMSProvider } from './context/HRMSContext';
import { TopNav } from './components/common/TopNav';
import { ToastContainer } from './components/common/Toast';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { EmployeeList } from './components/employee/EmployeeList';
import { AttendancePage } from './components/attendance/AttendancePage';
import { TimeOffPage } from './components/timeoff/TimeOffPage';
import { Layers, ShieldCheck } from 'lucide-react';

export function App() {
  return (
    <HRMSProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-200">
          {/* Persistent Top Navigation Bar */}
          <TopNav />

          {/* Main Dashboard Workspace Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/time-off" element={<TimeOffPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          {/* Subtle System Footer */}
          <footer className="border-t border-[#23273a]/60 bg-[#0c0e17] py-4 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-brand-600/30 flex items-center justify-center border border-brand-500/40">
                  <Layers className="w-3 h-3 text-brand-400" />
                </div>
                <span className="font-bold text-slate-300">Dayflow HRMS</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">Officer & Admin Workspace</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Role Guard
                </span>
                <span>v2.5.0-executive</span>
              </div>
            </div>
          </footer>

          {/* Toast Notification Container (Top-Right) */}
          <ToastContainer />
        </div>
      </BrowserRouter>
    </HRMSProvider>
  );
}

export default App;
