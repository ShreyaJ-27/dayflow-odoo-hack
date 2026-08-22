import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Mail, Phone, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { getStatusBadgeStyle } from '../../utils/helpers';

export const EmployeeCard = ({ employee }) => {
  const { openEmployeeProfile } = useHRMS();

  return (
    <div
      onClick={() => openEmployeeProfile(employee.id)}
      className="group glass-card rounded-2xl p-5 relative overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {/* Top row: Avatar + Name + Status */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-brand-500/80 transition-all duration-300 shadow-md"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#141624] ${
                  employee.employmentStatus === 'Active'
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                    : employee.employmentStatus === 'On Leave'
                    ? 'bg-brand-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                    : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                }`}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors flex items-center gap-1.5">
                {employee.name}
              </h3>
              <p className="text-xs font-medium text-slate-300 mt-0.5">{employee.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1e2235] text-slate-300 border border-slate-700/60">
                  {employee.department}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeStyle(employee.employmentStatus)}`}>
                  {employee.employmentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div className="mt-4 pt-3.5 border-t border-white/5 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-400 transition-colors" />
            <span className="truncate text-slate-300">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-400 transition-colors" />
            <span className="text-slate-300">{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-400 transition-colors" />
            <span className="truncate text-slate-300">{employee.workLocation}</span>
          </div>
        </div>
      </div>

      {/* Footer info & CTA */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Joined {new Date(employee.joiningDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-brand-400 group-hover:text-brand-300 group-hover:translate-x-1 transition-transform">
          <span>View Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
