import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }

export function Input({ id, label, error, className = '', ...props }: InputProps) {
  return <label htmlFor={id} className="block text-sm font-semibold text-(--ink)">{label && <span className="mb-2 block">{label}</span>}<input id={id} className={`min-h-11 w-full rounded-lg border border-(--line) bg-white px-3 text-sm font-normal outline-none transition focus:border-(--brand) focus:ring-2 focus:ring-[#d6e9de] ${className}`} {...props} />{error && <span className="mt-1 block text-xs font-medium text-red-700">{error}</span>}</label>
}