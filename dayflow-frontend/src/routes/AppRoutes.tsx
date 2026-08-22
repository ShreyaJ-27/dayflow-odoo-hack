import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthLayout } from '../layouts/AuthLayout'
import { EmployeeLayout } from '../layouts/EmployeeLayout'

import { LoginPage } from '../pages/LoginPage'
import { SignupPage } from '../pages/SignupPage'
import { EmployeeDashboardPage } from '../pages/EmployeeDashboardPage'
import { ProfilePage } from '../pages/ProfilePage'
import { AttendancePage } from '../pages/AttendancePage'
import { TimeOffPage } from '../pages/TimeOffPage'
import { PayrollPage } from '../pages/PayrollPage'

import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />
      </Route>

      {/* Employee */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route
          index
          element={<EmployeeDashboardPage />}
        />

        {/* Profile */}
        <Route
          path="profile"
          element={<ProfilePage />}
        />

        {/* Attendance */}
        <Route
          path="attendance"
          element={<AttendancePage />}
        />

        {/* Time Off */}
        <Route
          path="time-off"
          element={<TimeOffPage />}
        />

        {/* Payroll */}
        <Route
          path="payroll"
          element={<PayrollPage />}
        />
      </Route>

      {/* Unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  )
}
