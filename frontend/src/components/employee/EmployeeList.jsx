import React, { useState, useMemo } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeProfileModal } from './EmployeeProfileModal';
import { AddEmployeeModal } from './AddEmployeeModal';
import { StatCard } from '../common/StatCard';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  ShieldCheck,
  Building2,
  CalendarDays,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { getStatusBadgeStyle } from '../../utils/helpers';

export const EmployeeList = () => {
  const { employees, openEmployeeProfile, role } = useHRMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Statistics calculation
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.employmentStatus === 'Active').length;
  const onLeaveEmployees = employees.filter((e) => e.employmentStatus === 'On Leave').length;
  const probationEmployees = employees.filter((e) => e.employmentStatus === 'Probation').length;

  // Filtered list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchStatus = selectedStatus === 'All' || emp.employmentStatus === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchTerm, selectedDept, selectedStatus]);

  const departments = ['All', 'Engineering', 'Design', 'Product', 'Human Resources', 'Finance', 'Marketing'];
  const statuses = ['All', 'Active', 'On Leave', 'Probation', 'Inactive'];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedStatus('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Employee Directory</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 font-medium">
              {employees.length} Personnel
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage organization staff profiles, roles, departments, and payroll credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white text-xs font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Workforce"
          value={totalEmployees}
          subtitle="Full-time & contractors"
          icon={Users}
          color="purple"
          trend={{ value: "+2 this quarter", isPositive: true, label: "growth" }}
        />
        <StatCard
          title="Active Staff"
          value={activeEmployees}
          subtitle="Currently working"
          icon={UserCheck}
          color="emerald"
          trend={{ value: `${Math.round((activeEmployees/totalEmployees)*100)}%`, isPositive: true, label: "capacity" }}
        />
        <StatCard
          title="On Leave"
          value={onLeaveEmployees}
          subtitle="Approved time-off"
          icon={CalendarDays}
          color="blue"
        />
        <StatCard
          title="Probation"
          value={probationEmployees}
          subtitle="Review cycle pending"
          icon={ShieldCheck}
          color="amber"
        />
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#131622] border border-[#23273a] shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee by name, role, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161928] border border-[#23273a] focus:border-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-[#161928] border border-[#23273a] rounded-xl px-3 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-[#131622] text-white">
                  {d === 'All' ? 'All Depts' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#161928] border border-[#23273a] rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-[#131622] text-white">
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#161928] border border-[#23273a] rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Employee Presentation View */}
      {filteredEmployees.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-[#131622] border border-[#23273a] flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-50 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No employees matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Try adjusting your search terms, clear active department filters, or add a new team member.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 border border-brand-500/30 rounded-xl transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID / CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredEmployees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-2xl bg-[#131622] border border-[#23273a] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161928] text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-[#23273a]">
                <tr>
                  <th className="px-5 py-4">Employee</th>
                  <th className="px-4 py-4">Department</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Joined</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23273a]/60">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => openEmployeeProfile(emp.id)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-brand-500 transition-all"
                        />
                        <div>
                          <div className="font-bold text-white group-hover:text-brand-300 transition-colors">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-[#1e2235] text-slate-300 font-medium">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-300 font-medium">{emp.role}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full font-semibold ${getStatusBadgeStyle(emp.employmentStatus)}`}>
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-400">
                      <div>{emp.email}</div>
                      <div className="text-[10px] text-slate-500">{emp.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-400">
                      {new Date(emp.joiningDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEmployeeProfile(emp.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 font-semibold transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <EmployeeProfileModal />
      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
