import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type ModalProps = { open: boolean; title: string; onClose: () => void; children: ReactNode }

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#183128]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 id="modal-title" className="font-display text-xl font-semibold">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-md p-2 text-(--muted) hover:bg-(--canvas)"><X size={18} /></button></div><div className="mt-5">{children}</div></div></div>
}