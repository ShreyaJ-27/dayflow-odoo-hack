import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    inviteCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [verificationToken, setVerificationToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setSuccess('');
    setVerificationToken('');
    try {
      const result = await signup(form);
      const token = result.data?.verificationToken;
      if (token) {
        setVerificationToken(token);
      }
      setSuccess(
        result.message ||
        'Account created! Verify your email before signing in.'
      );
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleInstantVerify = async () => {
    if (!verificationToken || verifying) return;
    setVerifying(true);
    try {
      await api.verifyEmail(verificationToken);
      setVerified(true);
      setSuccess('Email verified successfully! You can now sign in with your credentials.');
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  // After success, show a success message with link to login
  if (success) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#131622] border border-[#23273a] rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{verified ? 'Email Verified!' : 'Account Created!'}</h2>
            <p className="text-xs text-slate-400 mt-2">{success}</p>
          </div>

          <div className="space-y-3 pt-2">
            {verificationToken && !verified && (
              <button
                type="button"
                onClick={handleInstantVerify}
                disabled={verifying}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:scale-[1.01] transition-all disabled:opacity-60"
              >
                {verifying ? 'Verifying email...' : 'Verify Email & Activate Workspace'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:scale-[1.01] transition-all"
            >
              Go to sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-gradient-to-br from-[#0f111c] via-[#131622] to-[#0a0b14] border-r border-[#23273a] p-10 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-brand-600/8 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-fuchsia flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Layers className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-black text-white">Dayflow HRMS</span>
            <p className="text-[10px] text-slate-500">The People Operating System</p>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mb-3">JOIN YOUR TEAM</p>
          <h1 className="text-3xl font-black text-white leading-tight">
            Your workspace<br />awaits.
          </h1>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Use the details provided by your organization to create your account and get started.
          </p>
          <div className="mt-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-300">
              <strong>Note:</strong> After signing up, you'll need to verify your email address before signing in.
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 relative z-10">© 2026 Dayflow HRMS</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-fuchsia flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-white">Dayflow HRMS</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mb-2">
              NEW ACCOUNT
            </p>
            <h2 className="text-2xl font-black text-white">Create your account</h2>
            <p className="text-sm text-slate-400 mt-1.5">
              Use the details provided by your organization.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">First name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  placeholder="Jane"
                  className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last name</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  placeholder="Doe"
                  className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Employee ID</label>
              <input
                type="text"
                required
                value={form.employeeId}
                onChange={(e) => set('employeeId', e.target.value)}
                placeholder="EMP-001"
                className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
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

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account type</label>
              <select
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR Officer</option>
              </select>
            </div>

            {/* HR Invite Code */}
            {form.role === 'HR' && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  HR invite code
                </label>
                <input
                  type="text"
                  required
                  value={form.inviteCode}
                  onChange={(e) => set('inviteCode', e.target.value)}
                  placeholder="Provided by your administrator"
                  className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-sm font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {busy ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
