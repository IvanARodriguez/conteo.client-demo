import { Box, Divider, Typography, styled, useTheme } from '@mui/material'
import { amber, green, grey, red } from '@mui/material/colors'
import { useCallback } from 'react'
import FormatCurrency from './format-currency'
import { store } from '@/utils'
import { FullInvoice, FullQuote, UserData } from '@/types'
import InvoiceOrders from '../invoices/invoice-order-view'
import useBusinessData from '@/hooks/use-business-data'
import BusinessImage from './business-image'
import InvoiceObservation from '../invoices/invoice_observation'

function A4Receipt(props: {
  invoiceData?: FullInvoice | null
  quoteData?: FullQuote | null
  user: UserData[] | null
  loading: boolean
}) {
  const state = store.useState()
  const business = useBusinessData()
  const { invoiceData, quoteData, loading } = props
  const theme = useTheme()

  const customer = invoiceData
    ? state.customer.customers.filter(c => c.id === invoiceData.customer_id)
    : quoteData
      ? state.customer.customers.filter(c => c.id === quoteData.customer_id)
      : []

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

  function getColor() {
    if (invoiceData?.status === 'Paid') return green[500]

    if (invoiceData?.status === 'Pending') return amber[500]

    if (invoiceData?.status === 'Nulled') return red[500]

    return green[500]
  }

  function getStatus() {
    if (invoiceData?.status === 'Paid') return 'PAGADA'

    if (invoiceData?.status === 'Pending') return 'PENDIENTE'

    if (invoiceData?.status === 'Nulled') return 'ANULADA'

    return 'Activa'
  }

  const data = quoteData ?? invoiceData ?? null
  if (!data || customer.length === 0 || loading) {
    return <Typography>No se encontraron los datos</Typography>
  }

  return (
    <Container>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <Box
          display={'flex'}
          minHeight={'9rem'}
          sx={{
            placeItems: 'center',
            placeContent: 'center',
            margin: '1rem',
          }}>
          <BusinessImage size={140} />
        </Box>
        <Box textAlign={'center'} ml={'1rem'}>
          <Typography>
            {business.formattedBusinessData.name ?? 'Conteo'}
          </Typography>
          <Typography display={'block'} maxWidth={'180px'} variant="caption">
            {business.formattedBusinessData.address ?? ''}
          </Typography>
          <Typography display={'block'} maxWidth={'180px'} variant="caption">
            {business.formattedBusinessData.phone}
          </Typography>
          <Typography display={'block'} maxWidth={'180px'} variant="caption">
            RNC {business.formattedBusinessData.rnc ?? ''}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          px: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          mt: '3rem',
          width: '100%',
          maxHeight: 'none',
          alignSelf: 'center',
          flexGrow: 1,
        }}>
        <Box display={'grid'} gridTemplateColumns={'1fr 1fr'}>
          <Box display={'flex'} flexDirection={'column'} gap={'.3rem'}>
            {invoiceData ? (
              <Box sx={{ display: 'flex', gap: '.5rem' }}>
                <Typography>FACTURA</Typography>
                <Typography color={getColor()}>({getStatus()})</Typography>
              </Box>
            ) : (
              <Typography>COTIZACIÓN </Typography>
            )}
            <Typography>
              Comprobante Fiscal: {invoiceData?.tax_number}
            </Typography>

            <Divider
              sx={{ maxWidth: '80px', border: `1px solid ${grey[400]}` }}
            />
            <Typography variant={'h6'}>{customer[0].name}</Typography>
            <Typography
              color={theme.palette.mode === 'light' ? grey[900] : grey[700]}
              fontWeight={'lighter'}
              variant={'body2'}>
              {' '}
              Dirección: {customer ? customer[0].address : ''}
            </Typography>
            <Typography
              color={theme.palette.mode === 'light' ? grey[900] : grey[700]}
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
            <Typography>
              No.:{' '}
              {invoiceData
                ? invoiceData.invoiceNo
                : quoteData
                  ? quoteData.quote_number
                  : ''}
            </Typography>
            <Typography>
              Fecha: {new Date(data.createdAt).toLocaleString()}
            </Typography>
            <Typography>
              Exp: {new Date(data.expiration_date).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <InvoiceOrders orders={data.orders} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '1rem',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'start',
          }}>
          <InvoiceObservation />
          <Box display={'flex'} flexDirection={'column'} alignItems={'start'}>
            <Typography>
              impuesto: {FormatCurrency({ value: data.tax })}
            </Typography>
            <Typography>
              descuento:
              {FormatCurrency({ value: data.discount })}
            </Typography>
            <Typography>
              Subtotal:
              {FormatCurrency({ value: data.subtotal })}
            </Typography>
            <Typography>
              total:
              {FormatCurrency({ value: data.total })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default A4Receipt

const Container = styled('div')`
  min-width: 850px;
  min-height: 980px;
  background-color: white;
  color: black;
  overflow: visible;
`
