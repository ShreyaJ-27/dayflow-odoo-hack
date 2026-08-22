import { useEffect, useState } from 'react'
import './App.css'
import { AttendancePage as ExtractedAttendancePage } from './pages/AttendancePage'
import { EmployeeModal as ExtractedEmployeeModal, PeoplePage as ExtractedPeoplePage } from './pages/PeoplePage'
import { LeavePage as ExtractedLeavePage } from './pages/LeavePage'
import { PayrollPage } from './pages/PayrollPage'
import { ReportsPage } from './pages/ReportsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { AuthGate } from './components/AuthGate'
import { loadStoredValue, saveStoredValue } from './utils/storage'

const navigation = [
  { id: 'overview', label: 'Overview', mark: 'OV' },
  { id: 'people', label: 'People', mark: 'PE' },
  { id: 'attendance', label: 'Attendance', mark: 'AT' },
  { id: 'leave', label: 'Leave', mark: 'LV' },
  { id: 'payroll', label: 'Payroll', mark: 'PR' },
  { id: 'reports', label: 'Reports', mark: 'RP' },
  { id: 'notifications', label: 'Notifications', mark: 'NT' },
]

const metrics = [
  { label: 'Active employees', value: '248', change: '+12 this month', tone: 'blue' },
  { label: 'Present today', value: '219', change: '88.3% of workforce', tone: 'mint' },
  { label: 'Pending requests', value: '17', change: 'Needs review', tone: 'amber' },
]

const initialEmployees = [
  { id: 1, name: 'Maya Nichols', initials: 'MN', role: 'Product Designer', department: 'Design', email: 'maya.nichols@acme.co', phone: '+1 415 555 0148', joined: 'Mar 12, 2023', status: 'Active', tone: 'coral' },
  { id: 2, name: 'Rohan Kapoor', initials: 'RK', role: 'Engineering Lead', department: 'Engineering', email: 'rohan.kapoor@acme.co', phone: '+1 415 555 0182', joined: 'Aug 08, 2022', status: 'Active', tone: 'blue' },
  { id: 3, name: 'Leah Sullivan', initials: 'LS', role: 'People Partner', department: 'People', email: 'leah.sullivan@acme.co', phone: '+1 415 555 0126', joined: 'Jan 19, 2024', status: 'Active', tone: 'mint' },
  { id: 4, name: 'Arjun Mehta', initials: 'AM', role: 'Frontend Engineer', department: 'Engineering', email: 'arjun.mehta@acme.co', phone: '+1 415 555 0167', joined: 'Jun 03, 2024', status: 'Active', tone: 'amber' },
  { id: 5, name: 'Sofia Chen', initials: 'SC', role: 'Finance Manager', department: 'Finance', email: 'sofia.chen@acme.co', phone: '+1 415 555 0195', joined: 'Nov 27, 2021', status: 'Active', tone: 'violet' },
  { id: 6, name: 'Ethan Brooks', initials: 'EB', role: 'Account Executive', department: 'Sales', email: 'ethan.brooks@acme.co', phone: '+1 415 555 0109', joined: 'Feb 14, 2023', status: 'On leave', tone: 'coral' },
  { id: 7, name: 'Nina Patel', initials: 'NP', role: 'QA Engineer', department: 'Engineering', email: 'nina.patel@acme.co', phone: '+1 415 555 0133', joined: 'Sep 05, 2022', status: 'Active', tone: 'blue' },
  { id: 8, name: 'Oliver Grant', initials: 'OG', role: 'Content Strategist', department: 'Marketing', email: 'oliver.grant@acme.co', phone: '+1 415 555 0174', joined: 'Apr 22, 2024', status: 'Active', tone: 'mint' },
]

