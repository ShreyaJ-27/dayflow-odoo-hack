import { useState } from 'react'

export function AuthGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('dayflow-auth') === 'true')
  const [email, setEmail] = useState('admin@acme.co')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const signIn = (event) => {
    event.preventDefault()
    if (!email.trim() || password.length < 4) {
      setError('Enter an email and a password with at least 4 characters.')
      return
    }
    sessionStorage.setItem('dayflow-auth', 'true')
    setError('')
    setIsAuthenticated(true)
  }

  const signOut = () => {
    sessionStorage.removeItem('dayflow-auth')
    setIsAuthenticated(false)
    setPassword('')
  }

  if (isAuthenticated) return children({ onSignOut: signOut })

  return <main className="auth-screen"><section className="auth-card"><div className="auth-brand"><span className="brand-mark">D</span><div><strong>dayflow</strong><span>Operations console</span></div></div><div className="auth-copy"><p className="eyebrow">Admin access</p><h1>Welcome back.</h1><p>Sign in to manage your workspace and keep the day moving.</p></div><form className="auth-form" onSubmit={signIn}><label>Work email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button type="submit" className="primary-button">Sign in to Dayflow</button></form><p className="auth-footer">Acme Corporation · Admin workspace</p></section></main>
}