import { isErrorResponse } from '@/api/util'
import { Context } from '..'
import { enqueueSnackbar } from 'notistack'

export async function getWeekOrderStatus({ state, effects, actions }: Context) {
  if (state.dashboard.loadingWeekStatus) {
    return
  }
  const res = await effects.dashboard.getOrderWeekUpdates()
  if (isErrorResponse(res)) {
    const errMessage = ((await res.response.json()) as any).detail
    state.dashboard.loadingWeekStatus = false
    return enqueueSnackbar(errMessage, { variant: 'error' })
  }
  state.dashboard.loadingWeekStatus = false
  state.dashboard.weekStatus = res
}
