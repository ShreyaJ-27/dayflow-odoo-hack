
export interface AttendanceRecord {
  id: string
  userId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: 'present' | 'absent' | 'leave'
}

const ATTENDANCE_KEY = 'dayflow_attendance'

function getRecords(): AttendanceRecord[] {
  const records = localStorage.getItem(ATTENDANCE_KEY)

  if (!records) {
    return []
  }

  return JSON.parse(records) as AttendanceRecord[]
}

function saveRecords(records: AttendanceRecord[]) {
  localStorage.setItem(
    ATTENDANCE_KEY,
    JSON.stringify(records),
  )
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function getTodayAttendance(
  userId: string,
): AttendanceRecord | null {
  const records = getRecords()
  const today = getToday()

  return (
    records.find(
      (record) =>
        record.userId === userId &&
        record.date === today,
    ) ?? null
  )
}

export function checkIn(
  userId: string,
): AttendanceRecord {
  const records = getRecords()
  const today = getToday()

  const existingRecord = records.find(
    (record) =>
      record.userId === userId &&
      record.date === today,
  )

  if (existingRecord) {
    throw new Error(
      'You have already checked in today.',
    )
  }

  const record: AttendanceRecord = {
    id: crypto.randomUUID(),
    userId,
    date: today,
    checkIn: new Date().toISOString(),
    checkOut: null,
    status: 'present',
  }

  records.push(record)
  saveRecords(records)

  return record
}

export function checkOut(
  userId: string,
): AttendanceRecord {
  const records = getRecords()
  const today = getToday()

  const record = records.find(
    (item) =>
      item.userId === userId &&
      item.date === today,
  )

  if (!record) {
    throw new Error(
      'You need to check in before checking out.',
    )
  }

  if (record.checkOut) {
    throw new Error(
      'You have already checked out today.',
    )
  }

  record.checkOut = new Date().toISOString()

  saveRecords(records)

  return record
}

export function getAttendanceHistory(
  userId: string,
): AttendanceRecord[] {
  return getRecords()
    .filter((record) => record.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date))
}
