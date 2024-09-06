import getUTCDateString from '@/hooks/use-utc-date'
import { ReportDateRange, GeneratedReport } from '@/types'

type ReportState = {
  reports: GeneratedReport[]
  paidAmount: number
  loading: boolean
  reportForm: ReportDateRange
}

export const state: ReportState = {
  reports: [],
  paidAmount: 0,
  loading: false,
  reportForm: {
    startDate: getUTCDateString(),
    endDate: getUTCDateString(),
    key: 'selection',
    customerId: '',
    productId: '',
  },
}
