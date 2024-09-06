import React, { useEffect, useLayoutEffect } from 'react'
import { store } from '@/utils'
import {
  Autocomplete,
  Box,
  Dialog,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import useAccountOrCategoryDefaultName from '@/hooks/use-default-account-name'
import { LoadingButton } from '@mui/lab'
import { grey } from '@mui/material/colors'

function CreateAccountTransaction() {
  const state = store.useState()
  const actions = store.useActions()
  const accounts = state.accounting.limitedAccounts
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await actions.accounting.createAccountTransaction()
    actions.accounting.resetTransactionCreationFields()
  }
  function handleClose() {
    actions.accounting.resetTransactionCreationFields()
    actions.accounting.setTransactionsFormOpen()
  }
  useLayoutEffect(() => {
    actions.accounting.getFullAccounts()
  }, [])
  return (
    <Dialog onClose={handleClose} open={state.accounting.formOpened}>
      <Paper
        component={'form'}
        onSubmit={handleSubmit}
        sx={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
        <Typography>Crear Transacción</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '.5rem',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}>
          <Autocomplete
            disabled={state.accounting.transactionForm.isAdjustment}
            size="small"
            value={state.accounting.transactionForm.creditAccount}
            freeSolo={false}
            options={accounts.filter(acc => acc.accountName !== 'Sales')}
            getOptionLabel={acct =>
              useAccountOrCategoryDefaultName(acct.accountName)
            }
            sx={{ maxWidth: 300 }}
            onChange={(e, value) => {
              actions.accounting.setAccountCategory({
                category: value
                  ? value.categories.length > 0
                    ? value.categories[0]
                    : { id: '', name: '' }
                  : { id: '', name: '' },
                variant: 'credit',
              })
              actions.accounting.setTransactionFormItem({
                formItem: 'creditAccount',
                value: value ?? {
                  accountId: '',
                  accountName: '',
                  categories: [],
                },
              })
            }}
            renderInput={params => (
              <TextField
                {...params}
                helperText="Cuenta desde donde se va a transferir"
                label="Desde - (Crédito)"
              />
            )}
          />
          <Autocomplete
            size="small"
            freeSolo={false}
            disabled={state.accounting.transactionForm.isAdjustment}
            value={state.accounting.transactionForm.creditAccountCategory}
            getOptionLabel={cat => useAccountOrCategoryDefaultName(cat.name)}
            options={state.accounting.transactionForm.creditAccount.categories}
            sx={{ width: 300 }}
            onChange={(e, value) =>
              actions.accounting.setAccountCategory({
                category: value,
                variant: 'credit',
              })
            }
            renderInput={params => (
              <TextField {...params} label="Categoría - (Crédito)" />
            )}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '.5rem',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}>
          <Autocomplete
            size="small"
            onChange={(_, value) => {
              actions.accounting.setAccountCategory({
                category: value
                  ? value.categories.length > 0
                    ? value.categories[0]
                    : { id: '', name: '' }
                  : { id: '', name: '' },
                variant: 'debit',
              })
              actions.accounting.setTransactionFormItem({
                formItem: 'debitAccount',
                value: value ?? {
                  accountName: '',
                  accountId: '',
                  categories: [],
                },
              })
            }}
            freeSolo={false}
            value={state.accounting.transactionForm.debitAccount}
            options={accounts.filter(acc => acc.accountName !== 'Sales')}
            getOptionLabel={option =>
              useAccountOrCategoryDefaultName(option.accountName)
            }
            sx={{ width: 300 }}
            renderInput={params => (
              <TextField
                {...params}
                helperText="Cuenta donde se va a transferir el monto"
                label="Destino - (Débito)"
              />
            )}
          />
          <Autocomplete
            size="small"
            id="debit-accounts-category"
            freeSolo={false}
            value={state.accounting.transactionForm.debitAccountCategory}
            getOptionLabel={cat => useAccountOrCategoryDefaultName(cat.name)}
            options={state.accounting.transactionForm.debitAccount.categories}
            sx={{ width: 300 }}
            onChange={(e, value) =>
              actions.accounting.setAccountCategory({
                category: value ?? { name: '', id: '' },
                variant: 'debit',
              })
            }
            renderInput={params => (
              <TextField {...params} label="Categoría - (Débito)" />
            )}
          />
        </Box>

        <TextField
          size="small"
          value={state.accounting.transactionForm.amount}
          onChange={event =>
            actions.accounting.setTransactionFormItem({
              formItem: 'amount',
              value: Number.parseFloat(event.target.value || '0'),
            })
          }
          label="Monto"
          type="number"
          inputProps={{ step: '1.0' }}
        />
        <TextField
          size="small"
          value={state.accounting.transactionForm.confirmation}
          onChange={event =>
            actions.accounting.setTransactionFormItem({
              formItem: 'confirmation',
              value: event.target.value ?? '',
            })
          }
          label="Escriba Confirmar"
        />
        <TextField
          id="outlined-multiline-flexible"
          value={state.accounting.transactionForm.description}
          label="Descripción"
          onChange={event =>
            actions.accounting.setTransactionFormItem({
              formItem: 'description',
              value: event.target.value ?? '',
            })
          }
          multiline
          minRows={4}
        />
        <Box
          sx={{
            position: 'relative',
          }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  onChange={event =>
                    actions.accounting.setTransactionFormItem({
                      formItem: 'isAdjustment',
                      value: event.target.checked,
                    })
                  }
                  checked={state.accounting.transactionForm.isAdjustment}
                />
              }
              label="Marcar como ajuste"
            />
          </FormGroup>
        </Box>
        <LoadingButton
          loading={state.accounting.transactionForm.IOState === 'submitting'}
          type="submit"
          variant="contained"
          disabled={
            state.accounting.transactionForm.confirmation !== 'Confirmar'
          }>
          Agregar
        </LoadingButton>
      </Paper>
    </Dialog>
  )
}

export default CreateAccountTransaction
