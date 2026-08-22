// Utility functions for formatting and presentation

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const getStatusBadgeStyle = (status) => {
  const normalized = (status || '').toLowerCase().trim();
  switch (normalized) {
    case 'present':
    case 'approved':
    case 'active':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    case 'absent':
    case 'rejected':
    case 'inactive':
    case 'terminated':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    case 'half-day':
    case 'half day':
    case 'pending':
    case 'probation':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    case 'leave':
    case 'on leave':
    case 'paid leave':
    case 'sick leave':
    case 'time off':
      return 'bg-brand-500/15 text-brand-300 border border-brand-500/30';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/30';
  }
};

export const getLeaveTypeBadge = (type) => {
  const norm = (type || '').toLowerCase();
  if (norm.includes('sick')) {
    return 'bg-rose-500/15 text-rose-300 border border-rose-500/20';
  }
  if (norm.includes('paid') || norm.includes('annual')) {
    return 'bg-brand-500/15 text-brand-300 border border-brand-500/20';
  }
  if (norm.includes('casual')) {
    return 'bg-sky-500/15 text-sky-300 border border-sky-500/20';
  }
  if (norm.includes('unpaid')) {
    return 'bg-amber-500/15 text-amber-300 border border-amber-500/20';
  }
  return 'bg-purple-500/15 text-purple-300 border border-purple-500/20';
};

export const getInitials = (name) => {
  if (!name) return 'DF';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export const getRandomGradient = (id) => {
  const gradients = [
    'from-purple-600 to-indigo-600',
    'from-fuchsia-600 to-pink-600',
    'from-violet-600 to-purple-800',
    'from-cyan-600 to-blue-600',
    'from-emerald-600 to-teal-700',
    'from-amber-600 to-orange-600'
  ];
  const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};
