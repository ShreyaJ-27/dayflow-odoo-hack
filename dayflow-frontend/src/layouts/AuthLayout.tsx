import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className="sketch-auth">
      <div className="sketch-auth-grid">
        <section className="sketch-note">
          <p className="text-sm">Human Resource Management System</p>
          <span className="brand-label mt-2">Complete Octopus</span>

          <h1 className="mt-14">
            Dayflow
            <br />
            HR board
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-(--muted)">
            Sign in, register, then land on employee cards, attendance,
            time off, profile, and payroll screens drawn like the project
            slides.
          </p>

          <span className="auth-arrow" aria-hidden="true" />
        </section>

        <section className="sketch-auth-card">
          <div className="mb-8 text-center">
            <a href="/login" className="font-display text-3xl font-bold">
              dayflow
              <span className="text-[#ff747c]">.</span>
            </a>
          </div>

          <Outlet />
        </section>
      </div>
    </main>
  )
}
