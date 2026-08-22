import { useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  Banknote,
  CalendarDays,
  CheckCircle2,
  FileText,
  Receipt,
} from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '../auth/AuthContext'
import { Card } from '../components/ui/Card'

import {
  getLatestPayslip,
  getPayslipHistory,
  initializePayroll,
} from '../services/payroll.service'

import type { Payslip } from '../services/payroll.service'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function PayrollPage() {
  const { user } = useAuth()

  const userId = user?.id ?? ''

  const [latestPayslip, setLatestPayslip] =
    useState<Payslip | null>(null)

  const [payslips, setPayslips] =
    useState<Payslip[]>([])

  useEffect(() => {
    if (!userId) {
      return
    }

    initializePayroll(userId)

    setLatestPayslip(
      getLatestPayslip(userId),
    )

    setPayslips(
      getPayslipHistory(userId),
    )
  }, [userId])

  const handleDownload = (payslip: Payslip) => {
    const content = `
DAYFLOW PAYSLIP

Employee ID: ${payslip.userId}
Month: ${payslip.month}

Gross Salary: ${formatCurrency(
      payslip.grossSalary,
    )}

Deductions: ${formatCurrency(
      payslip.deductions,
    )}

Net Salary: ${formatCurrency(
      payslip.netSalary,
    )}

Status: ${payslip.status}
`

    const blob = new Blob([content], {
      type: 'text/plain',
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = `dayflow-payslip-${payslip.month.replace(
      /\s+/g,
      '-',
    )}.txt`

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    toast.success('Payslip downloaded.')
  }

  if (!userId) {
    return (
      <div className="rounded-xl border border-(--line) bg-white p-8 text-center">
        <p className="font-semibold">
          Unable to load payroll
        </p>

        <p className="mt-2 text-sm text-(--muted)">
          Please sign in again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-(--brand)">
          Employee compensation
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Payroll
        </h1>

        <p className="mt-2 text-sm text-(--muted)">
          View your salary details and payslip history.
        </p>
      </div>

      {/* Current salary */}
      {latestPayslip && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Banknote
                    size={18}
                    className="text-(--brand)"
                  />

                  <p className="text-sm font-semibold">
                    Latest payslip
                  </p>
                </div>

                <h2 className="mt-4 text-3xl font-semibold">
                  {formatCurrency(
                    latestPayslip.netSalary,
                  )}
                </h2>

                <p className="mt-2 text-sm text-(--muted)">
                  Net salary ·{' '}
                  {latestPayslip.month}
                </p>
              </div>

              <span className="flex w-fit items-center gap-2 rounded-full bg-[#e4f1e8] px-3 py-1.5 text-xs font-semibold capitalize text-(--brand-dark)">
                <CheckCircle2 size={14} />
                {latestPayslip.status}
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-(--line) p-5">
                <p className="text-xs text-(--muted)">
                  Gross salary
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {formatCurrency(
                    latestPayslip.grossSalary,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-(--line) p-5">
                <p className="text-xs text-(--muted)">
                  Deductions
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {formatCurrency(
                    latestPayslip.deductions,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-(--line) p-5">
                <p className="text-xs text-(--muted)">
                  Net salary
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {formatCurrency(
                    latestPayslip.netSalary,
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Payroll summary */}
          <Card>
            <p className="text-sm font-semibold">
              Salary summary
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-(--canvas) p-3">
                  <CalendarDays
                    size={18}
                    className="text-(--brand)"
                  />
                </div>

                <div>
                  <p className="text-xs text-(--muted)">
                    Pay frequency
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Monthly
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-(--canvas) p-3">
                  <Receipt
                    size={18}
                    className="text-(--brand)"
                  />
                </div>

                <div>
                  <p className="text-xs text-(--muted)">
                    Payslips available
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {payslips.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-(--canvas) p-3">
                  <FileText
                    size={18}
                    className="text-(--brand)"
                  />
                </div>

                <div>
                  <p className="text-xs text-(--muted)">
                    Latest month
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {latestPayslip.month}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Payslip history */}
      <Card>
        <div>
          <h2 className="text-lg font-semibold">
            Payslip history
          </h2>

          <p className="mt-1 text-sm text-(--muted)">
            Download and review your previous payslips.
          </p>
        </div>

        {payslips.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-(--line) p-8 text-center">
            <FileText
              size={24}
              className="mx-auto text-(--muted)"
            />

            <p className="mt-3 text-sm font-semibold">
              No payslips available
            </p>

            <p className="mt-1 text-sm text-(--muted)">
              Your payslips will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-(--line) text-xs text-(--muted)">
                  <th className="px-4 py-3 font-medium">
                    Month
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Gross salary
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Deductions
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Net salary
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 font-medium text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {payslips.map((payslip) => (
                  <tr
                    key={payslip.id}
                    className="border-b border-(--line) last:border-0"
                  >
                    <td className="px-4 py-4 text-sm font-semibold">
                      {payslip.month}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {formatCurrency(
                        payslip.grossSalary,
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {formatCurrency(
                        payslip.deductions,
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold">
                      {formatCurrency(
                        payslip.netSalary,
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#e4f1e8] px-3 py-1 text-xs font-semibold capitalize text-(--brand-dark)">
                        {payslip.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            payslip,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-(--line) px-3 py-2 text-xs font-semibold transition hover:bg-(--canvas)"
                      >
                        <ArrowDownToLine
                          size={14}
                        />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Notice */}
      <div className="rounded-xl border border-(--line) bg-white p-4">
        <p className="text-sm text-(--muted)">
          Payroll information shown here is currently
          frontend demo data. It will be connected to
          the Dayflow backend and employee payroll
          records later.
        </p>
      </div>
    </div>
  )
}