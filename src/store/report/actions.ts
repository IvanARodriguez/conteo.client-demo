import { isErrorResponse } from '@/api/util'
import { Context } from '..'
import { enqueueSnackbar } from 'notistack'
import { ReportDateRange } from '@/types'
import { parse } from 'date-fns'
import getUTCDateString from '@/hooks/use-utc-date'
import dayjs from 'dayjs'

export async function getGeneratedReport({ state, effects }: Context) {
  if (state.report.loading) {
    return
  }
  state.report.loading = true

  const from = dayjs(state.report.reportForm.startDate)
    .startOf('day')
    .local()
    .format()

  const to = dayjs(state.report.reportForm.endDate)
    .endOf('day')
    .local()
    .format()

  const customerId = state.report.reportForm.customerId ?? ''
  const productId = state.report.reportForm.productId ?? ''
  const dbResponse = await effects.report.getSalesReport({
    from,
    to,
    customerId,
    productId,
  })

  if (isErrorResponse(dbResponse)) {
    state.report.loading = false

    const error = ((await dbResponse.response.json()) as any).detail

    return enqueueSnackbar(error, { variant: 'error' })
  }

  state.report.loading = false

  state.report.reports = dbResponse.invoices
  state.report.paidAmount = dbResponse.paidTransactions
}

export function setDate({ state }: Context, dateRange: ReportDateRange) {
  state.report.reportForm = dateRange
}

export function setFromDate({ state }: Context, fromDate: string) {
  state.report.reportForm.startDate = fromDate
}
export function setToDate({ state }: Context, toDate: string) {
  state.report.reportForm.endDate = toDate
}

export function setReportSearchCustomer({ state }: Context, name: string) {
  state.report.reportForm.customerId = name
}
export function setReportSearchProduct({ state }: Context, productId: string) {
  state.report.reportForm.productId = productId
}
