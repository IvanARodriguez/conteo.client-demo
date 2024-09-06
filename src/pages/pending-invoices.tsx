import MainView from '@/components/global/main-view'
import { store, translateAccountsName } from '@/utils'
import { dictionary } from '@/utils/dictionary'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  List,
  Paper,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import dayjs from 'dayjs'
import { grey, red } from '@mui/material/colors'
import FormatCurrency from '@/components/global/format-currency'
import InvoiceTransactionModal from '@/components/transaction/invoice-transaction-modal'

function PendingInvoices() {
  const actions = store.useActions()
  const state = store.useState()
  const theme = useTheme()
  const currentTheme = theme.palette.mode

  const links = dictionary[state.application.language]?.navLinks
  const [filter, setFilter] = useState('')
  const pendingInvoices = useMemo(() => {
    return filter
      ? state.invoice.pendingInvoices.filter(inv => inv.name.includes(filter))
      : state.invoice.pendingInvoices
  }, [filter, state.invoice.pendingInvoices])

  async function openCreateTransactionModal({
    invoiceId,
  }: {
    invoiceId: string
  }) {
    actions.transaction.setInvoiceFormInvoiceId(invoiceId)
    actions.transaction.setInvoiceTransactionModal(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await actions.transaction.makeInvoicePayment()
    await actions.invoice.getPendingInvoice()
  }

  useEffect(() => {
    actions.application.setMenuSection('invoice')
    actions.application.setCurrentPage(links.pending)
    if (state.customer.customers.length === 0) {
      actions.customer.getCustomers()
    }
  }, [])
  useEffect(() => {
    actions.invoice.getPendingInvoice()
  }, [])
  return (
    <MainView>
      <Box
        component={Paper}
        elevation={0}
        height={'calc(100% - 1rem)'}
        sx={{
          padding: '1rem',
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
        }}>
        <Box component={Paper} minWidth={'300px'} p={'1rem'}>
          <Paper
            elevation={2}
            sx={{
              padding: '.5rem',
              borderBottom: `1px solid ${theme.palette.primary.main}`,
            }}>
            <Typography>Balance por cobrar</Typography>
            {state.invoice.loadingPendingInvoices ? (
              <Skeleton variant="rectangular" height={60} />
            ) : (
              <Typography variant="h5">
                {state.invoice.pendingInvoices.length > 0 ? (
                  <FormatCurrency
                    value={state.invoice.pendingInvoices
                      .map(i => i.pendingBalance)
                      .reduce((prev, curr) => prev + curr)}
                  />
                ) : (
                  0
                )}
              </Typography>
            )}
          </Paper>
        </Box>
        <Box
          minHeight={'96vh'}
          height={'fit-content'}
          display={'flex'}
          flexDirection={'column'}>
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}>
            <Typography variant="h6">Facturas Por Cobrar</Typography>
            <TextField
              size={'small'}
              value={filter}
              placeholder="Buscar por cliente"
              onChange={e => setFilter(e.target.value)}
            />
          </Box>
          <Virtuoso
            style={{
              flexGrow: 1,
              minHeight: '100%',
              overflowY: 'auto',
            }}
            data={pendingInvoices}
            itemContent={(_index, invoice) => (
              <List>
                {state.invoice.loadingPendingInvoices ? (
                  <Skeleton variant="rectangular" height={50} />
                ) : (
                  <Accordion TransitionProps={{ unmountOnExit: true }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header">
                      <Box
                        display={'flex'}
                        gap={'1rem'}
                        justifyContent={'center'}
                        flexGrow={1}
                        alignItems={'center'}>
                        {/* <Typography>{_index + 1}</Typography> */}
                        <Box
                          display={'flex'}
                          gap={'.5rem'}
                          flexWrap={'wrap'}
                          flexGrow={1}>
                          <Box
                            display={'flex'}
                            gap={'.5rem'}
                            flexGrow={1}
                            flexWrap={'wrap'}
                            justifyContent={'space-between'}>
                            <Box display={'flex'} flexDirection={'column'}>
                              <Typography>{invoice.name}</Typography>
                              <Typography
                                color={
                                  currentTheme === 'dark'
                                    ? grey[700]
                                    : grey[400]
                                }
                                variant="caption">
                                No. de Factura {invoice.invoiceNo}
                              </Typography>
                            </Box>
                            <Box
                              display={'flex'}
                              flexDirection={'column'}
                              alignItems={'end'}>
                              <Typography>Balance pendiente</Typography>
                              <Box display={'flex'}>
                                <Typography color={red[400]} variant="caption">
                                  <FormatCurrency
                                    value={invoice.pendingBalance}
                                  />
                                </Typography>
                                <Typography variant="caption">/</Typography>{' '}
                                <Typography variant="caption">
                                  <FormatCurrency value={invoice.total} />
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                      }}>
                      <>
                        <Box>
                          <Button
                            onClick={() =>
                              openCreateTransactionModal({
                                invoiceId: invoice.id,
                              })
                            }
                            variant="contained"
                            size="small">
                            Pagar
                          </Button>
                          {/* <Button variant="contained" size="small">
                            Ver
                          </Button> */}
                        </Box>
                        <Box
                          component={Paper}
                          elevation={3}
                          padding={'.5rem 1rem'}
                          display={'flex'}
                          gap={'1rem'}
                          flexWrap={'wrap'}>
                          <Typography variant="caption">
                            Creada:{' '}
                            {new Date(invoice.createdAt).toLocaleString()}
                          </Typography>
                          <Typography variant="caption">
                            Expira:{' '}
                            {new Date(invoice.expiration_date).toLocaleString()}
                          </Typography>
                          <Typography variant="caption">
                            Facturado por: {invoice.username}
                          </Typography>
                        </Box>
                        {invoice.transactions.length > 0 ? (
                          <>
                            <Typography variant="h6">Transacciones</Typography>
                            {invoice.transactions.map((trans, i) => (
                              <Paper
                                elevation={3}
                                key={`${trans.amount}` + i}
                                sx={{
                                  display: 'grid',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  p: '.5rem',
                                  gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: '1fr auto',
                                  },
                                }}>
                                <Box
                                  display={'flex'}
                                  flexDirection={'column'}
                                  gap={1}>
                                  <Typography variant="caption">
                                    {trans.description ?? 'Sin descripción'}
                                  </Typography>
                                  <Typography variant="caption">
                                    Creada:{' '}
                                    {new Date(trans.createdAt).toLocaleString(
                                      'es-DO',
                                    ) ?? 'Fecha Invalida'}
                                  </Typography>
                                </Box>
                                <Box
                                  display={'flex'}
                                  alignItems={'end'}
                                  flexDirection={'column'}
                                  gap={1}>
                                  <Typography
                                    variant="caption"
                                    color={
                                      trans.transaction_type === 'credit'
                                        ? 'error'
                                        : 'secondary'
                                    }>
                                    <FormatCurrency
                                      value={trans.amount}
                                      type={trans.transaction_type}
                                    />
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    display={'block'}>
                                    {translateAccountsName(trans.account_name)}

                                    {trans.username
                                      ? ` / ${trans.username}`
                                      : ''}
                                  </Typography>
                                </Box>
                              </Paper>
                            ))}
                          </>
                        ) : (
                          <Box
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'center'}
                            gap={1}
                            alignItems={'center'}>
                            <Box height={'100px'}>
                              <img
                                loading="lazy"
                                height={'100px'}
                                src="/not-found-trans.svg"
                              />
                            </Box>
                            <Typography variant="caption" textAlign={'center'}>
                              No se encontraron transacciones pertenecientes a
                              esta factura
                            </Typography>
                          </Box>
                        )}
                      </>
                    </AccordionDetails>
                  </Accordion>
                )}
              </List>
            )}
          />
        </Box>
      </Box>
      <InvoiceTransactionModal onSubmit={handleSubmit} />
    </MainView>
  )
}

export default PendingInvoices