const initialLeaves = [
  { id: 1, employee: 'Maya Nichols', initials: 'MN', type: 'Annual leave', dates: 'Aug 26 - Aug 27', days: '2 days', submitted: 'Today, 09:14', status: 'Pending', tone: 'coral', comment: '' },
  { id: 2, employee: 'Ethan Brooks', initials: 'EB', type: 'Sick leave', dates: 'Aug 22', days: '1 day', submitted: 'Today, 08:41', status: 'Pending', tone: 'blue', comment: '' },
  { id: 3, employee: 'Sofia Chen', initials: 'SC', type: 'Annual leave', dates: 'Sep 02 - Sep 05', days: '4 days', submitted: 'Yesterday', status: 'Approved', tone: 'mint', comment: 'Enjoy the break!' },
  { id: 4, employee: 'Oliver Grant', initials: 'OG', type: 'Personal day', dates: 'Aug 29', days: '1 day', submitted: 'Aug 18', status: 'Rejected', tone: 'amber', comment: 'Please choose a core coverage day.' },
  { id: 5, employee: 'Nina Patel', initials: 'NP', type: 'Annual leave', dates: 'Sep 12 - Sep 13', days: '2 days', submitted: 'Aug 16', status: 'Approved', tone: 'blue', comment: '' },
]

