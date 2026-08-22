import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  // Authentication wiring will own this boundary in a later slice.
  return children
}