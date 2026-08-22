import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 10, 20, 50]
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  if (totalItems === 0) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 bg-[#141624] border-t border-[#23273a] rounded-b-2xl text-xs text-slate-400">
      
      {/* Left: Summary and Page Size */}
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-white">{startItem}</strong> to <strong className="text-white">{endItem}</strong> of{' '}
          <strong className="text-white">{totalItems}</strong> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
            <span className="text-slate-400">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-[#161928] border border-[#23273a] rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-[#131622]">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-[#23273a] hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-300"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-[#23273a] hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-300"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-semibold transition-all ${
              p === currentPage
                ? 'bg-brand-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'border border-[#23273a] text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-[#23273a] hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-300"
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-[#23273a] hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-300"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
