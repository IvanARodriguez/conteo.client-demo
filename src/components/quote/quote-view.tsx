import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
  Button,
  Divider,
  useTheme,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import styled from '@emotion/styled'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { store } from '../../utils'
import FormatCurrency from '../global/format-currency'
import Loader from '../global/loader'
import { useReactToPrint } from 'react-to-print'
import InvoiceOrders from './quote-order-view'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop'
import A4Receipt from '../global/a4-receipt'

export const QuoteView = () => {
  const [printQuote, setPrintQuote] = useState(false)
  const actions = store.useActions()
  const state = store.useState()
  const theme = useTheme()
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  const componentQuoteRef = useRef(null)
  const handlePrintQuote = useReactToPrint({
    content: () => componentQuoteRef.current,
  })

  const fullQuote = state.quote.quoteViewData

  const customer = fullQuote
    ? state.customer.customers.filter(c => c.id === fullQuote.customer_id)
    : []
  const invoiceAssociate = fullQuote
    ? state.users.usersData.filter(u => u.id === fullQuote.user_id)
    : null
  const formatPhoneNumber = useCallback((phone: string) => {
    const cleanInput = phone.replace(/\D/g, '').replace('-', '')
    if (cleanInput.length < 9) {
      return 'Teléfono inválido'
    }
    const formattedInput = `${cleanInput.slice(0, 3)}-${cleanInput.slice(
      3,
      6,
    )}-${cleanInput.slice(6, 10)}`
    return formattedInput
  }, [])

  function onClose() {
    actions.quote.setViewModal()
  }

  useLayoutEffect(() => {
    if (state.users.usersData.length === 0) {
      actions.users.getUsers()
    }
    if (state.product.products.length === 0) {
      actions.product.getProducts()
    }
  }, [])

  if (!state.quote.viewModalOpen) {
    return <></>
  }
  if (!fullQuote || customer.length === 0 || state.quote.loadingFullQuote) {
    return (
      <Box width={'100%'} height={'100%'}>
        <Loader />
      </Box>
    )
  }

  return (
    <Box>
      <Dialog
        onClose={onClose}
        sx={{
          '& .MuiPaper-root': {
            maxHeight: '100%',
            maxWidth: { sm: '1063px' },
            display: 'block',
            flexDirection: 'column',
            overflowY: 'auto', // Prevent scrolling
            width: '100vw',
            height: '100vh',
            m: { xs: '.5rem' },
          },
          '& .MuiTypography-root ': {
            p: 0,
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxHeight: { sm: '95vh', xs: '100vh' },
          overflowY: 'auto',
          margin: { sm: 'auto 0', xs: '.5rem auto' },
        }}
        key={'Quote View Dialog'}
        open={state.quote.viewModalOpen}>
        <DialogTitle fontSize={'3rem'} textAlign="start">
          <Container>
            <Box display={'flex'} alignItems={'center'} gap={'1rem'}>
              <Box
                display={'flex'}
                minHeight={'9rem'}
                sx={{
                  background:
                    theme.palette.mode === 'light' ? grey[900] : grey[200],
                  placeItems: 'center',
                  placeContent: 'center',
                  borderRadius: '0 0 1rem 1rem',
                }}>
                <img src="/unaqua-logo.png" width={'200px'} loading="lazy" />
              </Box>
              <Typography
                color={theme.palette.mode === 'light' ? grey[400] : grey[200]}
                variant="h2">
                Cotización
              </Typography>
            </Box>
          </Container>
        </DialogTitle>
        <DialogContent
          sx={{
            mt: '3rem',
            width: '100%',
            maxHeight: 'none',
            alignSelf: 'center',
            flexGrow: 1,
          }}>
          <Container>
            <Box display={'grid'} gridTemplateColumns={'1fr 1fr'}>
              <Box display={'flex'} flexDirection={'column'} gap={'.3rem'}>
                <Typography variant={'h5'}>{customer[0].name}</Typography>
                <Typography
                  color={theme.palette.mode === 'light' ? grey[900] : grey[500]}
                  fontWeight={'lighter'}
                  variant={'body2'}>
                  {' '}
                  Dirección: {customer ? customer[0].address : ''}
                </Typography>
                <Typography
                  color={theme.palette.mode === 'light' ? grey[900] : grey[500]}
                  fontWeight={'lighter'}
                  variant={'body2'}>
                  {' '}
                  Teléfono: {formatPhoneNumber(customer[0].phone || '')}
                </Typography>
              </Box>
              <Box
                display={'flex'}
                justifySelf={'end'}
                flexDirection={'column'}
                gap={'.5rem'}>
                <Typography>No.: {fullQuote.quote_number}</Typography>
                <Typography>
                  Fecha: {new Date(fullQuote.createdAt).toLocaleString()}
                </Typography>
                <Typography>
                  Exp: {new Date(fullQuote.expiration_date).toLocaleString()}
                </Typography>
                <Typography>
                  Vendedor:{' '}
                  {invoiceAssociate
                    ? invoiceAssociate[0].username
                    : 'Usuario no encontrado'}
                </Typography>
              </Box>
            </Box>

            <InvoiceOrders orders={fullQuote.orders} />
            <Box display={'flex'} flexDirection={'column'} alignItems={'end'}>
              <Typography>
                impuesto: {FormatCurrency({ value: fullQuote.tax })}
              </Typography>
              <Typography>
                descuento:
                {FormatCurrency({ value: fullQuote.discount })}
              </Typography>
              <Typography>
                Subtotal:
                {FormatCurrency({ value: fullQuote.subtotal })}
              </Typography>
              <Typography>
                total:
                {FormatCurrency({ value: fullQuote.total })}
              </Typography>
            </Box>
          </Container>
        </DialogContent>
        <DialogActions
          sx={{ p: '1.25rem', display: !printQuote ? 'flex' : 'none' }}>
          <Button
            sx={{ display: 'flex', gap: '.5rem' }}
            variant="contained"
            onClick={handlePrintQuote}>
            <LocalPrintshopIcon />
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              actions.quote.setViewModal()
            }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <A4Container>
        <Box
          ref={componentQuoteRef}
          sx={{ height: 'fit-content', width: 'fit-content' }}>
          <A4Receipt
            quoteData={fullQuote}
            user={invoiceAssociate}
            loading={state.quote.loadingFullQuote}
          />
        </Box>
      </A4Container>
    </Box>
  )
}

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  margin-bottom: 2rem;
`

const A4Container = styled('div')`
  max-height: 100vh;
  overflow-y: auto;
  position: absolute;
  height: fit-content;
  width: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: 1rem auto;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background: #1818186c;
  display: none;
  backdrop-filter: blur(5.5px);
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
  overflow: auto;
  min-height: 100vh;
`
