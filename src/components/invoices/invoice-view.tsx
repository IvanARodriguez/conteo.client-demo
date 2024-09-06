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
import { amber, green, grey, red } from '@mui/material/colors'
import styled from '@emotion/styled'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { store } from '../../utils'
import FormatCurrency from '../global/format-currency'
import Loader from '../global/loader'
import Receipt from './receipt'
import { useReactToPrint } from 'react-to-print'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop'
import A4Receipt from '../global/a4-receipt'
import InvoiceOrders from './invoice-order-view'
import InvoiceTransactions from './invoice-transactions-table'

export const InvoiceView = () => {
  const [printInvoice, setPrintInvoice] = useState(false)
  const actions = store.useActions()
  const state = store.useState()
  const businessData = state.business.business
  const theme = useTheme()
  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const componentInvoiceRef = useRef(null)

  const handlePrintInvoice = useReactToPrint({
    content: () => componentInvoiceRef.current,
  })

  const fullInvoice = state.invoice.invoiceViewData

  const customer = fullInvoice
    ? state.customer.customers.filter(c => c.id === fullInvoice.customer_id)
    : []

  const invoiceAssociate = fullInvoice
    ? state.users.usersData.filter(u => u.id === fullInvoice.user_id)
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
    actions.invoice.setViewModal()
  }

  useLayoutEffect(() => {
    if (state.users.usersData.length === 0) {
      actions.users.getUsers()
    }
    if (state.product.products.length === 0) {
      actions.product.getProducts()
    }
  }, [])

  if (!state.invoice.viewModalOpen) {
    return <></>
  }
  if (
    !fullInvoice ||
    customer.length === 0 ||
    state.invoice.loadingFullInvoice
  ) {
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
        key={'Customer View Dialog'}
        open={state.invoice.viewModalOpen}>
        <DialogTitle fontSize={'3rem'} textAlign="start">
          <Container>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}>
              <Box
                display={'flex'}
                minHeight={'9rem'}
                sx={{
                  pt: '1rem',
                  placeItems: 'center',
                  placeContent: 'center',
                  borderRadius: '0 0 1rem 1rem',
                }}>
                <img
                  src={
                    businessData
                      ? (businessData.logourl ?? 'conteo-logo.svg')
                      : 'conteo-logo.svg'
                  }
                  width={'120px'}
                  loading="lazy"
                />
              </Box>
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
                <Typography>
                  FACTURA{' '}
                  <Box
                    component={'span'}
                    sx={{
                      color:
                        fullInvoice.status === 'Paid'
                          ? green[500]
                          : fullInvoice.status === 'Pending'
                            ? amber[500]
                            : red[500],
                    }}>
                    (
                    {fullInvoice.status
                      .replace('Paid', 'Pagada')
                      .replace('Pending', 'Pendiente')
                      .replace('Nulled', 'Anulada')
                      .toUpperCase()}
                    )
                  </Box>
                </Typography>
                {fullInvoice.tax_number && (
                  <Box sx={{ display: 'flex', gap: '.5rem' }}>
                    <Typography variant="body2">
                      Comprobante Fiscal:{' '}
                    </Typography>
                    <Typography variant="body2">
                      {fullInvoice.tax_number}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ maxWidth: '300px' }} />
                <Typography variant={'h5'}>
                  Cliente: {customer[0].name}
                </Typography>
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
                <Typography>No.: {fullInvoice.invoiceNo}</Typography>
                <Typography>
                  Fecha:{' '}
                  {new Date(fullInvoice.createdAt).toLocaleString('es-DO')}
                </Typography>
                <Typography>
                  Exp:{' '}
                  {new Date(fullInvoice.expiration_date).toLocaleString(
                    'es-DO',
                  )}
                </Typography>
                <Typography>
                  Vendedor:{' '}
                  {invoiceAssociate
                    ? invoiceAssociate[0].username
                    : 'Usuario no encontrado'}
                </Typography>
              </Box>
            </Box>
            {fullInvoice.nulledBy ? (
              <Box sx={{ display: 'grid', gap: '.5rem' }}>
                <Typography variant="body2">{`Esta factura ha sido anulada por ${fullInvoice.nulledBy}.`}</Typography>
                <Typography variant="body2">{`La razón fue: ${fullInvoice.nullReason}.`}</Typography>
              </Box>
            ) : (
              <InvoiceOrders orders={fullInvoice.orders} />
            )}
            <Box display={'flex'} flexDirection={'column'} alignItems={'end'}>
              <Typography>
                impuesto: {FormatCurrency({ value: fullInvoice.tax })}
              </Typography>
              <Typography>
                descuento:
                {FormatCurrency({ value: fullInvoice.discount })}
              </Typography>
              <Typography>
                Balance pendiente:
                {FormatCurrency({ value: fullInvoice.pending_balance })}
              </Typography>
              <Typography>
                Subtotal:
                {FormatCurrency({ value: fullInvoice.subtotal })}
              </Typography>
              <Typography>
                total:
                {FormatCurrency({ value: fullInvoice.total })}
              </Typography>
            </Box>
          </Container>
        </DialogContent>
        <DialogActions
          sx={{ p: '1.25rem', display: !printInvoice ? 'flex' : 'none' }}>
          <Button
            variant="contained"
            onClick={() => {
              actions.invoice.setViewModal()
            }}>
            Close
          </Button>
          <Button
            sx={{ display: 'flex', gap: '.5rem' }}
            variant="contained"
            onClick={handlePrint}>
            <LocalPrintshopIcon />
            <Typography>Recibo</Typography>
          </Button>
          <Button
            sx={{ display: 'flex', gap: '.5rem' }}
            variant="contained"
            onClick={handlePrintInvoice}>
            <LocalPrintshopIcon />
            <Typography>Factura</Typography>
          </Button>
        </DialogActions>
        <Box width={'98%'} margin={'1rem auto'}>
          <Typography margin={'1rem'} variant="h4">
            Transacciones
          </Typography>
          <InvoiceTransactions />
        </Box>
      </Dialog>

      <ReceiptContainer>
        <Box
          ref={componentRef}
          sx={{ height: 'fit-content', width: 'fit-content' }}>
          <Receipt fullInvoice={fullInvoice} />
        </Box>
      </ReceiptContainer>
      <A4Container>
        <Box
          ref={componentInvoiceRef}
          sx={{ height: 'fit-content', width: 'fit-content' }}>
          <A4Receipt
            invoiceData={fullInvoice}
            user={invoiceAssociate}
            loading={state.invoice.loadingFullInvoice}
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

const ReceiptContainer = styled.div`
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
