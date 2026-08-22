import React from 'react';
import { TableSkeleton } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';

export const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyType = 'search',
  emptyTitle = 'No records found',
  emptyDescription = 'No data matching your current filters.',
  emptyActionText,
  onEmptyAction,
  renderRow,
  rowKey = (item, idx) => item.id || idx,
  maxHeight = 'max-h-[580px]',
  // Pagination Props (Optional)
  pagination = null, // { currentPage, totalItems, pageSize, onPageChange, onPageSizeChange }
  // Bulk selection props (Optional)
  selectable = false,
  allSelected = false,
  onSelectAll = null,
  isIndeterminate = false,
  customHeader = null
}) => {
  if (loading) {
    return <TableSkeleton rows={pagination?.pageSize || 6} cols={columns.length + (selectable ? 1 : 0)} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        type={emptyType}
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="rounded-2xl bg-[#131622] border border-[#23273a] shadow-2xl overflow-hidden flex flex-col">
      {customHeader && <div className="border-b border-[#23273a]">{customHeader}</div>}

      {/* Scrollable Container with Sticky Thead */}
      <div className={`overflow-x-auto overflow-y-auto ${maxHeight}`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-20 bg-[#161928] backdrop-blur-md text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-[#23273a] shadow-sm">
            <tr>
              {selectable && (
                <th className="px-4 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#131622] border-[#23273a] text-brand-600 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-4 font-bold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#23273a]/60">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions}
        />
      )}
    </div>
  );
};
