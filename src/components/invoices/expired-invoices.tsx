import { ExpiredInvoice } from '@/types'
import { store } from '@/utils'
import {
  Paper,
  CircularProgress,
  Typography,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  Table,
  useTheme,
} from '@mui/material'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

const ExpiredInvoices = () => {
  const state = store.useState()
  const actions = store.useActions()
  const expiredInvoices = state.invoice.expiredInvoices
  const theme = useTheme()
  useEffect(() => {
    actions.invoice.getExpiredInvoices()
  }, [])
  if (state.invoice.loadingExpiredInvoice) {
    return (
      <Paper
        sx={{
          margin: '1rem',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
        }}>
        <CircularProgress color="primary" />
        <Typography variant="h5">Cargando facturas expiradas...</Typography>
      </Paper>
    )
  }
  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        position: 'relative',
        width: '100%',
        minWidth: 240,
        height: '100%',
        flex: 1,
        p: '1rem',
      }}>
      <Typography
        sx={{
          position: 'sticky',
          p: '.3rem .5rem',
          background: theme.palette.divider,
          width: 'inherit',
        }}>
        Facturas expiradas
      </Typography>
      {expiredInvoices.length > 0 ? (
        <ExpiredInvoicesTable invoices={expiredInvoices} />
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Paper
            sx={{
              height: '100%',
            }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '100%',
                opacity: 0.3,
                gap: '2rem',
              }}>
              <Box
                component={'img'}
                src={'/payment.svg'}
                alt="delivery driver"
                sx={{ width: { xs: '250px', sm: '180' } }}
              />
              <Typography variant="h6">
                No hay facturas expiradas que mostrar
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Paper>
  )
}

function ExpiredInvoicesTable(props: { invoices: ExpiredInvoice[] }) {
  const [open, setOpen] = useState(false)
  const { invoices } = props
  return (
    <TableContainer sx={{ flex: 1, overflow: 'auto' }} component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>No.</TableCell>
            <TableCell align="left">Total</TableCell>
            <TableCell align="left">Expira</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map(row => (
            <React.Fragment key={row.invoiceNo + row.createdAt}>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.invoiceNo}
                </TableCell>
                <TableCell align="left">{row.total}</TableCell>
                <TableCell align="left">
                  {dayjs(row.expiration_date).toDate().toLocaleDateString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={6}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Typography
                      sx={{ gridColumn: 'span 2' }}
                      variant="h6"
                      gutterBottom
                      component="div">
                      Detalles
                    </Typography>
                    <Box
                      sx={{
                        margin: 1,
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                      }}>
                      <Typography variant="caption">
                        Fecha de Creación:{' '}
                      </Typography>
                      <Typography variant="caption">
                        {dayjs(row.createdAt).toDate().toLocaleString()}
                      </Typography>
                      <Typography variant="caption">Cliente: </Typography>
                      <Typography variant="caption">
                        {row.customer_name}
                      </Typography>
                      <Typography variant="caption">Creado por: </Typography>
                      <Typography variant="caption">{row.username}</Typography>
                      <Typography variant="caption">Vendido Por: </Typography>
                      <Typography variant="caption">
                        {row.vendor ?? 'Desconocido'}
                      </Typography>
                      <Typography variant="caption">
                        Teléfono del cliente:
                      </Typography>
                      <Typography variant="caption">
                        {row.phone ?? 'Desconocido'}
                      </Typography>
                      <Typography variant="caption">
                        Dirección del cliente:
                      </Typography>
                      <Typography variant="caption">
                        {row.address ?? 'Desconocido'}
                      </Typography>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExpiredInvoices
