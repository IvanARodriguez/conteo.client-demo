import { useEffect, useLayoutEffect } from 'react'
import styled from '@emotion/styled'
import MainView from '@/components/global/main-view'
import { store } from '@/utils'
import { useTranslation } from '@/hooks/use-translation-hook'
import DailySales from '@/components/report/order-updates'
import Sales from '@/components/report/sales'
import MonthlyRevenue from '@/components/report/monthly-revenue'
import AnualSales from '@/components/report/anual-sales'
import MonthlyChart from '@/components/report/month-chart'
import { Box } from '@mui/material'
import AnnualChart from '@/components/report/anual-chart'
import MostSoldItem from '@/components/report/most-sold-item'
import MostValuedCustomer from '@/components/report/most-valued-customer'
import { useNavigate } from 'react-router-dom'

function ReportSummary() {
  const actions = store.useActions()
  const state = store.useState()
  const links = useTranslation()?.navLinks
  const navigate = useNavigate()
  useEffect(() => {
    actions.dashboard.getWeekOrderStatus()
  }, [])
  useLayoutEffect(() => {
    if (state.profile.role === 'EMPLOYEE') {
      navigate('/')
      return
    }
    actions.application.setMenuSection('accounting')
    actions.application.setCurrentPage(links.reportSummary)
  }, [state.dashboard.weekStatus])
  return (
    <MainView>
      <Box
        sx={{
          display: 'grid',
          maxWidth: '100vw',
          width: '100%',
          gap: '.5rem',
          gridTemplateRows: 'auto auto',
          height: { xs: 'fit-content', sm: '100%' },
          padding: '1rem',
        }}>
        <UpdatesContainer>
          <DailySales />
          <Sales />
          <MonthlyRevenue />
          <AnualSales />
        </UpdatesContainer>
        <Box
          display={'flex'}
          width={'100%'}
          sx={{ justifyContent: 'stretch' }}
          gap={'.5rem'}
          flexWrap={'wrap'}>
          <MostValuedCustomer />
          <MostSoldItem />
        </Box>
        <MonthlyChart />
        <AnnualChartContainer>
          <AnnualChart />
        </AnnualChartContainer>
      </Box>
    </MainView>
  )
}

export default ReportSummary

export const AnnualChartContainer = styled.div`
  gap: 0.5rem;
  @media (max-width: 768px) {
    min-height: 300px;
    grid-template-columns: 1fr;
  }
`

export const UpdatesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column on mobile screens */
  }
`
