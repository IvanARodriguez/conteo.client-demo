import MainView from '@/components/global/main-view'
import { useActions, useState } from '@/store'
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch'
import {
  Autocomplete,
  Box,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useLayoutEffect } from 'react'
import React from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import './report.css'
import NotFoundImg from '/not-found-data.svg'
import ReportTable from '@/components/report/report-table'
import { PieChart, Pie, Cell } from 'recharts'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import { useSpring, animated } from 'react-spring'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs from 'dayjs'
import { enqueueSnackbar } from 'notistack'
import AccountView from '@/components/accounting/account-view'
import { green } from '@mui/material/colors'
import { LoadingButton } from '@mui/lab'
import { useUTCDate } from '@/hooks/use-utc-date'
import AccountManager from '@/components/accounting/account-manager'
import { useNavigate } from 'react-router-dom'
import SalesmanEarnings from '@/components/accounting/salesman-earnings'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

type InvoiceStatusType = 'Facturas Pagadas' | 'Facturas Pendientes'
type SellData = {
  label: InvoiceStatusType
  value: number
}[]

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ flex: 1, width: '100%' }}
      {...other}>
      {value === index && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { sm: 'auto', md: '1fr' },
            width: '100%',
            gap: '1rem',
          }}>
          {children}
        </Box>
      )}
    </Box>
  )
}

function Report() {
  const actions = useActions()
  const state = useState()
  const [value, setValue] = React.useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleSubmitReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    actions.report.getGeneratedReport()
  }

  const customers = React.useMemo(
    () =>
      state.customer.customers.map(c => {
        return { label: c.name, id: c.id ?? '' }
      }),
    [state.customer.customers],
  )
  const products = React.useMemo(
    () =>
      state.product.products.map(p => {
        return { label: p.name, id: p.id ?? '' }
      }),
    [state.product.products],
  )

  const sendDateErrorNotification = () => {
    if (
      state.report.reportForm.startDate &&
      state.report.reportForm.endDate &&
      dayjs(state.report.reportForm.startDate) >
        dayjs(state.report.reportForm.endDate)
    ) {
      enqueueSnackbar('La fecha "hasta" debe ser mayor que la fecha "desde"', {
        variant: 'error',
        autoHideDuration: 5000,
      })
    }
  }

  const isInvalidaFormDate =
    dayjs(state.report.reportForm.startDate) >
    dayjs(state.report.reportForm.endDate)

  const setFilterDate = (
    date: dayjs.Dayjs | null,
    variant: 'fromDate' | 'toDate',
  ) => {
    if (!date) return
    sendDateErrorNotification()
    const utcDate = useUTCDate(date)
    if (variant === 'fromDate') {
      actions.report.setFromDate(utcDate)
      return
    }
    actions.report.setToDate(utcDate)
  }
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (state.profile.role === 'EMPLOYEE') {
      navigate('/')
      return
    }
    actions.application.setCurrentPage('report')
    actions.application.setMenuSection('accounting')
    if (state.customer.customers.length === 0) {
      actions.customer.getCustomers()
    }
    if (state.product.products.length === 0) {
      actions.product.getProducts()
    }
    actions.accounting.getAccountSummary()
    actions.accounting.getAccountsTransactions()
  }, [])

  return (
    <MainView>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example">
          <Tab label="Ventas" {...a11yProps(0)} />
          <Tab label="Detalle" {...a11yProps(1)} />
          <Tab label="Cuentas" {...a11yProps(2)} />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { sm: '1fr', md: 'auto 1fr' },
              padding: '1rem',
              gap: '1rem',
              width: '100%',
            }}>
            <Paper sx={{ gridColumn: 'span 2' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    sm: '1fr 1fr',
                    md: '1fr 1fr 1fr 1fr auto',
                  },
                  p: '.5rem',
                  justifyContent: 'center',
                  alignItems: 'end',
                  gap: '.5rem',
                }}
                component={'form'}
                onSubmit={handleSubmitReport}>
                <Autocomplete
                  fullWidth
                  onChange={(_, value) => {
                    actions.report.setReportSearchCustomer(
                      value ? value.id : '',
                    )
                  }}
                  clearOnEscape
                  options={customers}
                  loading={state.customer.loadingData}
                  renderInput={params => (
                    <TextField {...params} label="Cliente" />
                  )}
                />
                <Autocomplete
                  fullWidth
                  onChange={(_, value) => {
                    actions.report.setReportSearchProduct(value ? value.id : '')
                  }}
                  clearOnEscape
                  options={products}
                  loading={state.product.loadingProduct}
                  renderInput={params => (
                    <TextField {...params} label="Producto" />
                  )}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      key={'Desde-date'}
                      maxDate={dayjs()}
                      sx={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      onChange={e => setFilterDate(dayjs(e), 'fromDate')}
                      value={dayjs(state.report.reportForm.startDate)}
                      label="Desde"
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      key={'Hasta-Picker'}
                      sx={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      maxDate={dayjs()}
                      onChange={e => setFilterDate(e, 'toDate')}
                      value={dayjs(state.report.reportForm.endDate)}
                      label="Hasta"
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <LoadingButton
                  loading={false}
                  type="submit"
                  variant="contained"
                  sx={{ minHeight: '56px' }}
                  startIcon={<ContentPasteSearchIcon />}
                  disabled={isInvalidaFormDate}>
                  Buscar
                </LoadingButton>
              </Box>
              <SalesSummaryReport />
              <SalesmanEarnings />
            </Paper>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AccountView />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <AccountManager />
        </CustomTabPanel>
      </Box>
    </MainView>
  )
}

