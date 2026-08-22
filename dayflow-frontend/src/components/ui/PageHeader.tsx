import type { ReactNode } from 'react'

type PageHeaderProps = { eyebrow?: string; title: string; description?: string; action?: ReactNode }

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return <header className="flex flex-col gap-4 border-b border-(--line) pb-6 sm:flex-row sm:items-end sm:justify-between"> <div>{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-(--brand)">{eyebrow}</p>}<h1 className="font-display text-3xl font-semibold tracking-tight text-(--ink)">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm text-(--muted)">{description}</p>}</div>{action}</header>
}