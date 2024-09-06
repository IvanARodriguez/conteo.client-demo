import {
  Box,
  Paper,
  styled,
  Typography,
  ListItem,
  List,
  IconButton,
} from '@mui/material'
import React, { useEffect } from 'react'
import { store } from '@/utils'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs from 'dayjs'
import AccountingTransactionTable from './accounting-transactions-table'
import { LoadingButton } from '@mui/lab'
import CreateAccountTransaction from './create-account-transaction'
import AddIcon from '@mui/icons-material/Add'

function TransactionView() {
  const actions = store.useActions()
  const state = store.useState()
  useEffect(() => {
    actions.accounting.getFilteredTransactions()
  }, [])
  return (
    <Container
      sx={{
        gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
        height: '100%',
      }}>
      <Paper className={'left-container'}>
        <TransactionFilterForm />
      </Paper>
      <Paper sx={{ overflow: 'auto' }}>
        {Object.keys(state.accounting.filteredTransactions).length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              placeContent: 'center',
              height: '100%',
              textAlign: 'center',
              gap: '2rem',
              opacity: 0.3,
              width: '100%',
            }}>
            <Box
              component={'img'}
              src={'/no-transaction.svg'}
              alt="delivery driver"
              sx={{ width: { xs: '250px', sm: '180' }, margin: '0 auto' }}
            />
            <Typography variant="h6">
              No hay transacciones que mostrar
            </Typography>
          </Box>
        ) : (
          <AccountingTransactionTable />
        )}
      </Paper>
    </Container>
  )
}

const Container = styled(Box)`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem;
  padding: 0.5rem;
  .left-container {
    padding: 0.5rem;
    min-width: 200px;
  }
`

export default TransactionView

export function TransactionFilterForm() {
  const actions = store.useActions()
  const state = store.useState()
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await actions.accounting.getFilteredTransactions()
  }
  return (
    <Box
      component={'form'}
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <List>
        <IconButton onClick={_ => actions.accounting.setTransactionsFormOpen()}>
          <AddIcon />
        </IconButton>
        <ListItem>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                key={'Desde-date'}
                maxDate={dayjs()}
                sx={{ width: '100%' }}
                format="DD/MM/YYYY"
                onChange={e =>
                  actions.accounting.setFromDate(dayjs(e).format())
                }
                value={dayjs(state.accounting.filterTransactionForm.fromDate)}
                label="Desde"
              />
            </DemoContainer>
          </LocalizationProvider>
        </ListItem>
        <ListItem>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                key={'Hasta Picker'}
                sx={{ width: '100%' }}
                format="DD/MM/YYYY"
                maxDate={dayjs()}
                onChange={e => actions.accounting.setToDate(dayjs(e).format())}
                value={dayjs(state.accounting.filterTransactionForm.toDate)}
                label="Hasta"
              />
            </DemoContainer>
          </LocalizationProvider>
        </ListItem>
        <ListItem>
          <LoadingButton
            fullWidth
            itemType=""
            loading={state.accounting.loadingFilteredTransactions}
            variant="contained"
            type="submit">
            SOMETER
          </LoadingButton>
        </ListItem>

        <CreateAccountTransaction />
      </List>
    </Box>
  )
}
