import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'border border-(--line) bg-(--purple) text-white hover:brightness-110',
  secondary: 'border border-(--line) bg-transparent text-(--ink) hover:bg-white/10',
  ghost: 'text-(--muted) hover:bg-white/10 hover:text-(--ink)',
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />
}
