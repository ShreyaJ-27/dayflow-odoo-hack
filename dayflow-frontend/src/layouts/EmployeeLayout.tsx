import { LogOut } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/ui/Avatar'
import { useAuth } from '../auth/AuthContext'

const navigation = [
  {
    label: 'Employees',
    to: '/employee',
  },
  {
    label: 'My Profile',
    to: '/employee/profile',
  },
  {
    label: 'Attendance',
    to: '/employee/attendance',
  },
  {
    label: 'Time Off',
    to: '/employee/time-off',
  },
  {
    label: 'Payroll',
    to: '/employee/payroll',
  },
]

export function EmployeeLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="sketch-board">
      <div className="sketch-shell">
        <h1 className="sketch-title">For Employees View</h1>

        <section className="sketch-frame">
          <nav className="sketch-tabs" aria-label="Employee navigation">
            <a href="/employee" className="sketch-logo">
              Company Logo
            </a>

            {navigation.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/employee'}
                className={({ isActive }) =>
                  `sketch-tab ${isActive ? 'active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="sketch-user">
              <span className="sketch-dot" aria-hidden="true" />
              <Avatar name={user?.fullName ?? 'Employee'} size="sm" />
            </div>
          </nav>

          <div className="flex items-center justify-between border-b border-(--line) px-4 py-2">
            <span className="sketch-pill bg-(--amber)">
              {user?.fullName ?? 'Employee'}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 border border-(--line) px-3 py-1 text-sm font-bold text-(--muted) transition hover:bg-white/10 hover:text-(--ink)"
            >
              <LogOut size={15} />
              Log Out
            </button>
          </div>

          <main className="sketch-content">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  )
}
