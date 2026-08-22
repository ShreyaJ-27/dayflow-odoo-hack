import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'sonner';
import {
  UserCircle,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Edit3,
  Save,
  X,
  AlertCircle,
  RefreshCw,
  Camera,
  Loader2,
  ShieldCheck
} from 'lucide-react';

const fmtDate = (v) => v ? new Date(v).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

export const ProfilePage = () => {
  const { user, setUser, role } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [form, setForm] = useState({});
  const picRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.myProfile();
      setProfile(result.data);
      setForm({
        firstName: result.data.firstName || '',
        lastName: result.data.lastName || '',
        phone: result.data.phone || '',
        department: result.data.department || '',
        position: result.data.position || '',
        bio: result.data.bio || '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await api.updateMyProfile(form);
      setProfile(result.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large. Maximum size is 5 MB.');
      return;
    }
    setUploadingPic(true);
    try {
      const result = await api.uploadProfilePicture(file);
      setProfile((prev) => ({ ...prev, profilePicture: result.data.url }));
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error(err.message || 'Failed to upload picture');
    } finally {
      setUploadingPic(false);
      if (picRef.current) picRef.current.value = '';
    }
  };

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const initials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase();

  const roleLabel = role === 'ADMIN' ? 'Administrator' : role === 'HR' ? 'HR Officer' : 'Employee';
  const roleColor = role === 'ADMIN' ? 'bg-brand-500/15 text-brand-300 border-brand-500/30' :
    role === 'HR' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
    'bg-blue-500/15 text-blue-300 border-blue-500/30';

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-1/4 bg-white/5 rounded-xl" />
        <div className="h-48 bg-white/5 rounded-2xl" />
        <div className="h-60 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <p className="text-sm text-slate-400">{error}</p>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold">
          <RefreshCw className="w-4 h-4" />Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">My Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your personal information and account details.</p>
      </div>

      {/* Avatar + Basic Info */}
      <div className="p-6 rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-2xl font-black text-white ring-2 ring-brand-500/30">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <label className="absolute -bottom-1.5 -right-1.5 cursor-pointer w-8 h-8 rounded-xl bg-brand-600 hover:bg-brand-500 flex items-center justify-center shadow-lg transition-colors">
              {uploadingPic ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Camera className="w-3.5 h-3.5 text-white" />}
              <input
                ref={picRef}
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handlePicUpload}
                disabled={uploadingPic}
              />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-white">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-sm text-slate-400">{profile?.position || 'No position set'}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleColor}`}>
                <ShieldCheck className="w-2.5 h-2.5" />
                {roleLabel}
              </span>
              {profile?.employmentStatus && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {profile.employmentStatus}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-mono">{user?.email}</p>
          </div>

          {/* Edit button */}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e2235] hover:bg-[#232845] border border-slate-700/60 text-xs font-semibold text-slate-200 hover:text-white transition-all shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>

        {/* Detail chips */}
        {!editing && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Mail, label: 'Email', value: user?.email },
              { icon: Phone, label: 'Phone', value: profile?.phone || '—' },
              { icon: Building2, label: 'Department', value: profile?.department || '—' },
              { icon: Briefcase, label: 'Position', value: profile?.position || '—' },
              { icon: Calendar, label: 'Joined', value: fmtDate(profile?.joiningDate) },
              { icon: UserCircle, label: 'Employee ID', value: user?.employeeId || '—' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#161928] border border-[#23273a]">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold">{item.label}</p>
                    <p className="text-xs font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Form */}
      {editing && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#23273a]">
            <h3 className="text-sm font-bold text-white">Edit Profile</h3>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
                placeholder="Engineering"
                className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Position</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => set('position', e.target.value)}
                placeholder="Software Engineer"
                className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio (optional)</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="A short bio about yourself..."
              className="w-full bg-[#141624] border border-[#23273a] focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#23273a]">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-xl bg-[#1e2235] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
            >
              {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : <><Save className="w-3.5 h-3.5" />Save changes</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
