import { useState } from 'react'
import { PageHeader, SearchInput } from '../components/AdminPageParts'
import { statusClass } from '../utils/status'

const attendanceSeed = [
  ['Maya Nichols', 'MN', 'Design', 'Present', '09:02', '17:34'], ['Rohan Kapoor', 'RK', 'Engineering', 'Present', '08:47', '18:05'], ['Leah Sullivan', 'LS', 'People', 'Half-day', '09:11', '13:02'], ['Arjun Mehta', 'AM', 'Engineering', 'Absent', '-', '-'], ['Sofia Chen', 'SC', 'Finance', 'Present', '08:56', '17:19'], ['Ethan Brooks', 'EB', 'Sales', 'Leave', '-', '-'], ['Nina Patel', 'NP', 'Engineering', 'Present', '09:25', '17:42'], ['Oliver Grant', 'OG', 'Marketing', 'Present', '08:39', '16:58'],
]

export function AttendancePage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [view, setView] = useState('Daily')
  const [dateOffset, setDateOffset] = useState(0)
  const date = new Date(2026, 7, 22 + dateOffset)
  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const filtered = attendanceSeed.filter(([name, , department, currentStatus]) => `${name} ${department}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || currentStatus === status))
  return <><PageHeader eyebrow="Time records" title="Attendance" copy="See who is in, away, or needs a follow-up." /><section className="panel table-panel"><div className="attendance-toolbar"><div className="segmented-control"><button type="button" className={view === 'Daily' ? 'is-selected' : ''} onClick={() => setView('Daily')}>Daily</button><button type="button" className={view === 'Weekly' ? 'is-selected' : ''} onClick={() => setView('Weekly')}>Weekly</button></div><div className="date-control"><button type="button" aria-label="Previous date" onClick={() => setDateOffset(dateOffset - (view === 'Weekly' ? 7 : 1))}>&lt;</button><strong>{view === 'Daily' ? dateLabel : `Week of ${dateLabel}`}</strong><button type="button" aria-label="Next date" onClick={() => setDateOffset(dateOffset + (view === 'Weekly' ? 7 : 1))}>&gt;</button></div></div><div className="table-toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Search employee or team" /><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter attendance status"><option>All statuses</option><option>Present</option><option>Absent</option><option>Half-day</option><option>Leave</option></select><span className="result-count">{filtered.length} records</span></div><div className="table-scroll"><table><thead><tr><th>Employee</th><th>Department</th><th>Status</th><th>Clock in</th><th>Clock out</th></tr></thead><tbody>{filtered.map(([name, initials, department, currentStatus, clockIn, clockOut]) => <tr key={name}><td><span className="person-cell"><span className="table-avatar blue">{initials}</span><strong>{name}</strong></span></td><td>{department}</td><td><span className={`status-pill ${statusClass(currentStatus)}`}>{currentStatus}</span></td><td>{clockIn}</td><td>{clockOut}</td></tr>)}</tbody></table></div>{!filtered.length && <div className="empty-state"><strong>No attendance records found</strong><span>Try a different search or status.</span></div>}</section></>
}