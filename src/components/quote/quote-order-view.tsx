import { InvoiceOrder } from '@/types'
import { store } from '@/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material'
import FormatCurrency from '../global/format-currency'

export default function QuoteOrders(props: { orders: InvoiceOrder[] }) {
  const state = store.useState()
  const theme = useTheme()
  const { products } = state.product

  return (
    <TableContainer
      sx={{
        overflow: 'auto',
        boxShadow: theme.shadows[3],
        borderRadius: '.5rem',
        flexGrow: 1,
        color: 'inherit',
      }}>
      <Table sx={{ minWidth: 200, color: 'inherit' }} aria-label="simple table">
        <TableHead sx={{ background: theme.palette.divider, color: 'inherit' }}>
          <TableRow>
            <TableCell sx={{ color: 'inherit' }}>#</TableCell>
            <TableCell sx={{ color: 'inherit' }} align="left">
              Nombre del producto
            </TableCell>
            <TableCell sx={{ color: 'inherit' }} align="left">
              Precio
            </TableCell>
            <TableCell sx={{ color: 'inherit' }} align="left">
              Cantidad
            </TableCell>
            <TableCell sx={{ color: 'inherit' }} align="left">
              Monto
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.orders.map((order, index) => (
            <TableRow
              key={order.productId + index}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                color: 'inherit',
              }}>
              <TableCell sx={{ color: 'inherit' }} component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell sx={{ color: 'inherit' }} align="left">
                {' '}
                {products.filter(p => p.id === order.productId)[0]?.name ||
                  'producto no encontrado'}
              </TableCell>
              <TableCell sx={{ color: 'inherit' }} align="left">
                {FormatCurrency({
                  value: order.productprice,
                }) || 'precio de producto no encontrado'}
              </TableCell>
              <TableCell sx={{ color: 'inherit' }} align="left">
                {order.quantity}
              </TableCell>
              <TableCell sx={{ color: 'inherit' }} align="left">
                {FormatCurrency({ value: order.amount })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
