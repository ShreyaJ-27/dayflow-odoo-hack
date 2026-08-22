export interface Payslip {
  id: string
  userId: string
  month: string
  grossSalary: number
  deductions: number
  netSalary: number
  status: 'paid' | 'processing'
}

const PAYROLL_KEY = 'dayflow_payroll'

const DEFAULT_PAYSLIPS: Payslip[] = [
  {
    id: 'payslip-july-2026',
    userId: 'demo-user',
    month: 'July 2026',
    grossSalary: 65000,
    deductions: 6500,
    netSalary: 58500,
    status: 'paid',
  },
  {
    id: 'payslip-june-2026',
    userId: 'demo-user',
    month: 'June 2026',
    grossSalary: 65000,
    deductions: 6500,
    netSalary: 58500,
    status: 'paid',
  },
  {
    id: 'payslip-may-2026',
    userId: 'demo-user',
    month: 'May 2026',
    grossSalary: 65000,
    deductions: 6500,
    netSalary: 58500,
    status: 'paid',
  },
]

function getPayslips(): Payslip[] {
  const stored = localStorage.getItem(
    PAYROLL_KEY,
  )

  if (!stored) {
    return DEFAULT_PAYSLIPS
  }

  return JSON.parse(stored) as Payslip[]
}

function savePayslips(
  payslips: Payslip[],
) {
  localStorage.setItem(
    PAYROLL_KEY,
    JSON.stringify(payslips),
  )
}

export function getPayslipHistory(
  userId: string,
): Payslip[] {
  const payslips = getPayslips()

  const userPayslips = payslips.filter(
    (payslip) =>
      payslip.userId === userId,
  )

  if (userPayslips.length > 0) {
    return userPayslips
  }

  return DEFAULT_PAYSLIPS.map(
    (payslip) => ({
      ...payslip,
      userId,
    }),
  )
}

export function getLatestPayslip(
  userId: string,
): Payslip | null {
  const payslips =
    getPayslipHistory(userId)

  return payslips[0] ?? null
}

export function initializePayroll(
  userId: string,
) {
  const existing = getPayslips()

  const alreadyExists = existing.some(
    (payslip) =>
      payslip.userId === userId,
  )

  if (!alreadyExists) {
    const userPayslips =
      DEFAULT_PAYSLIPS.map(
        (payslip) => ({
          ...payslip,
          userId,
        }),
      )

    savePayslips([
      ...existing,
      ...userPayslips,
    ])
  }
}
