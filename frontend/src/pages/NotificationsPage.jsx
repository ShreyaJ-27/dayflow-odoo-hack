import { useState } from 'react'
import { PageHeader, SearchInput } from '../components/AdminPageParts'

const initialNotifications = [
  { id: 1, type: 'Leave', title: 'Maya Nichols submitted a leave request', detail: 'Annual leave · Aug 26 - Aug 27', time: '12 minutes ago', initials: 'MN', tone: 'coral', unread: true },
  { id: 2, type: 'Payroll', title: 'Payroll review is ready for August', detail: '2 employee records need your attention', time: '1 hour ago', initials: 'PR', tone: 'amber', unread: true },
  { id: 3, type: 'Attendance', title: 'Arjun Mehta was marked absent', detail: 'Saturday, August 22 · Engineering', time: '2 hours ago', initials: 'AT', tone: 'blue', unread: true },
  { id: 4, type: 'People', title: 'Rohan Kapoor updated their profile', detail: 'New emergency contact details added', time: 'Yesterday', initials: 'RK', tone: 'mint', unread: false },
  { id: 5, type: 'Leave', title: 'Sofia Chen leave request was approved', detail: 'Annual leave · Sep 02 - Sep 05', time: 'Yesterday', initials: 'SC', tone: 'violet', unread: false },
  { id: 6, type: 'System', title: 'Your workspace export is ready', detail: 'The report can be downloaded for 24 hours', time: 'Aug 20, 2026', initials: 'SY', tone: 'blue', unread: false },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [view, setView] = useState('All notifications')
  const [type, setType] = useState('All types')
  const [query, setQuery] = useState('')
  const unreadCount = notifications.filter((notification) => notification.unread).length
  const filtered = notifications.filter((notification) => `${notification.title} ${notification.detail}`.toLowerCase().includes(query.toLowerCase()) && (view === 'All notifications' || notification.unread) && (type === 'All types' || notification.type === type))
  const markRead = (id) => setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, unread: false } : notification))
  const markAllRead = () => setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })))
  return <><PageHeader eyebrow="Workspace inbox" title="Notifications" copy="Stay close to the decisions and updates that need you." action={<button type="button" className="secondary-button" onClick={markAllRead}>Mark all as read</button>} /><section className="panel notifications-panel"><div className="notification-toolbar"><div className="filter-tabs">{['All notifications', 'Unread'].map((item) => <button type="button" className={view === item ? 'is-selected' : ''} key={item} onClick={() => setView(item)}>{item}{item === 'Unread' && <b>{unreadCount}</b>}</button>)}</div><div className="notification-filters"><SearchInput value={query} onChange={setQuery} placeholder="Search notifications" /><select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter notification type"><option>All types</option><option>Leave</option><option>Payroll</option><option>Attendance</option><option>People</option><option>System</option></select></div></div><div className="notification-list">{filtered.map((notification) => <article className={`notification-row ${notification.unread ? 'is-unread' : ''}`} key={notification.id}><span className={`table-avatar ${notification.tone}`}>{notification.initials}</span><div className="notification-copy"><div><strong>{notification.title}</strong>{notification.unread && <i className="unread-dot" />}</div><span>{notification.detail}</span><small>{notification.time}</small></div><button type="button" className="notification-read" onClick={() => markRead(notification.id)}>{notification.unread ? 'Mark read' : 'Read'}</button></article>)}{!filtered.length && <div className="empty-state"><strong>No notifications found</strong><span>Try a different filter or search term.</span></div>}</div></section></>
}