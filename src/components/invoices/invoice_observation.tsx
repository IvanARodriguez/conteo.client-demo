import { store } from '@/utils'
import { Typography } from '@mui/material'
import React from 'react'

function InvoiceObservation() {
  const state = store.useState()
  if (!state.business.business.invoice_observation) {
    return <></>
  }
  return (
    <Typography sx={{ maxWidth: 500 }} variant="caption">
      {state.business.business.invoice_observation}
    </Typography>
  )
}

export default InvoiceObservation
