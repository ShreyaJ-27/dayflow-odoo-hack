import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../auth/AuthContext'
import { Card } from '../components/ui/Card'

import {
  checkIn,
  checkOut,
  getAttendanceHistory,
  getTodayAttendance,
} from '../services/attendance.service'

import type { AttendanceRecord } from '../services/attendance.service'

function formatTime(value: string | null) {
  if (!value) {
    return '--:--'
  }

  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(
    [],
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
}

function calculateWorkHours(record: AttendanceRecord) {
  if (!record.checkIn) {
    return '--'
  }

  const start = new Date(record.checkIn).getTime()
  const end = record.checkOut
    ? new Date(record.checkOut).getTime()
    : Date.now()

  const totalMinutes = Math.max(
    0,
    Math.floor((end - start) / 60000),
  )

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}h ${String(
    minutes,
  ).padStart(2, '0')}m`
}

export function AttendancePage() {
  const { user } = useAuth()

  const userId = user?.id ?? ''

  const [today, setToday] =
    useState<AttendanceRecord | null>(null)

  const [history, setHistory] = useState<
    AttendanceRecord[]
  >([])

  const loadAttendance = () => {
    if (!userId) {
      return
    }

    setToday(getTodayAttendance(userId))
    setHistory(getAttendanceHistory(userId))
  }

  useEffect(() => {
    loadAttendance()
  }, [userId])

  useEffect(() => {
    if (!today?.checkIn || today?.checkOut) {
      return
    }

    const interval = window.setInterval(() => {
      setToday((current) =>
        current ? { ...current } : current,
      )
    }, 60000)

    return () => window.clearInterval(interval)
  }, [today?.checkIn, today?.checkOut])

  const workHours = useMemo(
    () => (today ? calculateWorkHours(today) : '--'),
    [today],
  )

  const handleCheckIn = () => {
    if (!userId) {
      return
    }

    try {
      checkIn(userId)
      loadAttendance()

      toast.success('You are checked in.')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to check in.',
      )
    }
  }

  const handleCheckOut = () => {
    if (!userId) {
      return
    }

    try {
      checkOut(userId)
      loadAttendance()

      toast.success('You are checked out.')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to check out.',
      )
    }
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-sm font-semibold text-(--brand)">
          Employee attendance
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Attendance
        </h1>

        <p className="mt-2 text-sm text-(--muted)">
          Track your working hours and attendance history.
        </p>
      </div>

      {/* Today's attendance */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={18}
                  className="text-(--brand)"
                />

                <p className="text-sm font-semibold">
                  Today's attendance
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-semibold">
                {today?.status === 'present'
                  ? 'Present'
                  : 'Not checked in'}
              </h2>

              <p className="mt-1 text-sm text-(--muted)">
                {new Date().toLocaleDateString([], {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {today?.status === 'present' && (
              <div className="flex items-center gap-2 rounded-full bg-[#e4f1e8] px-3 py-1.5 text-xs font-semibold text-(--brand-dark)">
                <CheckCircle2 size={14} />
                Present
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-(--line) p-5">
              <div className="flex items-center gap-2 text-(--muted)">
                <LogIn size={16} />

                <p className="text-xs font-medium">
                  Check in
                </p>
              </div>

              <p className="mt-3 text-2xl font-semibold">
                {formatTime(today?.checkIn ?? null)}
              </p>
            </div>

            <div className="rounded-xl border border-(--line) p-5">
              <div className="flex items-center gap-2 text-(--muted)">
                <LogOut size={16} />

                <p className="text-xs font-medium">
                  Check out
                </p>
              </div>

              <p className="mt-3 text-2xl font-semibold">
                {formatTime(today?.checkOut ?? null)}
              </p>
            </div>

            <div className="rounded-xl border border-(--line) p-5">
              <div className="flex items-center gap-2 text-(--muted)">
                <Clock3 size={16} />

                <p className="text-xs font-medium">
                  Work hours
                </p>
              </div>

              <p className="mt-3 text-2xl font-semibold">
                {workHours}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={Boolean(today)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-(--brand) px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogIn size={17} />
              Check in
            </button>

            <button
              type="button"
              onClick={handleCheckOut}
              disabled={!today || Boolean(today.checkOut)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-(--line) bg-white px-5 py-3 text-sm font-semibold transition hover:bg-(--canvas) disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogOut size={17} />
              Check out
            </button>
          </div>
        </Card>

        {/* Current status */}
        <Card>
          <p className="text-sm font-semibold">
            Current status
          </p>

          <div className="mt-6 rounded-2xl bg-(--canvas) p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e4f1e8] text-(--brand-dark)">
              <Clock3 size={24} />
            </div>

            <p className="mt-4 text-lg font-semibold">
              {today?.checkIn && !today.checkOut
                ? 'Working'
                : today?.checkOut
                  ? 'Day completed'
                  : 'Not started'}
            </p>

            <p className="mt-2 text-sm text-(--muted)">
              {today?.checkIn && !today.checkOut
                ? 'Your workday is currently active.'
                : today?.checkOut
                  ? 'You have completed your workday.'
                  : 'Check in when you start working.'}
            </p>
          </div>
        </Card>
      </div>

      {/* Attendance history */}
      <Card>
        <div>
          <h2 className="text-lg font-semibold">
            Attendance history
          </h2>

          <p className="mt-1 text-sm text-(--muted)">
            Your recent attendance records.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-(--line) p-8 text-center">
            <CalendarDays
              size={24}
              className="mx-auto text-(--muted)"
            />

            <p className="mt-3 text-sm font-semibold">
              No attendance records yet
            </p>

            <p className="mt-1 text-sm text-(--muted)">
              Your attendance history will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-(--line) text-xs text-(--muted)">
                  <th className="px-4 py-3 font-medium">
                    Date
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Check in
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Check out
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Work hours
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-(--line) last:border-0"
                  >
                    <td className="px-4 py-4 text-sm font-semibold">
                      {formatDate(record.date)}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {formatTime(record.checkIn)}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {formatTime(record.checkOut)}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {calculateWorkHours(record)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#e4f1e8] px-3 py-1 text-xs font-semibold capitalize text-(--brand-dark)">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}