/* Page implementations live in src/pages. */
/*
function PageHeader({ eyebrow, title, copy, action }) {
  return <div className="content-heading page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="heading-copy">{copy}</p></div>{action}</div>
}

function SearchInput({ value, onChange, placeholder }) {
  return <label className="table-search"><span className="search-mark">?</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>
}

function PeoplePage({ employees, onAdd, onEdit, onView }) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [page, setPage] = useState(1)
  const pageSize = 5
  const filtered = employees.filter((employee) => {
    const matchesQuery = `${employee.name} ${employee.role} ${employee.email}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (department === 'All departments' || employee.department === department)
  })
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  const updateQuery = (value) => { setQuery(value); setPage(1) }

  return <>
    <PageHeader eyebrow="People directory" title="Employees" copy="Manage your people, roles, and team details." action={<button type="button" className="primary-button" onClick={onAdd}><span>+</span> Add employee</button>} />
    <section className="panel table-panel">
      <div className="table-toolbar"><SearchInput value={query} onChange={updateQuery} placeholder="Search employees" /><select value={department} onChange={(event) => { setDepartment(event.target.value); setPage(1) }} aria-label="Filter by department"><option>All departments</option><option>Design</option><option>Engineering</option><option>Finance</option><option>Marketing</option><option>People</option><option>Sales</option></select><span className="result-count">{filtered.length} employees</span></div>
      <div className="table-scroll"><table><thead><tr><th>Employee</th><th>Role</th><th>Department</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{visible.map((employee) => <tr key={employee.id}><td><button type="button" className="person-cell" onClick={() => onView(employee)}><span className={`table-avatar ${employee.tone}`}>{employee.initials}</span><span><strong>{employee.name}</strong><small>{employee.email}</small></span></button></td><td>{employee.role}</td><td>{employee.department}</td><td><span className={`status-pill ${statusClass(employee.status)}`}>{employee.status}</span></td><td><button type="button" className="row-action" onClick={() => onEdit(employee)}>Edit</button></td></tr>)}</tbody></table></div>
      {!visible.length && <div className="empty-state"><strong>No employees found</strong><span>Try a different name or department.</span></div>}
      <div className="pagination"><span>Showing {visible.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span><div><button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><b>{page} / {pageCount}</b><button type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</button></div></div>
    </section>
  </>
}

function AttendancePage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [view, setView] = useState('Daily')
  const filtered = attendanceSeed.filter(([name, , department, currentStatus]) => `${name} ${department}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || currentStatus === status))
  return <>
    <PageHeader eyebrow="Time records" title="Attendance" copy="See who is in, away, or needs a follow-up." />
    <section className="panel table-panel">
      <div className="attendance-toolbar"><div className="segmented-control"><button type="button" className={view === 'Daily' ? 'is-selected' : ''} onClick={() => setView('Daily')}>Daily</button><button type="button" className={view === 'Weekly' ? 'is-selected' : ''} onClick={() => setView('Weekly')}>Weekly</button></div><div className="date-control"><button type="button">&lt;</button><strong>{view === 'Daily' ? 'Aug 22, 2026' : 'Aug 17 - Aug 23, 2026'}</strong><button type="button">&gt;</button></div></div>
      <div className="table-toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Search employee or team" /><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter attendance status"><option>All statuses</option><option>Present</option><option>Absent</option><option>Half-day</option><option>Leave</option></select><span className="result-count">{filtered.length} records</span></div>
      <div className="table-scroll"><table><thead><tr><th>Employee</th><th>Department</th><th>Status</th><th>Clock in</th><th>Clock out</th></tr></thead><tbody>{filtered.map(([name, initials, department, currentStatus, clockIn, clockOut]) => <tr key={name}><td><span className="person-cell"><span className="table-avatar blue">{initials}</span><strong>{name}</strong></span></td><td>{department}</td><td><span className={`status-pill ${statusClass(currentStatus)}`}>{currentStatus}</span></td><td>{clockIn}</td><td>{clockOut}</td></tr>)}</tbody></table></div>
      {!filtered.length && <div className="empty-state"><strong>No attendance records found</strong><span>Try a different search or status.</span></div>}
    </section>
  </>
}

function LeavePage({ leaves, onDecision }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All requests')
  const [commentId, setCommentId] = useState(null)
  const [comment, setComment] = useState('')
  const filtered = leaves.filter((leave) => `${leave.employee} ${leave.type}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All requests' || leave.status === filter))
  const decide = (leave, nextStatus) => { onDecision(leave.id, nextStatus, comment); setCommentId(null); setComment('') }
  return <>
    <PageHeader eyebrow="Time away" title="Leave requests" copy="Review time-off requests and keep everyone moving." />
    <section className="panel table-panel">
      <div className="table-toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Search requests" /><div className="filter-tabs">{['All requests', 'Pending', 'Approved', 'Rejected'].map((item) => <button type="button" className={filter === item ? 'is-selected' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
      <div className="leave-list">{filtered.map((leave) => <div className="leave-row" key={leave.id}><span className={`table-avatar ${leave.tone}`}>{leave.initials}</span><div className="leave-main"><div className="leave-title"><strong>{leave.employee}</strong><span className={`status-pill ${statusClass(leave.status)}`}>{leave.status}</span></div><span>{leave.type} · {leave.dates} · {leave.days}</span><small>Submitted {leave.submitted}{leave.comment && ` · ${leave.comment}`}</small></div><div className="leave-actions">{leave.status === 'Pending' && <><button type="button" className="approve-button" onClick={() => decide(leave, 'Approved')}>Approve</button><button type="button" className="reject-button" onClick={() => decide(leave, 'Rejected')}>Reject</button><button type="button" className="comment-button" onClick={() => setCommentId(commentId === leave.id ? null : leave.id)}>Comment</button></>}</div>{commentId === leave.id && <div className="comment-editor"><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a note" aria-label={`Comment for ${leave.employee}`} /><button type="button" onClick={() => onDecision(leave.id, leave.status, comment)}>Save note</button></div>}</div>)}</div>
      {!filtered.length && <div className="empty-state"><strong>No leave requests found</strong><span>Try another status or search term.</span></div>}
    </section>
  </>
}

function EmployeeModal({ employee, onClose, onSave, detailOnly = false }) {
  const [draft, setDraft] = useState(employee || { name: '', role: '', department: 'Engineering', email: '', phone: '', joined: 'Aug 22, 2026', status: 'Active', initials: 'NE', tone: 'blue' })
  const update = (field, value) => setDraft({ ...draft, [field]: value })
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="employee-modal-title"><div className="modal-heading"><div><p className="eyebrow">{detailOnly ? 'Employee profile' : employee ? 'Edit employee' : 'New employee'}</p><h2 id="employee-modal-title">{detailOnly ? draft.name : employee ? 'Update details' : 'Add employee'}</h2></div><button type="button" className="close-button" onClick={onClose} aria-label="Close">x</button></div>{detailOnly ? <div className="detail-content"><span className={`detail-avatar ${draft.tone}`}>{draft.initials}</span><div className="detail-grid"><span>Role<strong>{draft.role}</strong></span><span>Department<strong>{draft.department}</strong></span><span>Email<strong>{draft.email}</strong></span><span>Phone<strong>{draft.phone}</strong></span><span>Joined<strong>{draft.joined}</strong></span><span>Status<strong><span className={`status-pill ${statusClass(draft.status)}`}>{draft.status}</span></strong></span></div><button type="button" className="primary-button" onClick={() => { onClose(); onSave(draft) }}>Edit profile</button></div> : <form className="employee-form" onSubmit={(event) => { event.preventDefault(); onSave({ ...draft, name: draft.name || 'New employee', initials: draft.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'NE' }) }}><label>Full name<input required value={draft.name} onChange={(event) => update('name', event.target.value)} /></label><label>Role<input required value={draft.role} onChange={(event) => update('role', event.target.value)} /></label><label>Department<select value={draft.department} onChange={(event) => update('department', event.target.value)}><option>Engineering</option><option>Design</option><option>Finance</option><option>Marketing</option><option>People</option><option>Sales</option></select></label><label>Email<input type="email" required value={draft.email} onChange={(event) => update('email', event.target.value)} /></label><label>Phone<input value={draft.phone} onChange={(event) => update('phone', event.target.value)} /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Save employee</button></div></form>}</section></div>
}

*/

