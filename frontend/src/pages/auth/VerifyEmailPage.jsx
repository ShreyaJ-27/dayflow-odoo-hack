import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Layers, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (tokenToVerify) => {
    const t = tokenToVerify || token;
    if (!t) return;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.verifyEmail(t);
      setSuccess(res.message || 'Email verified successfully! You can now sign in.');
    } catch (err) {
      setError(err.message || 'Verification link is invalid or has expired.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
      handleVerify(urlToken);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-fuchsia flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white">Dayflow HRMS</span>
        </div>

        <div className="bg-[#131622] border border-[#23273a] rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400 mb-1">
              EMAIL VERIFICATION
            </p>
            <h2 className="text-2xl font-black text-white">Verify your account</h2>
            <p className="text-xs text-slate-400 mt-1">
              Confirm your email address to unlock your Dayflow workspace.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Verification Complete</h3>
                <p className="text-xs text-slate-400 mt-1">{success}</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:scale-[1.01] transition-all"
              >
                Sign in to your workspace
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Verification Token
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste verification token here"
                  className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={busy || !token}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:scale-[1.01] transition-all disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify email now
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link to="/login" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
