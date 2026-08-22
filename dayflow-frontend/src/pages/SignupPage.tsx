import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function SignupPage() {
  return <div><p className="mb-3 text-sm font-semibold text-(--brand)">Start simply</p><h1 className="font-display text-3xl font-semibold tracking-tight">Create your account</h1><p className="mt-3 text-sm text-(--muted)">Set up your Dayflow workspace in a few steps.</p><form onSubmit={(event) => event.preventDefault()} className="mt-8 space-y-5"><Input id="name" label="Full name" placeholder="Alex Morgan" autoComplete="name" /><Input id="signup-email" type="email" label="Work email" placeholder="you@company.com" autoComplete="email" /><Button type="submit" className="mt-2 w-full">Create account</Button></form><p className="mt-8 text-center text-sm text-(--muted)">Already have an account? <Link to="/login" className="font-semibold text-(--brand) hover:underline">Sign in</Link></p></div>
}