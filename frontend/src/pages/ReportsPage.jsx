import { useState } from 'react'
import { PageHeader } from '../components/AdminPageParts'

const reportData = {
  'Last 7 days': [68, 74, 71, 82, 78, 88, 84],
  'Last 30 days': [62, 68, 64, 72, 75, 70, 78, 82, 79, 84, 81, 88],
  'This year': [58, 61, 64, 67, 65, 71, 74, 76, 79, 82, 86, 88],
}

const reportRows = [
  ['Design', '32', '94%', '$21,400', 'mint'],
  ['Engineering', '86', '91%', '$64,800', 'blue'],
  ['People', '18', '96%', '$12,200', 'coral'],
  ['Finance', '24', '98%', '$17,600', 'amber'],
  ['Sales', '42', '87%', '$28,900', 'violet'],
]

export function ReportsPage() {
  const [period, setPeriod] = useState('Last 30 days')
  const [department, setDepartment] = useState('All departments')
  const values = reportData[period]
  const labels = period === 'This year' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : period === 'Last 7 days' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']
  const visibleRows = department === 'All departments' ? reportRows : reportRows.filter(([name]) => name === department)
  return <><PageHeader eyebrow="Business intelligence" title="Reports & analytics" copy="Understand workforce trends and make better decisions." action={<button type="button" className="secondary-button report-export">Export report</button>} /><section className="report-metrics"><article><span className="report-mark mint">AT</span><p>Attendance rate</p><strong>92.4%</strong><small>+3.1% from last period</small></article><article><span className="report-mark coral">LV</span><p>Leave utilization</p><strong>68.2%</strong><small>Within healthy range</small></article><article><span className="report-mark blue">PE</span><p>Headcount</p><strong>248</strong><small>+12 this quarter</small></article><article><span className="report-mark amber">PR</span><p>Payroll total</p><strong>$654k</strong><small>Monthly gross</small></article></section><section className="report-grid"><article className="panel report-chart-panel"><div className="panel-heading"><div><p className="eyebrow">Workforce health</p><h2>Attendance trend</h2></div><div className="report-controls"><select value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Filter report by department"><option>All departments</option><option>Design</option><option>Engineering</option><option>People</option><option>Finance</option><option>Sales</option></select><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Select report period"><option>Last 7 days</option><option>Last 30 days</option><option>This year</option></select></div></div><div className="line-chart"><div className="line-scale"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="line-bars">{values.map((value, index) => <div className="line-column" key={labels[index]}><div className="line-point" style={{ bottom: `${value}%` }} /><div className="line-bar" style={{ height: `${value}%` }} /><small>{labels[index]}</small></div>)}</div></div></article><article className="panel breakdown-panel"><div className="panel-heading"><div><p className="eyebrow">Current workforce</p><h2>Attendance mix</h2></div></div><div className="donut-chart"><div><strong>92%</strong><span>present</span></div></div><div className="breakdown-list"><span><i className="dot mint" />Present<strong>219</strong></span><span><i className="dot amber" />Half-day<strong>12</strong></span><span><i className="dot coral" />Absent<strong>10</strong></span><span><i className="dot blue" />On leave<strong>7</strong></span></div></article></section><section className="panel department-report"><div className="panel-heading"><div><p className="eyebrow">Team comparison</p><h2>Department performance</h2></div><span className="result-count">{visibleRows.length} teams</span></div><div className="table-scroll"><table><thead><tr><th>Department</th><th>Headcount</th><th>Attendance</th><th>Monthly payroll</th><th>Trend</th></tr></thead><tbody>{visibleRows.map(([name, count, attendance, payroll, tone]) => <tr key={name}><td><span className="report-team"><span className={`table-avatar ${tone}`}>{name.slice(0, 2).toUpperCase()}</span><strong>{name}</strong></span></td><td>{count}</td><td><strong className="positive-value">{attendance}</strong></td><td>{payroll}</td><td><span className="trend-up">+ {name === 'Sales' ? '1.8%' : '4.2%'}</span></td></tr>)}</tbody></table></div></section></>
}