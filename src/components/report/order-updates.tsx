import { Box, Paper, Typography, useTheme } from '@mui/material'
import styled from '@emotion/styled'
import ViewListIcon from '@mui/icons-material/ViewList'
import { grey } from '@mui/material/colors'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { store } from '@/utils'
import FormatCurrency from '../global/format-currency'
import Glossary from './glossary'
import { useEffect } from 'react'

function DailySales() {
  const state = store.useState()

  return (
    <Glossary
      title="Hoy"
      loading={state.dashboard.loadingWeekStatus}
      amount={state.dashboard.weekStatus.todaySales.soldToday ?? 0}
      quantity={state.dashboard.weekStatus.todaySales.dayOrderTotal ?? 0}
      bottomText="Ventas de hoy"
    />
  )
}

export default DailySales
