import { store } from '@/utils'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material'
import { useCallback, useMemo } from 'react'
import FormatCurrency from '../global/format-currency'
import { FullInvoice } from '@/types'
import useBusinessData from '@/hooks/use-business-data'
import BusinessImage from '../global/business-image'
import InvoiceObservation from './invoice_observation'

function Receipt(props: { fullInvoice: FullInvoice | null }) {
  const state = store.useState()
  const { fullInvoice } = props

  const customer = useMemo(() => {
    return state.customer.customers.filter(
      c => c.id === fullInvoice?.customer_id,
    )[0]
  }, [state.customer.customers])

  const products = useMemo(() => {
    const p =
      fullInvoice?.orders.flatMap(o => {
        return state.product.products.filter(p => p.id === o.productId)
      }) ?? []
    return p
  }, [])

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

  const { formattedBusinessData } = useBusinessData()

  return (
    <Container>
      <Box textAlign={'center'} alignSelf={'center'}>
        <BusinessImage size={120} />
        <Typography></Typography>
        <Typography display={'block'} maxWidth={'180px'} variant="caption">
          {formattedBusinessData.address ?? ''}
        </Typography>
        <Typography display={'block'} maxWidth={'180px'} variant="caption">
          {formattedBusinessData.phone ?? ''}
        </Typography>
        <Typography display={'block'} maxWidth={'180px'} variant="caption">
          RNC {formattedBusinessData.rnc ?? ''}
        </Typography>
      </Box>
      <Typography>Recibo de pago</Typography>
      <Box
        sx={{
          display: 'flex',
          gap: '.5rem',
          width: '100%',
          alignItems: 'center',
        }}>
        <Typography variant="subtitle2">No. factura</Typography>
        <Typography variant="subtitle1" display={'block'}>
          {fullInvoice?.invoiceNo}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '.5rem',
          width: '100%',
          alignItems: 'center',
        }}>
        <Typography variant="subtitle2">Fecha</Typography>
        <Typography variant="caption" display={'block'}>
          {new Date(fullInvoice?.createdAt ?? '').toLocaleString('es-DO')}
        </Typography>
      </Box>
      <Box justifySelf={'start'} textAlign={'left'}>
        <Typography variant="subtitle1" display={'block'}>
          {customer.name ?? 'unknown'}
        </Typography>
        <Typography variant="body2">{customer.address}</Typography>
        <Typography variant="body2">
          {formatPhoneNumber(customer.phone ?? '8090000000')}
        </Typography>
      </Box>
      <Box alignSelf={'start'} width={'100%'}>
        <TableContainer component={Box} minWidth={'100%'}>
          <Table sx={{ minWidth: '100%' }}>
            <TableHead sx={{ width: '100%', border: 0 }}>
              <TableRow sx={{ width: '100%', border: 0 }}>
                <TableCell sx={{ color: 'black !important' }}>Qt</TableCell>
                <TableCell sx={{ color: 'black !important' }}>
                  product
                </TableCell>
                <TableCell sx={{ color: 'black !important' }}>monto</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <TableBody sx={{ width: '100%' }}>
            {fullInvoice?.orders.map(o => (
              <TableRow key={o.id}>
                <TableCell sx={{ color: 'black !important' }}>
                  {o.quantity}
                </TableCell>
                <TableCell sx={{ color: 'black !important', width: '100%' }}>
                  {products.filter(p => p.id === o.productId)[0].name}
                </TableCell>
                <TableCell sx={{ color: 'black !important' }}>
                  {FormatCurrency({ value: o.amount })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </Box>
      <Box
        justifySelf={'start'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'end',
          py: '2rem',
        }}>
        <Typography variant="caption">
          Subtotal: {FormatCurrency({ value: fullInvoice?.subtotal ?? 0 })}
        </Typography>
        <Typography variant="caption">
          Descuento: {FormatCurrency({ value: fullInvoice?.discount ?? 0 })}
        </Typography>
        <Typography variant="caption">
          Impuesto: {FormatCurrency({ value: fullInvoice?.tax ?? 0 })}
        </Typography>
        <Typography variant="caption">
          Total: {FormatCurrency({ value: fullInvoice?.total ?? 0 })}
        </Typography>
      </Box>
      <Box>
        <InvoiceObservation />
      </Box>
    </Container>
  )
}

export default Receipt

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 1.5rem;
  width: 276px;
  background-color: 'transparent';
  font-size: 1.3rem;
  color: black;
  text-align: left;
`
