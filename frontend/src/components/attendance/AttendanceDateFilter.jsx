import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter, Building2, Clock, CalendarRange, Plus, Download } from 'lucide-react';

export const AttendanceDateFilter = ({
  selectedDate,
  setSelectedDate,
  viewType,
  setViewType,
  selectedDept,
  setSelectedDept,
  selectedStatus,
  setSelectedStatus,
  onOpenMarkModal,
  onExportCSV
}) => {
  const departments = ['All', 'Engineering', 'Design', 'Product', 'Human Resources', 'Finance', 'Marketing'];
  const statuses = ['All', 'Present', 'Absent', 'Half-day', 'Leave'];

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate('2026-08-22');
  };

  const formattedDisplayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(selectedDate));

  return (
    <div className="p-4 rounded-2xl bg-[#131622] border border-[#23273a] shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      
      {/* LEFT: Date Navigator & View Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* View Switch: Daily vs Weekly */}
        <div className="flex items-center bg-[#161928] border border-[#23273a] p-1 rounded-xl">
          <button
            onClick={() => setViewType('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewType === 'daily'
                ? 'bg-brand-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily View</span>
          </button>
          <button
            onClick={() => setViewType('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewType === 'weekly'
                ? 'bg-brand-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Weekly View</span>
          </button>
        </div>

        {/* Date Stepper Controls (Daily Mode) */}
        {viewType === 'daily' && (
          <div className="flex items-center bg-[#161928] border border-[#23273a] rounded-xl p-1 gap-1">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="relative flex items-center px-2 py-0.5">
              <Calendar className="w-3.5 h-3.5 text-brand-400 mr-2" />
              <span className="text-xs font-bold text-white whitespace-nowrap">{formattedDisplayDate}</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                title="Select Custom Date"
              />
            </div>

            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleToday}
              className="ml-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-surface-50 text-brand-300 hover:text-white hover:bg-brand-500/20 transition-colors"
            >
              Today
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Filters & Actions */}
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
        {viewType === 'daily' && (
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
        )}

        {/* CSV Export Button */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          title="Export attendance table to CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>

        {/* Manual Mark/Override Button */}
        <button
          onClick={onOpenMarkModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-brand-300 text-xs font-semibold transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log / Override</span>
        </button>
      </div>
    </div>
  );
};
