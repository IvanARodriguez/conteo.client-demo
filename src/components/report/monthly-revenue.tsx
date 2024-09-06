import Glossary from './glossary'
import { store } from '@/utils'

function MonthlyRevenue() {
  const state = store.useState()
  return (
    <Glossary
      loading={state.dashboard.loadingWeekStatus}
      quantity={state.dashboard.weekStatus.monthSummary.invoiceTotal ?? 0}
      title="Mes"
      amount={state.dashboard.weekStatus.monthSummary.amountSold ?? 0}
      bottomText="Ganancias del mes"
    />
  )
}

export default MonthlyRevenue
