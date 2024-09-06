import React, { useMemo } from 'react'
import { MaterialReactTable } from 'material-react-table'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material'
import { store } from '@/utils'
import { green, red } from '@mui/material/colors'
import { MRT_Localization_ES } from 'material-react-table/locales/es'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 10,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const AccountingTransactionTable = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: 'Usuario',
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha',
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
      },
    ],
    [],
  )
  const state = store.useState()
  const data = useMemo(() => {
    const result = []
    const transactionsRecord = state.accounting.filteredTransactions
    for (const date in transactionsRecord) {
      const firstItem = transactionsRecord[date][0]
      const transactions = {
        username: firstItem.username,
        amount: firstItem.amount,
        createdAt: new Date(firstItem.createdAt).toLocaleString(),
        transactions: transactionsRecord[date],
      }
      result.push(transactions)
    }

    return result
  }, [state.accounting.filteredTransactions])

  return (
    <MaterialReactTable
      state={{
        isLoading: state.accounting.loadingFilteredTransactions,
        showProgressBars: state.accounting.loadingFilteredTransactions,
      }}
      columns={columns}
      data={data ?? []}
      enablePagination={false}
      localization={MRT_Localization_ES}
      renderDetailPanel={({ row }) => (
        <Box sx={{ display: 'grid', gap: '.5rem' }}>
          <Typography color={'secondary'}>Transacciones</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Cuenta</StyledTableCell>
                  <StyledTableCell>Monto</StyledTableCell>
                  <StyledTableCell>Fecha</StyledTableCell>
                  <StyledTableCell>Usuario</StyledTableCell>
                  <StyledTableCell>Estado</StyledTableCell>
                  <StyledTableCell>Tipo</StyledTableCell>
                  <StyledTableCell>Descripción</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.original.transactions.map((t, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{t.account_name}</StyledTableCell>
                    <StyledTableCell>{t.amount}</StyledTableCell>
                    <StyledTableCell>{t.createdAt}</StyledTableCell>
                    <StyledTableCell>{t.username}</StyledTableCell>
                    <StyledTableCell>{t.status}</StyledTableCell>
                    <StyledTableCell
                      sx={{
                        color:
                          t.transaction_type === 'credit'
                            ? red[500]
                            : green[500],
                      }}>
                      {t.transaction_type}
                    </StyledTableCell>
                    <StyledTableCell>{t.description}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    />
  )
}

export default AccountingTransactionTable
