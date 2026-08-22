import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`sketch-card p-5 sm:p-6 ${className}`} {...props} />
}
