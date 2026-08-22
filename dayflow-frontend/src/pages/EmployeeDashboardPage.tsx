
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Timer,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Card } from '../components/ui/Card'

export function EmployeeDashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-(--brand)">
          Employee overview
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Good morning, {user?.fullName ?? 'Employee'}
        </h1>

        <p className="mt-2 text-sm text-(--muted)">
          Here's your workday at a glance.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-(--muted)">
                Attendance
              </p>

              <p className="mt-2 text-2xl font-semibold">
                Present
              </p>
            </div>

            <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
              <CalendarDays size={20} />
            </div>
          </div>

          <p className="mt-4 text-xs text-(--muted)">
            Today, August 22
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-(--muted)">
                Work hours
              </p>

              <p className="mt-2 text-2xl font-semibold">
                07h 32m
              </p>
            </div>

            <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
              <Clock3 size={20} />
            </div>
          </div>

          <p className="mt-4 text-xs text-(--muted)">
            Current working day
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-(--muted)">
                Time off
              </p>

              <p className="mt-2 text-2xl font-semibold">
                12 days
              </p>
            </div>

            <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
              <Timer size={20} />
            </div>
          </div>

          <p className="mt-4 text-xs text-(--muted)">
            Available balance
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-(--muted)">
                Payroll
              </p>

              <p className="mt-2 text-2xl font-semibold">
                August
              </p>
            </div>

            <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
              <FileText size={20} />
            </div>
          </div>

          <p className="mt-4 text-xs text-(--muted)">
            Latest payslip
          </p>
        </Card>
      </div>

      {/* Main dashboard sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Today's attendance
              </h2>

              <p className="mt-1 text-sm text-(--muted)">
                Keep track of your current workday.
              </p>
            </div>

            <Link
              to="/employee/attendance"
              className="flex items-center gap-1 text-sm font-semibold text-(--brand) hover:underline"
            >
              View attendance
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-(--line) p-5">
              <p className="text-sm text-(--muted)">
                Check in
              </p>

              <p className="mt-2 text-2xl font-semibold">
                09:18 AM
              </p>

              <p className="mt-2 text-xs text-(--muted)">
                On time
              </p>
            </div>

            <div className="rounded-xl border border-(--line) p-5">
              <p className="text-sm text-(--muted)">
                Check out
              </p>

              <p className="mt-2 text-2xl font-semibold">
                --:--
              </p>

              <p className="mt-2 text-xs text-(--muted)">
                Workday in progress
              </p>
            </div>
          </div>
        </Card>

        {/* Quick actions */}
        <Card>
          <h2 className="text-lg font-semibold">
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-(--muted)">
            Common employee actions.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              to="/employee/attendance"
              className="flex items-center justify-between rounded-xl border border-(--line) p-4 transition hover:bg-(--canvas)"
            >
              <div className="flex items-center gap-3">
                <Clock3 size={18} />

                <span className="text-sm font-semibold">
                  View attendance
                </span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link
              to="/employee/time-off"
              className="flex items-center justify-between rounded-xl border border-(--line) p-4 transition hover:bg-(--canvas)"
            >
              <div className="flex items-center gap-3">
                <CalendarDays size={18} />

                <span className="text-sm font-semibold">
                  Request time off
                </span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link
              to="/employee/payroll"
              className="flex items-center justify-between rounded-xl border border-(--line) p-4 transition hover:bg-(--canvas)"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} />

                <span className="text-sm font-semibold">
                  View payroll
                </span>
              </div>

              <ArrowRight size={16} />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

