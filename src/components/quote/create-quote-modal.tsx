import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Autocomplete,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slide,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { TransitionProps } from '@mui/material/transitions'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { LoadingButton } from '@mui/lab'
import NoDataImage from '../../assets/no-data-image'
import { InvoiceStatus } from '../../types'
import Counter from '../global/counter'

import { useTranslation } from '../../hooks'
import * as store from '../../store'
import FormatCurrency from '../global/format-currency'
import { useUTCDate } from '@/hooks/use-utc-date'

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>,
  ) => {
    return <Slide direction="down" ref={ref} {...props} />
  },
)
export const CreateQuoteModal = () => {
  const state = store.useState()

  const [productAutoComplete, setProductAutoComplete] = useState('product')

  const actions = store.useActions()

  const translation = useTranslation()

  const customers = useMemo(
    () => state.customer.customers,
    [state.customer.customers],
  )

  const handleSubmit = () => {
    actions.quote.createQuote()
  }

  function handleAddOrder() {
    actions.quote.setQuoteOrder()
    setProductAutoComplete(
      `${productAutoComplete}${Math.floor(Math.random() * 10)}`,
    )
  }

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const formOrder = state.quote.orderForm

  useEffect(() => {
    if (state.product.products.length === 0) {
      actions.product.getProducts()
    }
    if (state.customer.customers.length === 0) {
      actions.customer.getCustomers()
    }
  }, [state.quote.useTax, state.quote.formState.subtotal])

  return (
    <Dialog
      key={'invoiceCreateForm'}
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-container .MuiPaper-root': {
          minWidth: { xs: 'none', sm: '360px', md: '900px' },
          minHeight: { xs: '100vh', sm: '95vh' },
          m: 0,
          py: '2rem',
          display: 'flex',
          placeItems: 'center',
        },

        '& .MuiInputBase-root': {
          maxHeight: '48px',
          height: 'inherit',
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
        },
      }}
      open={state.quote.createViewOpen}>
      <DialogTitle variant="h4" textAlign="left">
        {translation.quotePage.title}
      </DialogTitle>
      <DialogContent
        sx={{
          width: '100%',
          py: 0,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '2rem',
        }}>
        <Box
          sx={{
            display: 'flex',
            mt: '1rem',
            gap: '1rem',
            flexWrap: 'wrap',
            placeItems: 'start',
            placeContent: 'center',
          }}>
          <FormControl
            fullWidth
            sx={{
              mt: '0',
              height: '100% !important',
              maxWidth: { md: '260px' },
            }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                onChange={e => {
                  if (!e) return
                  actions.quote.setQuoteExpirationDate(useUTCDate(e))
                }}
                key={'invoice-date'}
                label={translation.invoicePage.invoice.expirationDate}
                value={dayjs(state.quote.formState.expirationDate)}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl fullWidth sx={{ maxWidth: { xs: 'none', md: '260px' } }}>
            <Autocomplete
              options={customers}
              getOptionLabel={option => option.name}
              onChange={(_, newValue) =>
                actions.quote.setQuoteCustomerId(
                  newValue && newValue.id ? newValue.id : '',
                )
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label={translation.customerPage.customer.name}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  onChange={(_, isChecked) => {
                    actions.quote.setUseTax(isChecked)
                  }}
                  checked={state.quote.useTax || false}
                />
              }
              label="Aplicar Impuesto"
            />
          </FormControl>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          sx={{
            '&  .MuiPaper-root': {
              minWidth: '0 !important',
            },
          }}>
          <Paper
            elevation={5}
            sx={{
              minHeight: '400px !important',
              height: { xs: 'fit-content', sm: 'auto' },
              borderRadius: '.7rem',
              p: '1rem',
              flexDirection: 'column',
              overflowX: 'auto',
            }}>
            <Typography
              textAlign={'left'}
              width={'100%'}
              mt={'1rem'}
              variant="h5">
              Ordenes
            </Typography>
            <Box width={'100%'}>
              <Box
                width={'inherit'}
                gap={'1rem'}
                sx={{
                  py: '2rem',
                  display: 'flex',
                  gap: '1rem',
                }}>
                <Autocomplete
                  fullWidth
                  key={productAutoComplete}
                  options={state.product.products}
                  getOptionLabel={option => option.name}
                  onChange={(_, newValue) => {
                    actions.quote.setOrderProductField(
                      newValue && newValue.id ? newValue.id : '',
                    )
                    actions.quote.setOrderProductPrice(
                      newValue ? newValue.price : 0,
                    )
                  }}
                  renderInput={params => (
                    <TextField
                      key={'select-product'}
                      {...params}
                      label={'Seleccione un Producto'}
                    />
                  )}
                />
                <FormControl fullWidth>
                  <TextField
                    size="medium"
                    type="number"
                    value={formOrder.quantity > 0 ? formOrder.quantity : ''}
                    label={'Cantidad'}
                    onChange={e => {
                      actions.quote.setOrderQuantityField(
                        Number.parseInt(e.target.value || '0.00'),
                      )
                    }}
                  />
                </FormControl>
                <Button
                  fullWidth
                  disabled={!formOrder.quantity || !formOrder.productId}
                  variant="contained"
                  sx={{
                    maxWidth: '260px',
                  }}
                  onClick={handleAddOrder}>
                  Agregar
                </Button>
              </Box>
            </Box>
            <OrderTable />
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: '1.25rem',
          gap: '1rem',
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          flexWrap: 'wrap',
          justifyContent: { sm: 'space-between' },
          width: '100%',
          pb: { xs: '2rem' },
        }}>
        <Box
          justifySelf={'start'}
          display={'flex'}
          justifyContent={'space-between'}
          gap={'.5rem'}>
          <Button
            disabled={state.quote.loadingQuotes}
            onClick={() => actions.quote.setCreateModal()}>
            {translation.buttonAction.cancel}
          </Button>
          <LoadingButton
            color="primary"
            onClick={handleSubmit}
            variant="contained"
            loading={state.quote.loadingQuotes}>
            {translation.buttonAction.create}
          </LoadingButton>
        </Box>
        <Box
          display={'flex'}
          flexWrap={'wrap'}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
          gap={'.5rem'}>
          <Box display={'flex'} gap={'.5rem'}>
            <ArrowForwardIosIcon fontSize="small" />
            <Typography variant="body2">
              {translation.invoicePage.invoice.date}:{' '}
              {new Date().toLocaleString()}
            </Typography>{' '}
          </Box>
          <Box display={'flex'} gap={'.5rem'}>
            <ArrowForwardIosIcon fontSize="small" />
            <Typography variant="body2">
              {translation.invoicePage.invoice.subtotal}:{' '}
              {USDollar.format(state.quote.formState.subtotal)}
            </Typography>{' '}
          </Box>
          <Box display={'flex'} gap={'.5rem'}>
            <ArrowForwardIosIcon fontSize="small" />
            <Typography variant="body2">
              {translation.quotePage.invoice.taxes}:{' '}
              {USDollar.format(state.quote.formState.tax)}
            </Typography>{' '}
          </Box>
          <Box display={'flex'} gap={'.5rem'}>
            <ArrowForwardIosIcon fontSize="small" />
            <Typography variant="body2">
              {translation.quotePage.invoice.amount}:{' '}
              {USDollar.format(state.quote.formState.total)}
            </Typography>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export const OrderTable = () => {
  const actions = store.useActions()
  const state = store.useState()
  const products = useMemo(() => state.product.products ?? [], [])
  const handleOrderDecrement = useCallback((index: number) => {
    actions.quote.handleOrderChangeDecrement(index)
  }, [])
  const handleOrderIncrement = useCallback(
    (index: number) => actions.quote.handleOrderChangeIncrement(index),
    [],
  )

  return state.quote.formState.orders.length !== 0 ? (
    <TableContainer sx={{ minHeight: '90%' }} component={'div'}>
      <Table aria-label="order table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre del Producto</TableCell>
            <TableCell align="right">Precio</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.quote.formState.orders.map((order, id) => (
            <TableRow
              key={order.productId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {products.filter(p => p.id === order.productId)[0].name}
              </TableCell>
              <TableCell align="right">
                {FormatCurrency({
                  value: order.productPrice,
                })}
              </TableCell>
              <TableCell sx={{ display: 'flex', gap: '.3rem' }} align="right">
                <Counter
                  numberValue={order.quantity}
                  onDecrement={() => handleOrderDecrement(id)}
                  onIncrement={() => handleOrderIncrement(id)}
                />
              </TableCell>
              <TableCell align="right">
                {FormatCurrency({
                  value: order.amount,
                })}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => actions.quote.removeQuoteOrder(id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      textAlign={'center'}
      alignItems={'center'}>
      <NoDataImage />
      <Typography variant="h6">No se han agregado ordenes</Typography>
    </Box>
  )
}
