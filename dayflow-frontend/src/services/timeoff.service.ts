export type TimeOffType =
  | 'paid'
  | 'sick'
  | 'unpaid'

export type TimeOffStatus =
  | 'pending'
  | 'approved'
  | 'rejected'

export interface TimeOffRequest {
  id: string
  userId: string
  type: TimeOffType
  startDate: string
  endDate: string
  reason: string
  status: TimeOffStatus
  createdAt: string
}

const TIME_OFF_KEY = 'dayflow_time_off'

function getRequests(): TimeOffRequest[] {
  const stored = localStorage.getItem(TIME_OFF_KEY)

  if (!stored) {
    return []
  }

  return JSON.parse(stored) as TimeOffRequest[]
}

function saveRequests(requests: TimeOffRequest[]) {
  localStorage.setItem(
    TIME_OFF_KEY,
    JSON.stringify(requests),
  )
}

export function getTimeOffRequests(
  userId: string,
): TimeOffRequest[] {
  return getRequests()
    .filter((request) => request.userId === userId)
    .sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
}

export function createTimeOffRequest(
  userId: string,
  data: {
    type: TimeOffType
    startDate: string
    endDate: string
    reason: string
  },
): TimeOffRequest {
  const requests = getRequests()

  const request: TimeOffRequest = {
    id: crypto.randomUUID(),
    userId,
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    reason: data.reason,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  requests.push(request)

  saveRequests(requests)

  return request
}