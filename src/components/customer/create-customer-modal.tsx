import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  Button,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { store } from '../../utils'
import { dictionary } from '../../utils/dictionary'
import useLocalState from '@/hooks/use-local-state'
import CustomerTaxInput from './customer-tax-input'

// example of creating a mui dialog modal for creating new rows
const CreateCustomerModal = () => {
  const state = store.useState()
  const actions = store.useActions()

  const [errors, setErrors] = useState({})

  const translation = dictionary[state.application.language]
  async function handleSubmit() {
    await actions.customer.createCustomer()
  }
  const [readErrorMessage, writeErrorMessage] = useLocalState(() => {
    return {
      formErrors: {} as Record<string, boolean>,
    }
  })

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    actions.customer.setCustomerProp({ option: 'email', value })
  }

  function onNameInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (!e.target.value) {
      writeErrorMessage.formErrors['name-error'] = true
    } else {
      writeErrorMessage.formErrors['name-error'] = false
    }
    actions.customer.setCustomerProp({
      option: 'name',
      value: e.target.value,
    })
  }
  function onAddressInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    actions.customer.setCustomerProp({
      option: 'address',
      value: e.target.value,
    })
  }
  function onRNCInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    actions.customer.setCustomerProp({
      option: 'rnc',
      value: Number.parseInt(e.target.value),
    })
  }

  useEffect(() => {
    actions.customer.setCustomerProp({ option: 'address', value: '' })
    actions.customer.setCustomerProp({ option: 'id', value: '' })
    actions.customer.setCustomerProp({ option: 'name', value: '' })
    actions.customer.setCustomerProp({ option: 'phone', value: '' })
    actions.customer.setCustomerProp({ option: 'rnc', value: '' })
    actions.customer.setCustomerProp({ option: 'tax', value: null })
    actions.customer.setCustomerProp({ option: 'email', value: null })
  }, [])

  return (
    <Dialog key={'create-product-modal'} open={state.customer.createModalState}>
      <DialogTitle textAlign="center">
        {translation.customerPage.createDialogTitle}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={e => e.preventDefault()}>
          <Stack
            sx={{
              pt: '1.5rem',
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}>
            <TextField
              key={'customer name'}
              id="customer name"
              onChange={onNameInputChange}
              value={state.customer.customerForm.name ?? null}
              label={translation.customerPage.customer.name}
              name="customer name"
              error={readErrorMessage.formErrors['name-error']}
              helperText={
                readErrorMessage.formErrors['name-error']
                  ? 'Nombre no puede estar vació'
                  : ''
              }
            />
            <TextField
              key={'customer address'}
              value={state.customer.customerForm.address ?? null}
              onChange={onAddressInputChange}
              label={translation.customerPage.customer.address}
              name="customer address"
            />
            <TextField
              value={state.customer.customerForm.rnc}
              key={'customer rnc'}
              onChange={onRNCInputChange}
              error={state.customer.customerForm.rnc.toString().length > 9}
              helperText={
                state.customer.customerForm.rnc.toString().length > 9
                  ? 'RNC no puede contener mas de 9 caracteres'
                  : ''
              }
              type="number"
              label={translation.customerPage.customer.rnc}
              name="customer RNC"
            />
            <TextField
              value={state.customer.customerForm.phone || ''}
              key={'customer phone'}
              onChange={e =>
                actions.customer.setCustomerProp({
                  option: 'phone',
                  value: e.target.value,
                })
              }
              label={translation.customerPage.customer.phone}
              name="customer phone"
            />
            <TextField
              placeholder="Eg. recipient@email.com"
              value={state.customer.customerForm.email}
              onChange={handleEmailChange}
              fullWidth
            />

            <CustomerTaxInput />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={() => actions.customer.setCreateModal()}>
          {translation.buttonAction.cancel}
        </Button>
        <LoadingButton
          loading={state.application.isLoading}
          disabled={!state.customer.customerForm.name}
          color="primary"
          onClick={handleSubmit}
          variant="contained">
          {translation.buttonAction.create}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default CreateCustomerModal
