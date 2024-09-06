import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { store } from '@/utils'
import { useMemo } from 'react'
import { useTheme } from '@mui/material'
import FormatCurrency from '../global/format-currency'

export default function BasicTable() {
  const state = store.useState()
  const theme = useTheme()
  const invoiceTransactions = useMemo(() => {
    if (!state.invoice.invoiceViewData) return []

    const transactions = state.invoice.invoiceViewData.transactions || []

    const debitTransactions = transactions.filter(
      trans =>
        trans.transaction_type === 'debit' &&
        trans.account_name !== 'Por Cobrar',
    )

    const modifiedTransactions = debitTransactions.map(trans => ({
      ...trans,
      total: undefined,
    }))

    const totalAmount = debitTransactions.reduce(
      (prev, next) => prev + next.amount,
      0,
    )

    const summary = {
      account_name: '--',
      amount: '--',
      createdAt: '--',
      description: '--',
      transaction_type: '--',
      username: '--',
      total: totalAmount,
    }

    return [...modifiedTransactions, summary]
  }, [state.invoice.invoiceViewData])
  return (
    <TableContainer
      component={Paper}
      elevation={10}
      sx={{
        width: '98% !important',
        margin: '1rem auto !important',
        overflow: 'auto',
        height: 'fit-content !important',
      }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: theme.palette.primary.main }}>
              Cuenta
            </TableCell>
            <TableCell sx={{ color: theme.palette.primary.main }}>
              Monto
            </TableCell>
            <TableCell sx={{ color: theme.palette.primary.main }}>
              Tipo
            </TableCell>
            <TableCell sx={{ color: theme.palette.primary.main }}>
              Fecha de Creación
            </TableCell>
            <TableCell sx={{ color: theme.palette.primary.main }}>
              Creador por
            </TableCell>
            <TableCell sx={{ color: theme.palette.primary.main }}>
              Descripción
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: theme.palette.primary.main }}>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoiceTransactions.map((row, id) => (
            <TableRow
              key={row.transaction_type + id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.account_name
                  .replace('Bank', 'Banco')
                  .replace('Cashier', 'Caja')
                  .replace('Sales', 'Ventas')}
              </TableCell>
              <TableCell>
                {typeof row.amount === 'number'
                  ? FormatCurrency({
                      value: row.amount,
                    })
                  : row.amount}
              </TableCell>
              <TableCell>{row.transaction_type}</TableCell>
              <TableCell>
                {row.createdAt !== '--'
                  ? new Date(row.createdAt).toLocaleDateString()
                  : row.createdAt}
              </TableCell>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell align="center">
                {typeof row.total === 'number'
                  ? FormatCurrency({
                      value: row.total,
                    })
                  : '--'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
