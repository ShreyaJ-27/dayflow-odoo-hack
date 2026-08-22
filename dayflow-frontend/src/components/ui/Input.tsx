import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }

export function Input({ id, label, error, className = '', ...props }: InputProps) {
  return <label htmlFor={id} className="block text-sm font-bold text-(--ink)">{label && <span className="mb-2 block">{label}</span>}<input id={id} className={`min-h-11 w-full border border-(--line) px-3 text-sm font-normal outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-[#2d7bb855] ${className}`} {...props} />{error && <span className="mt-1 block text-xs font-bold text-[#ff8b8b]">{error}</span>}</label>
}
