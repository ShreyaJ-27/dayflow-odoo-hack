import { Sparkles } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <div className="space-y-8"><PageHeader eyebrow="Employee workspace" title={title} description={description} /><Card className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f2e7] text-(--brand)"><Sparkles size={22} /></div><Badge tone="slate">Coming soon</Badge><p className="mt-3 max-w-sm text-sm leading-6 text-(--muted)">This area is part of the Dayflow foundation and will be connected in a future feature slice.</p></Card></div>
}