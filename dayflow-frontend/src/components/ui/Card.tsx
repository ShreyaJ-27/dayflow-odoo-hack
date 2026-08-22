import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border border-(--line) bg-white shadow-[0_8px_24px_rgba(32,58,45,0.05)] ${className}`} {...props} />
}