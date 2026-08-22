
import { Mail, Phone, BriefcaseBusiness, UserRound } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { Avatar } from '../components/ui/Avatar'
import { Card } from '../components/ui/Card'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-sm font-semibold text-(--brand)">
          Employee profile
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          My profile
        </h1>

        <p className="mt-2 text-sm text-(--muted)">
          View your personal and employment information.
        </p>
      </div>

      {/* Profile summary */}
      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar
            name={user?.fullName ?? 'Employee'}
          />

          <div>
            <h2 className="text-xl font-semibold">
              {user?.fullName ?? 'Employee'}
            </h2>

            <p className="mt-1 text-sm text-(--muted)">
              Employee
            </p>

            <p className="mt-2 text-sm text-(--muted)">
              {user?.email ?? 'No email available'}
            </p>
          </div>
        </div>
      </Card>

      {/* Personal information */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
            <UserRound size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Personal information
            </h2>

            <p className="text-sm text-(--muted)">
              Your basic account information.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-(--muted)">
              Full name
            </p>

            <p className="mt-1 text-sm font-semibold">
              {user?.fullName ?? 'Not provided'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-(--muted)">
              Email
            </p>

            <div className="mt-1 flex items-center gap-2">
              <Mail size={15} className="text-(--muted)" />

              <p className="text-sm font-semibold">
                {user?.email ?? 'Not provided'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-(--muted)">
              Phone
            </p>

            <div className="mt-1 flex items-center gap-2">
              <Phone size={15} className="text-(--muted)" />

              <p className="text-sm font-semibold">
                Not provided
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-(--muted)">
              Role
            </p>

            <p className="mt-1 text-sm font-semibold capitalize">
              {user?.role ?? 'Employee'}
            </p>
          </div>
        </div>
      </Card>

      {/* Employment information */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#e4f1e8] p-3 text-(--brand-dark)">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Employment information
            </h2>

            <p className="text-sm text-(--muted)">
              Your current employment details.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-(--muted)">
              Employee ID
            </p>

            <p className="mt-1 text-sm font-semibold">
              {user?.id ?? 'Not assigned'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-(--muted)">
              Department
            </p>

            <p className="mt-1 text-sm font-semibold">
              Not assigned
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-(--muted)">
              Job title
            </p>

            <p className="mt-1 text-sm font-semibold">
              Employee
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-(--muted)">
              Account status
            </p>

            <p className="mt-1 text-sm font-semibold text-(--brand-dark)">
              Active
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

