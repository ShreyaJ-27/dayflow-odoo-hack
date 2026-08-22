import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-(--brand) text-white shadow-sm hover:bg-(--brand-dark)',
  secondary: 'border border-(--line) bg-white text-(--ink) hover:bg-[#f0f5f1]',
  ghost: 'text-(--muted) hover:bg-[#edf3ef] hover:text-(--ink)',
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />
}