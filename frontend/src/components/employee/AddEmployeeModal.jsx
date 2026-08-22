import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Modal } from '../common/Modal';
import { UserPlus, Plus } from 'lucide-react';

export const AddEmployeeModal = ({ isOpen, onClose }) => {
  const { addEmployee } = useHRMS();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Engineering',
    employmentStatus: 'Active',
    employmentType: 'Full-Time',
    joiningDate: new Date().toISOString().split('T')[0],
    dob: '1995-01-01',
    gender: 'Female',
    address: '',
    manager: 'Elena Vance',
    workLocation: 'Hybrid (HQ)',
    workSchedule: 'Mon - Fri (9:00 AM - 5:00 PM)',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    salary: {
      monthlyWage: 7500,
      annualBase: 90000,
      payRate: '$46.88 / hr',
      currency: 'USD',
      bankName: 'Silicon Valley Bank',
      accountNumber: '•••• •••• 1234',
      routingNumber: '121000358',
      taxDeductions: {
        federalTax: 1200,
        stateTax: 450,
        medicareSocialSecurity: 570,
        retirement401k: 450
      },
      allowances: {
        housingAllowance: 450,
        transportAllowance: 150,
        medicalInsurance: 400,
        remoteWorkStipend: 150
      },
      netMonthlyPay: 5980
    }
  });

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSalaryWage = (val) => {
    const wage = parseFloat(val) || 0;
    setForm((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        monthlyWage: wage,
        annualBase: wage * 12,
        payRate: `$${(wage / 160).toFixed(2)} / hr`,
        netMonthlyPay: Math.round(wage * 0.78)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) {
      alert('Please fill in required fields (Name, Email, Role).');
      return;
    }
    addEmployee(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee" subtitle="Create employee profile and initialize records">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rachel Sterling"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Work Email *</label>
            <input
              type="email"
              required
              placeholder="rachel.s@dayflow.io"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Job Role / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Backend Software Engineer"
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Department</label>
            <select
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            >
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Monthly Base Wage ($)</label>
            <input
              type="number"
              placeholder="7500"
              value={form.salary.monthlyWage}
              onChange={(e) => handleSalaryWage(e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Joining Date</label>
            <input
              type="date"
              value={form.joiningDate}
              onChange={(e) => handleChange('joiningDate', e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Work Location</label>
            <input
              type="text"
              placeholder="Remote (SF, CA)"
              value={form.workLocation}
              onChange={(e) => handleChange('workLocation', e.target.value)}
              className="w-full bg-[#161928] border border-[#23273a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#23273a] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-surface-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30"
          >
            <Plus className="w-4 h-4" />
            Create Employee Record
          </button>
        </div>
      </form>
    </Modal>
  );
};