export default Report

const RADIAN = Math.PI / 180
const renderCustomizedLabel = (labelProps: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } =
    labelProps
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function CustomSellsChart(props: {
  data: SellData
  pendingPaidAmount: number
}) {
  const { data, pendingPaidAmount } = props
  const theme = useTheme()
  const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const paid = data.filter(d => d.label == 'Facturas Pagadas')
  const pending = data.filter(d => d.label === 'Facturas Pendientes')
  const paidAmountValue = pendingPaidAmount ?? 0.0

  return (
    <>
      {data[0].value === 0 && data[1].value === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            placeItems: 'center',
            placeContent: 'center',
            py: '2rem',
            gap: '1rem',
          }}>
          <DonutLargeIcon sx={{ fontSize: '7rem', opacity: '.3' }} />
          <Typography variant="h5">No Hay Datos</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            justifyContent: 'center',
            height: '100%'
          }}>
          <PieChart width={250} height={250}>
            <Pie
              data={[...data, { label: 'Abono', value: paidAmountValue }]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              dataKey="value">
              {[
                ...data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? theme.palette.primary.main
                        : theme.palette.error.main
                    }
                  />
                )),
                <Cell key={'cell-paid-amount'} fill={green[500]} />,
              ]}
            </Pie>
          </PieChart>

          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr 1fr',
                alignItems: 'center',
                gap: '1rem',
              }}>
              <Box
                width={15}
                height={15}
                borderRadius={'10rem'}
                sx={{
                  background: theme.palette.primary.main,
                  display: 'inline-block',
                }}
              />
              <Typography>
                {`${paid[0].label} `}
                {formatCurrency.format(paid.length > 0 ? paid[0].value : 0.0)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                alignItems: 'center',
                gap: '1rem',
              }}>
              <Box
                width={15}
                height={15}
                borderRadius={'10rem'}
                sx={{
                  background: theme.palette.error.main,
                  display: 'inline-block',
                }}
              />
              <Typography>
                Facturas Pendientes:{' '}
                {formatCurrency.format(
                  pending.length > 0 ? pending[0].value : 0.0,
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                alignItems: 'center',
                gap: '1rem',
              }}>
              <Box
                width={15}
                height={15}
                borderRadius={'10rem'}
                sx={{
                  background: theme.palette.secondary.main,
                  display: 'inline-block',
                }}
              />
              <Typography>
                Abonos: {formatCurrency.format(paidAmountValue)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

function SalesSummaryReport() {
  const actions = useActions()
  const state = useState()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const totalEarned = state.report.reports.reduce(
    (acc, curr) => acc + curr.total,
    0,
  )
  const springProps = useSpring({
    totalEarned,
    from: { totalEarned: 0 },
  })

  const totalPaid = state.report.paidAmount

  const sellData: SellData = [
    {
      label: 'Facturas Pagadas',
      value: state.report.reports
        .filter(r => r.status === 'Paid')
        .reduce(
          (accumulator, currentValue) => accumulator + currentValue.total,
          0,
        ),
    },
    {
      label: 'Facturas Pendientes',
      value:
        state.report.reports
          .filter(r => r.status === 'Pending')
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.total,
            0,
          ) - totalPaid,
    },
  ]
  return (
    <Box
      sx={{
        gridColumn: 'span 2',
        display: 'grid',
        height: '100%',
        gridTemplateColumns: { lg: 'auto 1fr' },
        gap: '1rem',
      }}>
      <Paper
        elevation={3}
        sx={{
          overflowY: 'auto',
          p: '1rem',
        }}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={'1rem'}
          sx={{
            minHeight: {
              overflowY: 'auto',
            },
          }}>
          <Box
            display={'flex'}
            gap={'1rem'}
            component={Paper}
            alignItems={'center'}
            py={'.5rem'}
            px={'1rem'}>
            <CurrencyExchangeIcon
              sx={{
                fontSize: '3rem',
                color: theme.palette.primary.main,
              }}
            />
            <Box>
              <Typography>Ganancia </Typography>
              <Typography variant="h3">
                <animated.div>
                  {springProps.totalEarned.to(
                    n =>
                      `$${Number(n).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                  )}
                </animated.div>
              </Typography>
            </Box>
          </Box>
          <Box display={'block'}>
            <Box>
              <CustomSellsChart data={sellData} pendingPaidAmount={totalPaid} />
            </Box>
          </Box>
        </Box>
      </Paper>
      {state.report.reports.length > 0 ? (
        <ReportTable />
      ) : (
        <Box component={Paper} elevation={3}>
          <Box
            sx={{
              display: 'grid',
              placeContent: 'center',
              placeItems: 'center',
              height: '100%',
              gap: '3rem',
              opacity: 0.4,
              padding: '1rem',
            }}>
            <Box
              component={'img'}
              sx={{ maxHeight: '200px' }}
              src={NotFoundImg}
            />
            <Typography variant="h5">No hay reporte que mostrar</Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
