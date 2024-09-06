import { useLayoutEffect } from 'react'
import MainView from '@/components/global/main-view'
import { store } from '@/utils'
import { useTranslation } from '@/hooks/use-translation-hook'

import { Box, Paper, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

function Dashboard() {
  const actions = store.useActions()
  const links = useTranslation()?.navLinks
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Buenos Dias' : hour < 19 ? 'Buenas Tardes' : 'Buenas Noches'
  useLayoutEffect(() => {
    actions.application.setMenuSection('dashboard')
    actions.application.setCurrentPage(links.dashboard)
  }, [])
  return (
    <MainView>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
          justifyContent: 'center',
          gap: '1rem',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <Typography variant="h3">{greeting}</Typography>
        <DashboardAdminView />
      </Box>
    </MainView>
  )
}

export default Dashboard

import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { Link } from 'react-router-dom'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory'
import RestoreIcon from '@mui/icons-material/Restore'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import ImageComponent from '@/components/image-component'
import { useState } from '@/store'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import ReceiptIcon from '@mui/icons-material/Receipt'
import Diversity2Icon from '@mui/icons-material/Diversity2'

type DashboardCardType = {
  link: string
  text: string
  Icon: JSX.Element
  shouldDisplay: boolean
}

function DashboardAdminView() {
  const state = useState()
  const dashboardLinks: DashboardCardType[] = [
    {
      link: '/accounting/report-summary',
      Icon: <AttachMoneyIcon className="dash-card-item" />,
      text: 'Resumen',
      shouldDisplay: state.profile.role === 'ADMIN',
    },
    {
      link: '/accounting/report',
      Icon: <QueryStatsIcon className="dash-card-item" />,
      text: 'Reporte',
      shouldDisplay: state.profile.role === 'ADMIN',
    },
    {
      link: '/transaction',
      Icon: <CompareArrowsIcon className="dash-card-item" />,
      text: 'Transacciones',
      shouldDisplay: true,
    },
    {
      link: '/customer',
      Icon: <StoreMallDirectoryIcon className="dash-card-item" />,
      text: 'Clientes',
      shouldDisplay: true,
    },
    {
      link: '/product',
      Icon: <ShoppingCartIcon className="dash-card-item" />,
      text: 'Productos',
      shouldDisplay: true,
    },
    {
      link: '/vendors',
      Icon: <Diversity2Icon className="dash-card-item" />,
      text: 'Vendedores',
      shouldDisplay: state.profile.role === 'ADMIN',
    },
    {
      link: '/invoice',
      Icon: <ReceiptIcon className="dash-card-item" />,
      text: 'Facturas',
      shouldDisplay: true,
    },
    {
      link: '/invoice/expired',
      Icon: <RestoreIcon className="dash-card-item" />,
      text: 'Expirada',
      shouldDisplay: true,
    },
    {
      link: '/invoice/quote',
      Icon: <RequestQuoteIcon className="dash-card-item" />,
      text: 'Cotizar',
      shouldDisplay: true,
    },
  ]
  return (
    <Box
      sx={{
        display: 'grid',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        gridTemplateColumns: {
          sm: '1fr',
          md: '1fr 1fr',
          lg: 'repeat(3, 1fr)',
        },
      }}>
      <Paper
        component={Link}
        to={state.profile.role === 'ADMIN' ? '/business' : '/'}
        sx={{
          padding: '1rem',
          gridColumn: { sm: 'span 1', md: 'span 2', lg: 'span 3' },
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '5px solid',
          borderImage:
            'linear-gradient(to right, #2cb8fe, #009dff, #006eff, #0062ff, #003c80) 5',
        }}>
        <ImageComponent
          size={50}
          variant={'circular'}
          imgSrc={state.business.business.logourl ?? ''}
          alt="Business Id"
        />
        <Typography>{state.business.business.name}</Typography>
      </Paper>
      {dashboardLinks.map((card, i) => (
        <Paper
          component={Link}
          to={card.link}
          key={card.text + i}
          sx={{
            ':hover': {
              opacity: '.7',
            },
            transition: 'opacity .2s ease-in-out',
            outline: '1px solid gray',
            borderBottom: '5px solid',
            borderImage:
              'linear-gradient(to right, #2cb8fe, #009dff, #006eff, #0062ff, #003c80) 5',
            minWidth: '15rem',
            display: card.shouldDisplay ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            p: '1rem',
          }}>
          <Box
            sx={{
              '>.dash-card-item': {
                width: '40px',
                height: '40px',
              },
            }}>
            {card.Icon}
          </Box>
          <div>{card.text}</div>
        </Paper>
      ))}
    </Box>
  )
}