function AdminApp({ onSignOut }) {
  const [activeSection, setActiveSection] = useState(
    window.location.hash.replace('#', '') || 'overview',
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => loadStoredValue('dayflow-sidebar-collapsed', false))
  const [workspaceSearch, setWorkspaceSearch] = useState(() => loadStoredValue('dayflow-workspace-search', ''))
  const [employees, setEmployees] = useState(() => loadStoredValue('dayflow-employees', initialEmployees))
  const [leaves, setLeaves] = useState(() => loadStoredValue('dayflow-leaves', initialLeaves))
  const [employeeModal, setEmployeeModal] = useState(null)

  useEffect(() => {
    const handleHashChange = () => {
      const nextSection = window.location.hash.replace('#', '') || 'overview'
      if (navigation.some((item) => item.id === nextSection)) {
        setActiveSection(nextSection)
      }
    }

    window.addEventListener('popstate', handleHashChange)
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('popstate', handleHashChange)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const selectSection = (sectionId) => {
    window.history.pushState(null, '', `#${sectionId}`)
    setActiveSection(sectionId)
    setIsSidebarOpen(false)
  }

  const currentLabel = navigation.find((item) => item.id === activeSection)?.label || 'Overview'
  const saveEmployee = (employee) => {
    const savedEmployee = employee.id ? employee : { ...employee, id: Date.now() }
    setEmployees((current) => employee.id ? current.map((item) => item.id === employee.id ? savedEmployee : item) : [...current, savedEmployee])
    const storedPayroll = loadStoredValue('dayflow-payroll', [])
    saveStoredValue('dayflow-payroll', storedPayroll.map((record) => record.id === savedEmployee.id ? { ...record, name: savedEmployee.name, initials: savedEmployee.initials, role: savedEmployee.role, department: savedEmployee.department, tone: savedEmployee.tone } : record))
    setEmployeeModal(null)
  }
  const updateLeave = (leaveId, status, comment) => setLeaves((current) => current.map((leave) => leave.id === leaveId ? { ...leave, status, comment: comment || leave.comment } : leave))

  useEffect(() => saveStoredValue('dayflow-employees', employees), [employees])
  useEffect(() => saveStoredValue('dayflow-leaves', leaves), [leaves])
  useEffect(() => saveStoredValue('dayflow-sidebar-collapsed', isCollapsed), [isCollapsed])
  useEffect(() => saveStoredValue('dayflow-workspace-search', workspaceSearch), [workspaceSearch])

  return (
    <div className="app-shell">
      <button
        type="button"
        className={`sidebar-backdrop ${isSidebarOpen ? 'is-visible' : ''}`}
        aria-label="Close navigation"
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`sidebar ${isSidebarOpen ? 'is-open' : ''} ${isCollapsed ? 'is-collapsed' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark">D</div>
          <div className="brand-copy"><strong>dayflow</strong><span>Operations console</span></div>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">AC</span><span className="workspace-name">Acme Corporation</span><span className="chevron">v</span>
        </div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <span className="nav-label">Workspace</span>
          {navigation.map((item) => (
            <button type="button" className={`nav-item ${activeSection === item.id ? 'is-active' : ''}`} key={item.id} onClick={() => selectSection(item.id)}>
              <span className="nav-mark">{item.mark}</span><span className="nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="nav-item"><span className="nav-mark">ST</span><span className="nav-text">Settings</span></button>
          <button type="button" className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
            <span className="nav-mark">{isCollapsed ? '>>' : '<<'}</span><span className="nav-text">Collapse menu</span>
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button type="button" className="icon-button menu-button" aria-label="Open navigation" onClick={() => setIsSidebarOpen(true)}><span>==</span></button>
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{currentLabel}</strong></div>
          <div className="topbar-actions">
            <label className="search-field"><span className="search-mark">?</span><input type="search" value={workspaceSearch} onChange={(event) => setWorkspaceSearch(event.target.value)} placeholder="Search workspace" aria-label="Search workspace" /><kbd>/</kbd></label>
            <button type="button" className="icon-button" aria-label="Notifications" onClick={() => selectSection('notifications')}><span className="notification-mark">!</span><i /></button>
            <button type="button" className="profile-button" aria-label="Sign out" onClick={onSignOut}><span className="profile-avatar">JD</span><span className="profile-name">Jordan Davis</span><span className="chevron">v</span></button>
          </div>
        </header>

        <main className="content-area">
          <div className={activeSection === 'overview' ? '' : 'dashboard-home-hidden'}>
          <div className="content-heading">
            <div><p className="eyebrow">Saturday, August 22, 2026</p><h1>{currentLabel}</h1><p className="heading-copy">A clear view of your team's day, from one calm workspace.</p></div>
            <button type="button" className="primary-button" onClick={() => setEmployeeModal({ type: 'form' })}><span>+</span> Add employee</button>
          </div>
          <section className="metrics-grid" aria-label="Workspace summary">
            {metrics.map((metric) => (
              <article className="metric-card" key={metric.label}><div className={`metric-icon ${metric.tone}`}>{metric.label.slice(0, 2).toUpperCase()}</div><p>{metric.label}</p><strong>{metric.value}</strong><span>{metric.change}</span></article>
            ))}
          </section>
          <section className="dashboard-grid">
            <article className="panel activity-panel">
              <div className="panel-heading"><div><p className="eyebrow">Live pulse</p><h2>Today's activity</h2></div><button type="button" className="text-button">View report <span>-&gt;</span></button></div>
              <div className="activity-chart" aria-label="Illustrative activity chart"><div className="chart-scale"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="chart-bars">{[72, 48, 84, 62, 91, 68, 78, 55, 87, 66, 74, 44].map((height, index) => <div className="bar-wrap" key={index}><div className="bar" style={{ height: `${height}%` }} /></div>)}</div><div className="chart-days"><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span></div></div>
            </article>
            <article className="panel requests-panel">
              <div className="panel-heading"><div><p className="eyebrow">Action queue</p><h2>Needs your attention</h2></div><span className="count-badge">3</span></div>
              <div className="request-list">
                <div className="request-row"><span className="request-avatar coral">MN</span><div><strong>Leave request</strong><span>Maya N. - 2 days</span></div><button type="button">Review</button></div>
                <div className="request-row"><span className="request-avatar blue">RK</span><div><strong>Profile update</strong><span>Rohan K. - New details</span></div><button type="button">Review</button></div>
                <div className="request-row"><span className="request-avatar mint">LS</span><div><strong>Late arrival</strong><span>Leah S. - Today, 09:42</span></div><button type="button">Review</button></div>
              </div>
            </article>
          </section>
          </div>
          {activeSection === 'people' && <ExtractedPeoplePage employees={employees} onAdd={() => setEmployeeModal({ type: 'form' })} onEdit={(employee) => setEmployeeModal({ type: 'form', employee })} onView={(employee) => setEmployeeModal({ type: 'detail', employee })} />}
          {activeSection === 'attendance' && <ExtractedAttendancePage />}
          {activeSection === 'leave' && <ExtractedLeavePage leaves={leaves} onDecision={updateLeave} />}
          {activeSection === 'payroll' && <PayrollPage />}
          {activeSection === 'reports' && <ReportsPage />}
          {activeSection === 'notifications' && <NotificationsPage />}
        </main>
      </div>
      {employeeModal && <ExtractedEmployeeModal employee={employeeModal.employee} detailOnly={employeeModal.type === 'detail'} onClose={() => setEmployeeModal(null)} onEdit={(employee) => setEmployeeModal({ type: 'form', employee })} onSave={saveEmployee} />}
    </div>
  )
}

export default function App() {
  return <AuthGate>{({ onSignOut }) => <AdminApp onSignOut={onSignOut} />}</AuthGate>
}
