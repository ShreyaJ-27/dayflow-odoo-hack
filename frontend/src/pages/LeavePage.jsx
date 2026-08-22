import { useEffect, useState } from 'react'
import { PageHeader, SearchInput } from '../components/AdminPageParts'
import { loadStoredValue, saveStoredValue } from '../utils/storage'
import { statusClass } from '../utils/status'

export function LeavePage({ leaves, onDecision }) {
  const [query, setQuery] = useState(() => loadStoredValue('dayflow-leave-search', ''))
  const [filter, setFilter] = useState(() => loadStoredValue('dayflow-leave-filter', 'All requests'))
  const [commentId, setCommentId] = useState(null)
  const [comment, setComment] = useState('')
  const filtered = leaves.filter((leave) => `${leave.employee} ${leave.type}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All requests' || leave.status === filter))
  const saveComment = (leave) => { onDecision(leave.id, leave.status, comment); setCommentId(null); setComment('') }
  const decide = (leave, nextStatus) => { onDecision(leave.id, nextStatus, comment); setCommentId(null); setComment('') }
  useEffect(() => saveStoredValue('dayflow-leave-search', query), [query])
  useEffect(() => saveStoredValue('dayflow-leave-filter', filter), [filter])
  return <><PageHeader eyebrow="Time away" title="Leave requests" copy="Review time-off requests and keep everyone moving." /><section className="panel table-panel"><div className="table-toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Search requests" /><div className="filter-tabs">{['All requests', 'Pending', 'Approved', 'Rejected'].map((item) => <button type="button" className={filter === item ? 'is-selected' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="leave-list">{filtered.map((leave) => <div className="leave-row" key={leave.id}><span className={`table-avatar ${leave.tone}`}>{leave.initials}</span><div className="leave-main"><div className="leave-title"><strong>{leave.employee}</strong><span className={`status-pill ${statusClass(leave.status)}`}>{leave.status}</span></div><span>{leave.type} · {leave.dates} · {leave.days}</span><small>Submitted {leave.submitted}{leave.comment && ` · ${leave.comment}`}</small></div><div className="leave-actions">{leave.status === 'Pending' && <><button type="button" className="approve-button" onClick={() => decide(leave, 'Approved')}>Approve</button><button type="button" className="reject-button" onClick={() => decide(leave, 'Rejected')}>Reject</button><button type="button" className="comment-button" onClick={() => { setCommentId(commentId === leave.id ? null : leave.id); setComment(leave.comment) }}>Comment</button></>}</div>{commentId === leave.id && <div className="comment-editor"><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a note" aria-label={`Comment for ${leave.employee}`} /><button type="button" onClick={() => saveComment(leave)}>Save note</button></div>}</div>)}</div>{!filtered.length && <div className="empty-state"><strong>No leave requests found</strong><span>Try another status or search term.</span></div>}</section></>
}