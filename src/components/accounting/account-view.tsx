import { store } from '@/utils'
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useLayoutEffect } from 'react'
import React from 'react'
import CreateAccount from './create-account'
import Wallet from '@mui/icons-material/AccountBalanceWallet'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs from 'dayjs'
import SearchIcon from '@mui/icons-material/Search'
import FilterTable from './filter-table'
import CreateAccountTransaction from './create-account-transaction'
import AccountSummary from './account-summary'
import { useUTCDate } from '@/hooks/use-utc-date'
import { LoadingButton } from '@mui/lab'

function AccountView() {
  const state = store.useState()
  const actions = store.useActions()

  const accounts = React.useMemo(
    () =>
      Object.keys(state.accounting.accounts).map(
        acc => state.accounting.accounts[acc],
      ),
    [state.accounting.accounts],
  )

  if (state.accounting.summaryLoadingState === 'loading') {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto',
        padding: '1rem',
        gap: '1rem',
        width: '100%',
      }}>
      <Paper
        className="two"
        sx={{ width: '100%', overflowX: 'auto' }}
        elevation={2}>
        <Paper
          sx={{
            display: 'grid',
            justifyContent: 'stretch',
            gridTemplateColumns: { sm: '1fr 1fr 1fr', xs: 'auto' },
            alignItems: 'stretch',
            gridGap: '.5rem',
            padding: '.5rem',
          }}>
          <Autocomplete
            size="small"
            sx={{
              minWidth: '260px',
              gridColumn: { xs: 'span 1', sm: 'span 3' },
            }}
            multiple
            id="accounts"
            options={accounts}
            getOptionLabel={opt => opt.accountName}
            onChange={(event, newSelection) => {
              actions.accounting.setFilterFormAccounts(
                newSelection.map(acct => acct.id),
              )
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Buscar por Cuentas"
                placeholder="Cuentas"
              />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                key={'Desde-date'}
                maxDate={dayjs()}
                sx={{ width: '100%' }}
                format="DD/MM/YYYY"
                onChange={date =>
                  actions.accounting.setFromDate(dayjs(date).format())
                }
                label="Desde"
                value={dayjs(state.accounting.filterTransactionForm.fromDate)}
              />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                key={'hasta-date'}
                maxDate={dayjs()}
                sx={{ width: '100%' }}
                format="DD/MM/YYYY"
                onChange={date =>
                  actions.accounting.setToDate(dayjs(date).format())
                }
                label="Hasta"
                value={dayjs(state.accounting.filterTransactionForm.toDate)}
              />
            </DemoContainer>
          </LocalizationProvider>
          <LoadingButton
            loading={state.accounting.loadingFilteredTransactions}
            variant="text"
            endIcon={<SearchIcon />}
            size="small"
            onClick={e => actions.accounting.getAccountsTransactions()}>
            Ver Reporte
          </LoadingButton>
        </Paper>
        <Paper
          sx={{
            flex: 1,
            maxHeight: '650px',
          }}>
          <FilterTable />
        </Paper>
      </Paper>
    </Box>
  )
}

export default AccountView
