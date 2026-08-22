import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { EmployeeLayout } from '../layouts/EmployeeLayout'
import { LoginPage } from '../pages/LoginPage'
import { SignupPage } from '../pages/SignupPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return <Routes><Route element={<AuthLayout />}><Route path="/login" element={<LoginPage />} /><Route path="/signup" element={<SignupPage />} /></Route><Route path="/employee" element={<ProtectedRoute><EmployeeLayout /></ProtectedRoute>}><Route index element={<PlaceholderPage title="Good morning, Alex" description="Your employee workspace is ready for the next layer of Dayflow." />} /><Route path="profile" element={<PlaceholderPage title="My profile" description="Your personal and employment details will live here." />} /><Route path="attendance" element={<PlaceholderPage title="Attendance" description="A clear view of your working hours and attendance history." />} /><Route path="time-off" element={<PlaceholderPage title="Time off" description="Request and keep track of your time away from work." />} /><Route path="payroll" element={<PlaceholderPage title="Payroll" description="Your payslips and compensation details will be available here." />} /></Route><Route path="*" element={<Navigate to="/login" replace />} /></Routes>
}