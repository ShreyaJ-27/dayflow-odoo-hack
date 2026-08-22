import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl', subtitle }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div
          className={`relative w-full ${maxWidth} bg-[#131622] border border-[#23273a] rounded-2xl shadow-2xl overflow-hidden z-10 my-8 transition-all animate-in zoom-in-95 duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || subtitle) && (
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#23273a]/80 bg-[#161928]/40">
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-slate-700/50 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
