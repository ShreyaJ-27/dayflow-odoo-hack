import React, { useState, useEffect } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Modal } from '../common/Modal';
import { formatCurrency, getStatusBadgeStyle } from '../../utils/helpers';
import { validateEmail, validatePhone, validateRequired, validatePositiveNumber } from '../../utils/validation';
import {
  User,
  Briefcase,
  DollarSign,
  Edit3,
  Save,
  X,
  Lock,
  ShieldAlert,
  Building2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  HeartPulse,
  CreditCard,
  Receipt,
  PieChart,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const EmployeeProfileModal = () => {
  const {
    employees,
    selectedEmployeeId,
    isProfileModalOpen,
    closeEmployeeProfile,
    updateEmployee,
    role,
    toggleRole
  } = useHRMS();

  const employee = employees.find((e) => e.id === selectedEmployeeId);

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'job' | 'salary'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  // Sync form state when modal opens or employee changes
  useEffect(() => {
    if (employee) {
      setFormData(JSON.parse(JSON.stringify(employee)));
      setIsEditing(false);
      setErrors({});
    }
  }, [employee]);

  if (!employee || !formData) return null;

  const validateField = (field, value) => {
    let error = null;
    if (field === 'name') error = validateRequired(value, 'Full Name');
    if (field === 'email') error = validateEmail(value);
    if (field === 'phone') error = validatePhone(value);
    if (field === 'role') error = validateRequired(value, 'Job Role');

    setErrors((prev) => ({
      ...prev,
      [field]: error
    }));
    return error;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    validateField(field, value);
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSalaryDeductionChange = (field, value) => {
    const num = parseFloat(value) || 0;
    setFormData((prev) => {
      const updatedDeductions = {
        ...prev.salary.taxDeductions,
        [field]: num
      };
      const totalDeductions = Object.values(updatedDeductions).reduce((a, b) => a + b, 0);
      const totalAllowances = Object.values(prev.salary.allowances || {}).reduce((a, b) => a + b, 0);
      const wage = parseFloat(prev.salary.monthlyWage) || 0;
      const netPay = Math.max(0, wage + totalAllowances - totalDeductions);

      return {
        ...prev,
        salary: {
          ...prev.salary,
          taxDeductions: updatedDeductions,
          netMonthlyPay: netPay
        }
      };
    });
  };

  const handleSalaryAllowanceChange = (field, value) => {
    const num = parseFloat(value) || 0;
    setFormData((prev) => {
      const updatedAllowances = {
        ...prev.salary.allowances,
        [field]: num
      };
      const totalAllowances = Object.values(updatedAllowances).reduce((a, b) => a + b, 0);
      const totalDeductions = Object.values(prev.salary.taxDeductions || {}).reduce((a, b) => a + b, 0);
      const wage = parseFloat(prev.salary.monthlyWage) || 0;
      const netPay = Math.max(0, wage + totalAllowances - totalDeductions);

      return {
        ...prev,
        salary: {
          ...prev.salary,
          allowances: updatedAllowances,
          netMonthlyPay: netPay
        }
      };
    });
  };

  const handleWageChange = (value) => {
    const wage = parseFloat(value) || 0;
    const wageErr = validatePositiveNumber(value, 'Monthly Wage');
    setErrors((prev) => ({ ...prev, monthlyWage: wageErr }));

    setFormData((prev) => {
      const totalAllowances = Object.values(prev.salary?.allowances || {}).reduce((a, b) => a + b, 0);
      const totalDeductions = Object.values(prev.salary?.taxDeductions || {}).reduce((a, b) => a + b, 0);
      const netPay = Math.max(0, wage + totalAllowances - totalDeductions);
      const annual = wage * 12;
      const hourly = (wage / 160).toFixed(2);

      return {
        ...prev,
        salary: {
          ...prev.salary,
          monthlyWage: wage,
          annualBase: annual,
          payRate: `$${hourly} / hr`,
          netMonthlyPay: netPay
        }
      };
    });
  };

  const handleSave = () => {
    // Validate all fields
    const nameErr = validateRequired(formData.name, 'Full Name');
    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);
    const roleErr = validateRequired(formData.role, 'Job Role');

    const newErrors = {};
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (phoneErr) newErrors.phone = phoneErr;
    if (roleErr) newErrors.role = roleErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateEmployee(formData);
    setIsEditing(false);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData(JSON.parse(JSON.stringify(employee)));
    setIsEditing(false);
    setErrors({});
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'job', label: 'Job Info', icon: Briefcase },
    { 
      id: 'salary', 
      label: 'Salary Info', 
      icon: DollarSign,
      restricted: role !== 'admin'
    }
  ];

  return (
    <Modal isOpen={isProfileModalOpen} onClose={closeEmployeeProfile} maxWidth="max-w-3xl">
      {/* Header Banner */}
      <div className="-mt-6 -mx-6 mb-6 p-6 bg-gradient-to-r from-brand-900/40 via-surface-100 to-surface-200 border-b border-[#23273a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-brand-500/50 shadow-xl"
              />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#131622] ${
                  formData.employmentStatus === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{formData.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">
                  {formData.id}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium">{formData.role}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1e2235] text-slate-300 border border-slate-700/60">
                  {formData.department}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadgeStyle(formData.employmentStatus)}`}>
                  {formData.employmentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons in header */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-surface-100 hover:bg-surface-50 rounded-xl border border-[#23273a] transition-all"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-brand-300 hover:text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-xl shadow-sm transition-all"
              >
                <Edit3 className="w-4 h-4 text-brand-400" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#23273a]/80 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.restricted && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
                    <Lock className="w-2.5 h-2.5" /> Admin Only
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: Personal Info */}
      {activeTab === 'personal' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full bg-[#161928] border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors ${
                      errors.name ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#23273a] focus:border-brand-500'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium">
                  {formData.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full bg-[#161928] border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#23273a] focus:border-brand-500'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {formData.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full bg-[#161928] border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none transition-colors ${
                      errors.phone ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-[#23273a] focus:border-brand-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {formData.phone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formData.dob}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium">
                  {formData.gender}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Residential Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{formData.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-4 rounded-xl bg-[#161928] border border-[#23273a]">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider mb-3">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              Emergency Contact Information
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Contact Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.emergencyContact?.name || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                    className="w-full bg-[#131622] border border-[#23273a] rounded-lg px-2.5 py-1.5 text-white"
                  />
                ) : (
                  <p className="font-semibold text-white">{formData.emergencyContact?.name || 'N/A'}</p>
                )}
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Relationship</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.emergencyContact?.relationship || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                    className="w-full bg-[#131622] border border-[#23273a] rounded-lg px-2.5 py-1.5 text-white"
                  />
                ) : (
                  <p className="font-semibold text-white">{formData.emergencyContact?.relationship || 'N/A'}</p>
                )}
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Emergency Phone</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.emergencyContact?.phone || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                    className="w-full bg-[#131622] border border-[#23273a] rounded-lg px-2.5 py-1.5 text-white"
                  />
                ) : (
                  <p className="font-semibold text-white">{formData.emergencyContact?.phone || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Job Info */}
      {activeTab === 'job' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Job Role / Title *
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full bg-[#161928] border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none ${
                      errors.role ? 'border-rose-500' : 'border-[#23273a] focus:border-brand-500'
                    }`}
                  />
                  {errors.role && <p className="text-[11px] text-rose-400 mt-1">{errors.role}</p>}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium">
                  {formData.role}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Department
              </label>
              {isEditing ? (
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {formData.department}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Employment Status
              </label>
              {isEditing ? (
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Inactive">Inactive</option>
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeStyle(formData.employmentStatus)}`}>
                    {formData.employmentStatus}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Employment Type
              </label>
              {isEditing ? (
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium">
                  {formData.employmentType}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Joining Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formData.joiningDate}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Reports To / Direct Manager
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => handleInputChange('manager', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium">
                  {formData.manager}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Work Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) => handleInputChange('workLocation', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {formData.workLocation}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Working Schedule
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.workSchedule}
                  onChange={(e) => handleInputChange('workSchedule', e.target.value)}
                  className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              ) : (
                <div className="p-3 rounded-xl bg-[#161928] border border-[#23273a] text-sm text-white font-medium">
                  {formData.workSchedule}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Salary Info (ADMIN ONLY RESTRICTION) */}
      {activeTab === 'salary' && (
        <div className="animate-in fade-in duration-150">
          {role !== 'admin' ? (
            /* RESTRICTED ACCESS SCREEN FOR HR OFFICER */
            <div className="p-8 text-center rounded-2xl bg-[#161928]/80 border border-amber-500/30 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Confidential Compensation Record</h3>
              <p className="text-xs text-slate-300 max-w-md mt-2 leading-relaxed">
                Salary and banking information is strictly confidential. Only users with the <span className="font-semibold text-brand-300">Administrator</span> role have authorization to view, audit, or edit compensation records.
              </p>
              <div className="mt-5 p-3 rounded-xl bg-[#131622] border border-[#23273a] text-xs text-slate-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Current Active Role: <strong className="text-amber-300">HR Officer</strong></span>
              </div>
              <button
                onClick={toggleRole}
                className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-semibold shadow-lg hover:shadow-brand-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Switch to Admin Role to View Salary
              </button>
            </div>
          ) : (
            /* ADMIN ACCESS: FULL SALARY & COMPENSATION BREAKDOWN */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-brand-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Administrator Compensation Suite</h4>
                    <p className="text-xs text-slate-400">Authorized view for payroll, tax, and banking</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Verified Admin Access
                </span>
              </div>

              {/* Top Salary Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#161928] border border-[#23273a]">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Monthly Base Wage</span>
                  {isEditing ? (
                    <div className="mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-white text-lg font-bold">$</span>
                        <input
                          type="number"
                          value={formData.salary?.monthlyWage || 0}
                          onChange={(e) => handleWageChange(e.target.value)}
                          className="w-full bg-[#131622] border border-brand-500/50 rounded-lg px-2.5 py-1 text-base font-bold text-white focus:outline-none"
                        />
                      </div>
                      {errors.monthlyWage && <p className="text-[10px] text-rose-400 mt-1">{errors.monthlyWage}</p>}
                    </div>
                  ) : (
                    <h4 className="text-2xl font-black text-white mt-1">
                      {formatCurrency(formData.salary?.monthlyWage)}
                    </h4>
                  )}
                  <span className="text-[11px] text-slate-400">Rate: {formData.salary?.payRate}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#161928] border border-[#23273a]">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Annual Base Gross</span>
                  <h4 className="text-2xl font-black text-white mt-1">
                    {formatCurrency(formData.salary?.annualBase)}
                  </h4>
                  <span className="text-[11px] text-brand-400">Standard 52-week cycle</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-[#161928] border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <span className="text-xs font-semibold text-emerald-400 uppercase">Net Monthly Payout</span>
                  <h4 className="text-2xl font-black text-emerald-400 mt-1">
                    {formatCurrency(formData.salary?.netMonthlyPay)}
                  </h4>
                  <span className="text-[11px] text-slate-400">After taxes & stipends</span>
                </div>
              </div>

              {/* Bank & Payment Details */}
              <div className="p-4 rounded-2xl bg-[#161928] border border-[#23273a] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-brand-400" />
                  Direct Deposit & Banking Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Bank Name</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.salary?.bankName || ''}
                        onChange={(e) => handleNestedChange('salary', 'bankName', e.target.value)}
                        className="w-full bg-[#131622] border border-[#23273a] rounded-lg px-2.5 py-1.5 text-white"
                      />
                    ) : (
                      <p className="font-semibold text-white">{formData.salary?.bankName}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Account Number</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.salary?.accountNumber || ''}
                        onChange={(e) => handleNestedChange('salary', 'accountNumber', e.target.value)}
                        className="w-full bg-[#131622] border border-[#23273a] rounded-lg px-2.5 py-1.5 text-white font-mono"
                      />
                    ) : (
                      <p className="font-semibold text-white font-mono">{formData.salary?.accountNumber}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Routing / IFSC</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.salary?.routingNumber || ''}
                        onChange={(e) => handleNestedChange('salary', 'routingNumber', e.target.value)}
                        className="w-full bg-[#131622] border border-[#23273a] rounded-lg px-2.5 py-1.5 text-white font-mono"
                      />
                    ) : (
                      <p className="font-semibold text-white font-mono">{formData.salary?.routingNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Deductions and Allowances Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Allowances */}
                <div className="p-4 rounded-2xl bg-[#161928] border border-[#23273a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5" /> Allowances & Benefits
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Monthly</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-slate-300">Housing Allowance (HRA)</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.salary?.allowances?.housingAllowance || 0}
                          onChange={(e) => handleSalaryAllowanceChange('housingAllowance', e.target.value)}
                          className="w-24 text-right bg-[#131622] border border-[#23273a] rounded px-2 py-0.5 text-white"
                        />
                      ) : (
                        <span className="font-semibold text-emerald-400">
                          +{formatCurrency(formData.salary?.allowances?.housingAllowance)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-slate-300">Transport & Commute</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.salary?.allowances?.transportAllowance || 0}
                          onChange={(e) => handleSalaryAllowanceChange('transportAllowance', e.target.value)}
                          className="w-24 text-right bg-[#131622] border border-[#23273a] rounded px-2 py-0.5 text-white"
                        />
                      ) : (
                        <span className="font-semibold text-emerald-400">
                          +{formatCurrency(formData.salary?.allowances?.transportAllowance)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-slate-300">Health & Medical</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.salary?.allowances?.medicalInsurance || 0}
                          onChange={(e) => handleSalaryAllowanceChange('medicalInsurance', e.target.value)}
                          className="w-24 text-right bg-[#131622] border border-[#23273a] rounded px-2 py-0.5 text-white"
                        />
                      ) : (
                        <span className="font-semibold text-emerald-400">
                          +{formatCurrency(formData.salary?.allowances?.medicalInsurance)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-300">Remote / Tech Stipend</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.salary?.allowances?.remoteWorkStipend || 0}
                          onChange={(e) => handleSalaryAllowanceChange('remoteWorkStipend', e.target.value)}
                          className="w-24 text-right bg-[#131622] border border-[#23273a] rounded px-2 py-0.5 text-white"
                        />
                      ) : (
                        <span className="font-semibold text-emerald-400">
                          +{formatCurrency(formData.salary?.allowances?.remoteWorkStipend)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tax Deductions */}
                <div className="p-4 rounded-2xl bg-[#161928] border border-[#23273a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5" /> Tax & Withholdings
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Monthly</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-slate-300">Federal Income Tax</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.salary?.taxDeductions?.federalTax || 0}
                          onChange={(e) => handleSalaryDeductionChange('federalTax', e.target.value)}
                          className="w-24 text-right bg-[#131622] border border-[#23273a] rounded px-2 py-0.5 text-white"
                        />
                      ) : (
                        <span className="font-semibold text-rose-400">
                          -{formatCurrency(formData.salary?.taxDeductions?.federalTax)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-slate-300">State / Provincial Tax</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.salary?.taxDeductions?.stateTax || 0}
                          onChange={(e) => handleSalaryDeductionChange('stateTax', e.target.value)}
                          className="w-24 text-right bg-[#131622] border border-[#23273a] rounded px-2 py-0.5 text-white"
                        />
                      ) : (
                        <span className="font-semibold text-rose-400">
                          -{formatCurrency(formData.salary?.taxDeductions?.stateTax)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-slate-300">Medicare & FICA</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.salary?.taxDeductions?.medicareSocialSecurity || 0}
                          onChange={(e) => handleSalaryDeductionChange('medicareSocialSecurity', e.target.value)}
                          className="w-24 text-right bg-[#131622] border border-[#23273a] rounded px-2 py-0.5 text-white"
                        />
                      ) : (
                        <span className="font-semibold text-rose-400">
                          -{formatCurrency(formData.salary?.taxDeductions?.medicareSocialSecurity)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-300">401(k) / Pension Match</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.salary?.taxDeductions?.retirement401k || 0}
                          onChange={(e) => handleSalaryDeductionChange('retirement401k', e.target.value)}
                          className="w-24 text-right bg-[#131622] border border-[#23273a] rounded px-2 py-0.5 text-white"
                        />
                      ) : (
                        <span className="font-semibold text-rose-400">
                          -{formatCurrency(formData.salary?.taxDeductions?.retirement401k)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
