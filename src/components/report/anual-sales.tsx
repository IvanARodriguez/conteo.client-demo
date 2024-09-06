import React from 'react'
import Glossary from './glossary'
import { store } from '@/utils'

function AnualSales() {
  const state = store.useState()
  return (
    <Glossary
      loading={state.dashboard.loadingWeekStatus}
      amount={state.dashboard.weekStatus.yearSummary.amountSold ?? 0}
      quantity={state.dashboard.weekStatus.yearSummary.invoiceTotal ?? 0}
      title="Año"
      bottomText="Ganancias del este año"
    />
  )
}

export default AnualSales
