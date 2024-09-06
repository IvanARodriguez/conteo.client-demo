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
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { amber } from '@mui/material/colors'

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

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export const CreateInvoiceModal = () => {
  const state = store.useState()

  const [productAutoComplete, setProductAutoComplete] = useState('product')

  const actions = store.useActions()

  const translation = useTranslation()

  const customers = useMemo(
    () => state.customer.customers,
    [state.customer.customers],
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await actions.invoice.createInvoice()
    actions.invoice.reloadInvoices()
  }

  function handleAddOrder() {
    actions.invoice.setInvoiceOrder()
    actions.invoice.setOrderProductPrice(0)
    setProductAutoComplete(
      `${productAutoComplete}${Math.floor(Math.random() * 10)}`,
    )
  }

  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const handleChange = (event: SelectChangeEvent) => {
    actions.invoice.setInvoiceFormStatus(event.target.value as InvoiceStatus)
  }
  const handleTransAllocationChange = (event: SelectChangeEvent) => {
    actions.invoice.setPaymentDestiny(event.target.value as 'Bank' | 'Cashier')
  }

  const formOrder = state.invoice.orderForm

  function setCreatedAtDate(
    date: dayjs.Dayjs | null,
    type: 'expiration' | 'creation',
  ) {
    const utcDate = dayjs(date).utc(true).format()
    if (type === 'creation') return actions.invoice.setInvoiceCreatedAt(utcDate)
    actions.invoice.setInvoiceExpirationDate(utcDate)
  }

  useEffect(() => {
    actions.product.getProducts()
    actions.customer.getCustomers()
    actions.vendor.getActiveVendors()
  }, [])

  function handleClose() {
    actions.invoice.setCreateModal()
  }

  return (
    <Dialog
      onClose={handleClose}
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
      open={state.invoice.createViewOpen}>
      <DialogTitle variant="h4" textAlign="left">
        {translation.invoicePage.title}
      </DialogTitle>
      <Box
        sx={{
          width: '100%',
          py: 0,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '2rem',
        }}
        component={'form'}
        onSubmit={handleSubmit}>
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
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr',
              },
              mt: '1rem',
              gap: '1rem',
            }}>
            <FormControl
              fullWidth
              sx={{
                mt: '0',
                height: '100% !important',
              }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={e => setCreatedAtDate(e, 'expiration')}
                  key={'invoice-date'}
                  label={translation.invoicePage.invoice.expirationDate}
                  value={dayjs(state.invoice.formState.expirationDate)}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth>
              <Autocomplete
                options={customers}
                getOptionLabel={option => option.name}
                onChange={(_, newValue) =>
                  actions.invoice.setInvoiceCustomerId(
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
            <FormControl fullWidth>
              <Autocomplete
                options={state.vendor.activeVendors}
                getOptionLabel={option => option.vendor_name}
                onChange={(_, newValue) =>
                  actions.invoice.setInvoiceVendorId(
                    newValue ? newValue.id : '',
                  )
                }
                renderInput={params => (
                  <TextField {...params} label={'Vendedor'} />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="payment-status-label">
                {translation.invoicePage.invoice.status}
              </InputLabel>
              <Select
                fullWidth
                labelId="payment-status-label"
                id="payment-status"
                defaultValue={'Paid'}
                label={translation.invoicePage.invoice.status}
                onChange={handleChange}>
                <MenuItem value={'Paid'}>Saldado</MenuItem>
                <MenuItem value={'Pending'}>Pendiente</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              sx={{
                mt: '0',
                height: '100% !important',
              }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={e => setCreatedAtDate(e, 'creation')}
                  value={dayjs(state.invoice.formState.createdAt)}
                  label={translation.invoicePage.invoice.creationDate}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="payment-destiny-label">
                Destino de transacción
              </InputLabel>
              <Select
                size="medium"
                labelId="payment-destiny-label"
                id="transaction-allocation"
                error={
                  state.invoice.formState.status === 'Paid' &&
                  !state.invoice.formState.transactionLocation
                }
                disabled={state.invoice.formState.status !== 'Paid'}
                defaultValue={state.invoice.formState.transactionLocation}
                label="Destino de transacción"
                onChange={handleTransAllocationChange}>
                <MenuItem value={'Bank'}>Banco</MenuItem>
                <MenuItem value={'Cashier'}>Caja</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {state.customer.customers
            .filter(c => c.id === state.invoice.formState.customerId)
            .map((c, index) =>
              c.tax_type ? (
                <Typography
                  color={amber[500]}
                  sx={{ opacity: 0.5 }}
                  key={
                    c.id ?? '' + index
                  }>{`Este cliente utiliza comprobante fiscal ${c.tax_type}, impuestos serán aplicados al total de la factura`}</Typography>
              ) : (
                <></>
              ),
            )}
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
                    size="small"
                    fullWidth
                    key={productAutoComplete}
                    options={state.product.products.filter(
                      product => !product.disabled,
                    )} // Filtrar productos no deshabilitados
                    getOptionLabel={option => option.name}
                    onChange={(_, newValue) => {
                      actions.invoice.setOrderProductField(
                        newValue && newValue.id ? newValue.id : '',
                      )
                      actions.invoice.setOrderProductPrice(
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
                      size="small"
                      type="number"
                      value={formOrder.productPrice}
                      label={'Precio'}
                      onChange={e => {
                        actions.invoice.setOrderProductPrice(
                          Number.parseInt(e.target.value ?? '0.00'),
                        )
                      }}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      type="number"
                      value={formOrder.quantity}
                      label={'Cantidad'}
                      onChange={e => {
                        actions.invoice.setOrderQuantityField(
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
              disabled={state.invoice.loadingInvoices}
              onClick={() => actions.invoice.setCreateModal()}>
              {translation.buttonAction.cancel}
            </Button>
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              loading={state.invoice.loadingInvoices}>
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
              </Typography>
            </Box>
            <Box display={'flex'} gap={'.5rem'}>
              <ArrowForwardIosIcon fontSize="small" />
              <Typography variant="body2">
                {translation.invoicePage.invoice.subtotal}:{' '}
                {USDollar.format(state.invoice.formState.subtotal)}
              </Typography>{' '}
            </Box>
            <Box display={'flex'} gap={'.5rem'}>
              <ArrowForwardIosIcon fontSize="small" />
              <Typography variant="body2">
                {translation.invoicePage.invoice.taxes}:{' '}
                {USDollar.format(state.invoice.formState.tax)}
              </Typography>{' '}
            </Box>
            <Box display={'flex'} gap={'.5rem'}>
              <ArrowForwardIosIcon fontSize="small" />
              <Typography variant="body2">
                {translation.invoicePage.invoice.amount}:{' '}
                {USDollar.format(state.invoice.formState.total)}
              </Typography>
            </Box>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export const OrderTable = () => {
  const actions = store.useActions()
  const state = store.useState()
  const products = useMemo(() => state.product.products ?? [], [])

  const handleOrderDecrement = useCallback(
    (orderIndex: number, price: number) => {
      actions.invoice.handleOrderChangeDecrement({ orderIndex, price })
    },
    [],
  )

  const handleOrderIncrement = useCallback(
    (orderIndex: number, price: number) =>
      actions.invoice.handleOrderChangeIncrement({ orderIndex, price }),
    [],
  )

  return state.invoice.formState.orders.length !== 0 ? (
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
          {state.invoice.formState.orders.map((order, id) => (
            <TableRow
              key={order.productId + id}
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
                  onDecrement={() =>
                    handleOrderDecrement(id, order.productPrice)
                  }
                  onIncrement={() =>
                    handleOrderIncrement(id, order.productPrice)
                  }
                />
              </TableCell>
              <TableCell align="right">
                {FormatCurrency({
                  value: order.amount,
                })}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => actions.invoice.removeInvoiceOrder(id)}>
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
