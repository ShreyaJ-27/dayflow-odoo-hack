import type { HTMLAttributes } from 'react'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: 'green' | 'amber' | 'slate' }

export function Badge({ tone = 'green', className = '', ...props }: BadgeProps) {
  const colors = { green: 'bg-[#e3f2e7] text-[#276046]', amber: 'bg-[#fff1d5] text-[#8b5e16]', slate: 'bg-[#edf1f0] text-[#5e6b66]' }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[tone]} ${className}`} {...props} />
}