import { WeekOrderStatus } from '@/types'
import { createErrorResponse } from '../util'

export async function getOrderWeekUpdates() {
  const res = await fetch('/api/dashboard/week-orders')
  if (!res.ok) {
    return createErrorResponse(res)
  }
  const jsonResponse = (await res.json()) as WeekOrderStatus
  return jsonResponse
}
