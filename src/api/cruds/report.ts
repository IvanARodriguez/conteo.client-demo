import { GeneratedReport, ReportByDate } from '@/types'
import { createErrorResponse } from '../util'

export async function getSalesReport(reportByDate: ReportByDate) {
  const res = await fetch('/api/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportByDate),
  })
  if (!res.ok) {
    return createErrorResponse(res)
  }
  const newReportByDate = (await res.json()) as {
    invoices: GeneratedReport[]
    paidTransactions: number
  }
  return newReportByDate
}
