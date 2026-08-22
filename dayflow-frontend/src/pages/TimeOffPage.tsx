import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { FormEvent } from 'react'

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
} from 'lucide-react'

import { toast } from 'sonner'

import { useAuth } from '../auth/AuthContext'
import { Card } from '../components/ui/Card'

import {
  createTimeOffRequest,
  getTimeOffRequests,
} from '../services/timeoff.service'

import type {
  TimeOffRequest,
  TimeOffType,
} from '../services/timeoff.service'

function formatDate(value: string) {
  if (!value) {
    return '--'
  }

  return new Date(
    `${value}T00:00:00`,
  ).toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function calculateDays(
  startDate: string,
  endDate: string,
) {
  if (!startDate || !endDate) {
    return 0
  }

  const start = new Date(
    `${startDate}T00:00:00`,
  )

  const end = new Date(
    `${endDate}T00:00:00`,
  )

  const difference =
    end.getTime() - start.getTime()

  return (
    Math.floor(
      difference / (1000 * 60 * 60 * 24),
    ) + 1
  )
}

function getTypeLabel(type: TimeOffType) {
  switch (type) {
    case 'paid':
      return 'Paid leave'

    case 'sick':
      return 'Sick leave'

    case 'unpaid':
      return 'Unpaid leave'

    default:
      return type
  }
}

export function TimeOffPage() {
  const { user } = useAuth()

  const userId = user?.id ?? ''

  const [requests, setRequests] =
    useState<TimeOffRequest[]>([])

  const [showForm, setShowForm] =
    useState(false)

  const [type, setType] =
    useState<TimeOffType>('paid')

  const [startDate, setStartDate] =
    useState('')

  const [endDate, setEndDate] =
    useState('')

  const [reason, setReason] =
    useState('')

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const loadRequests = () => {
    if (!userId) {
      return
    }

    setRequests(
      getTimeOffRequests(userId),
    )
  }

  useEffect(() => {
    loadRequests()
  }, [userId])

  const requestedDays = useMemo(
    () =>
      calculateDays(
        startDate,
        endDate,
      ),
    [startDate, endDate],
  )

  const pendingRequests = requests.filter(
    (request) =>
      request.status === 'pending',
  ).length

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!userId) {
      toast.error(
        'You are not logged in.',
      )
      return
    }

    if (!startDate || !endDate) {
      toast.error(
        'Please select a start and end date.',
      )
      return
    }

    if (endDate < startDate) {
      toast.error(
        'End date cannot be before start date.',
      )
      return
    }

    if (!reason.trim()) {
      toast.error(
        'Please provide a reason.',
      )
      return
    }

    try {
      setIsSubmitting(true)

      createTimeOffRequest(userId, {
        type,
        startDate,
        endDate,
        reason: reason.trim(),
      })

      toast.success(
        'Time-off request submitted.',
      )

      setStartDate('')
      setEndDate('')
      setReason('')
      setType('paid')
      setShowForm(false)

      loadRequests()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to submit the request.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-(--brand)">
            Employee benefits
          </p>

          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Time off
          </h1>

          <p className="mt-2 text-sm text-(--muted)">
            Request time away and track your leave
            requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(
              (current) => !current,
            )
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-(--brand) px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={17} />

          {showForm
            ? 'Close request'
            : 'Request time off'}
        </button>
      </div>

      {/* Leave balance */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-sm text-(--muted)">
                Paid leave
              </p>

              <p className="mt-1 text-2xl font-semibold">
                12 days
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
              <Clock3 size={20} />
            </div>

            <div>
              <p className="text-sm text-(--muted)">
                Sick leave
              </p>

              <p className="mt-1 text-2xl font-semibold">
                8 days
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
              <FileText size={20} />
            </div>

            <div>
              <p className="text-sm text-(--muted)">
                Pending requests
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {pendingRequests}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Request form */}
      {showForm && (
        <Card>
          <div>
            <h2 className="text-lg font-semibold">
              Request time off
            </h2>

            <p className="mt-1 text-sm text-(--muted)">
              Submit a new leave request for approval.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-3">
              {/* Leave type */}
              <div>
                <label
                  htmlFor="time-off-type"
                  className="text-sm font-semibold"
                >
                  Leave type
                </label>

                <select
                  id="time-off-type"
                  value={type}
                  onChange={(event) =>
                    setType(
                      event.target
                        .value as TimeOffType,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-(--line) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--brand)"
                >
                  <option value="paid">
                    Paid leave
                  </option>

                  <option value="sick">
                    Sick leave
                  </option>

                  <option value="unpaid">
                    Unpaid leave
                  </option>
                </select>
              </div>

              {/* Start date */}
              <div>
                <label
                  htmlFor="start-date"
                  className="text-sm font-semibold"
                >
                  Start date
                </label>

                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-(--line) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--brand)"
                />
              </div>

              {/* End date */}
              <div>
                <label
                  htmlFor="end-date"
                  className="text-sm font-semibold"
                >
                  End date
                </label>

                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={
                    startDate || undefined
                  }
                  onChange={(event) =>
                    setEndDate(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-(--line) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--brand)"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="reason"
                className="text-sm font-semibold"
              >
                Reason
              </label>

              <textarea
                id="reason"
                value={reason}
                onChange={(event) =>
                  setReason(
                    event.target.value,
                  )
                }
                rows={4}
                placeholder="Tell us briefly why you need time off..."
                className="mt-2 w-full resize-none rounded-xl border border-(--line) bg-white px-4 py-3 text-sm outline-none transition focus:border-(--brand)"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col justify-between gap-4 rounded-xl bg-(--canvas) p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold">
                  Requested duration
                </p>

                <p className="mt-1 text-sm text-(--muted)">
                  {requestedDays > 0
                    ? `${requestedDays} ${
                        requestedDays === 1
                          ? 'day'
                          : 'days'
                      }`
                    : 'Select your dates'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-(--brand) px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Submitting...'
                  : 'Submit request'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Request history */}
      <Card>
        <div>
          <h2 className="text-lg font-semibold">
            My requests
          </h2>

          <p className="mt-1 text-sm text-(--muted)">
            Track the status of your time-off requests.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-(--line) p-8 text-center">
            <CalendarDays
              size={24}
              className="mx-auto text-(--muted)"
            />

            <p className="mt-3 text-sm font-semibold">
              No requests yet
            </p>

            <p className="mt-1 text-sm text-(--muted)">
              Your time-off requests will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {requests.map((request) => {
              const days = calculateDays(
                request.startDate,
                request.endDate,
              )

              return (
                <div
                  key={request.id}
                  className="rounded-xl border border-(--line) p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {getTypeLabel(
                            request.type,
                          )}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            request.status ===
                            'approved'
                              ? 'bg-[#e4f1e8] text-(--brand-dark)'
                              : request.status ===
                                  'rejected'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-(--muted)">
                        {formatDate(
                          request.startDate,
                        )}{' '}
                        →{' '}
                        {formatDate(
                          request.endDate,
                        )}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold">
                        {days}{' '}
                        {days === 1
                          ? 'day'
                          : 'days'}
                      </p>

                      <p className="mt-1 text-xs text-(--muted)">
                        Requested{' '}
                        {formatDate(
                          request.createdAt.split(
                            'T',
                          )[0],
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-(--canvas) p-3">
                    <p className="text-xs font-medium text-(--muted)">
                      Reason
                    </p>

                    <p className="mt-1 text-sm">
                      {request.reason}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Approval note */}
      <div className="flex items-start gap-3 rounded-xl border border-(--line) bg-white p-4">
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0 text-(--brand)"
        />

        <p className="text-sm text-(--muted)">
          New requests are submitted as{' '}
          <span className="font-semibold">
            pending
          </span>
          . The approval workflow will be connected
          to the employee management backend later.
        </p>
      </div>
    </div>
  )
}