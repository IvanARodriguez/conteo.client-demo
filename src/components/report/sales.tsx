import { Box, Paper, Skeleton, Typography, useTheme } from '@mui/material'
import styled from '@emotion/styled'
import { grey } from '@mui/material/colors'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import { store } from '@/utils'
import FormatCurrency from '../global/format-currency'
import { useEffect } from 'react'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import Glossary from './glossary'

function Sales() {
  const state = store.useState().dashboard

  return (
    <Glossary
      loading={state.loadingWeekStatus}
      amount={state.weekStatus.weeklySales.amountSold ?? 0}
      quantity={state.weekStatus.weeklySales.invoiceTotal ?? 0}
      bottomText="Ganancias de esta semana"
      title="Semana"
    />
  )
}

export default Sales
