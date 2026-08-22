type AvatarProps = { name: string; src?: string; size?: 'sm' | 'md' | 'lg' }

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const dimensions = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-lg' }
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return src ? <img className={`rounded-full border border-(--line) object-cover ${dimensions[size]}`} src={src} alt={name} /> : <span className={`inline-flex items-center justify-center rounded-full border border-(--line) bg-(--purple) font-bold text-white ${dimensions[size]}`} aria-label={name}>{initials}</span>
}
