import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const getRoleRoot = (role) => `/${role.toLowerCase()}/dashboard`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      const dest = from && from !== '/login' ? from : getRoleRoot(user.role);
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = err.message || 'Unable to sign in.';
      setError(
        msg === 'Invalid credentials' ? 'Invalid email or password.' :
        msg === 'Email verification required' ? 'Please verify your email before signing in. Check your inbox.' :
        msg === 'Account is inactive' ? 'Your account is inactive. Contact your administrator.' :
        msg
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-gradient-to-br from-[#0f111c] via-[#131622] to-[#0a0b14] border-r border-[#23273a] p-10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full bg-accent-fuchsia/5 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-fuchsia flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Layers className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-white">Dayflow</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-widest">
                HRMS
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">The People Operating System</span>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mb-3">
              WELCOME BACK
            </p>
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
              Make every<br />
              workday{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-fuchsia">
                count.
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              A calmer, clearer way to support your people — from first check-in to last payslip.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-3">
            {[
              { label: 'Smart attendance tracking' },
              { label: 'Leave & time-off management' },
              { label: 'Payroll & compensation overview' },
              { label: 'Role-based team workspaces' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Orbit decoration */}
          <div className="relative w-24 h-24 mx-auto mt-4">
            <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-spin" style={{ animationDuration: '12s' }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-400" />
            </div>
            <div className="absolute inset-3 rounded-full border border-accent-fuchsia/15 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-fuchsia/60" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-300">DF</div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[10px] text-slate-600 relative z-10">
          © 2026 Dayflow HRMS · Secure enterprise workspace
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-fuchsia flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-white">Dayflow HRMS</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mb-2">
              DAYFLOW WORKSPACE
            </p>
            <h2 className="text-2xl font-black text-white">Sign in to your workspace</h2>
            <p className="text-sm text-slate-400 mt-1.5">
              Your people, your rhythm, all in one place.
            </p>
          </div>

          {/* Error Box */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-sm font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {busy ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-slate-500">
              Need an account?{' '}
              <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                Create one
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
