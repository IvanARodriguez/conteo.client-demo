import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { useEffect } from 'react'
import { LoadingButton } from '@mui/lab'
import { store } from '../../utils'
import { dictionary } from '../../utils/dictionary'
import useLocalState from '@/hooks/use-local-state'

// example of creating a mui dialog modal for creating new rows
function CreateProductModal() {
  const state = store.useState()
  const [readErrorMessage, writeErrorMessage] = useLocalState(() => {
    return {
      formErrors: {} as Record<string, boolean>,
    }
  })
  const actions = store.useActions()
  const translation = dictionary[state.application.language]
  function onNameInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (!event.target.value) {
      writeErrorMessage.formErrors['name-error'] = true
    } else {
      writeErrorMessage.formErrors['name-error'] = false
    }
    actions.product.setFormField({
      value: event.target.value,
      fieldType: 'name',
    })
  }
  function onPriceInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (!event.target.value || Number.parseInt(event.target.value) === 0) {
      writeErrorMessage.formErrors['price-error'] = true
    } else {
      writeErrorMessage.formErrors['price-error'] = false
    }
    actions.product.setFormField({
      fieldType: 'price',
      value: Number.parseInt(event.target.value),
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await actions.product.createProduct()
  }
  useEffect(() => {
    actions.product.resetProductForm()
  }, [])

  return (
    <Dialog
      key={'create-product-modal'}
      open={state.product.modalIsOpen}
      onClose={() => {
        actions.product.resetProductForm()
        actions.product.setCreateModalOpen(false)
      }}>
      <DialogTitle textAlign="center">
        {translation.productPage.createDialogTitle}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack
            sx={{
              pt: '1.5rem',
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}>
            <TextField
              value={state.product.form.name ?? ''}
              onChange={onNameInputChange}
              key={'product Name'}
              label={translation.productPage.name}
              name="product name"
              error={readErrorMessage.formErrors['name-error']}
              helperText={
                readErrorMessage.formErrors['name-error']
                  ? 'Nombre no puede estar vació'
                  : ''
              }
            />
            <TextField
              key={'product price'}
              onChange={onPriceInputChange}
              label={translation.productPage.price}
              type="number"
              name="product price"
              error={readErrorMessage.formErrors['price-error']}
              helperText={
                readErrorMessage.formErrors['price-error']
                  ? 'Precio no puede estar vació o ser 0'
                  : ''
              }
            />
            <TextField
              onChange={e =>
                actions.product.setFormField({
                  value: e.target.value,
                  fieldType: 'details',
                })
              }
              key={'product description'}
              minRows={7}
              multiline
              label={translation.productPage.details}
              name="product details"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={state.product.form.inventory_managed}
                  onChange={(_, checked) =>
                    actions.product.setFormField({
                      value: checked,
                      fieldType: 'inventory_managed',
                    })
                  }
                  name="Incluir en inventario"
                />
              }
              label="Incluir en inventario"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={() => actions.product.setCreateModalOpen(false)}>
            {translation.buttonAction.cancel}
          </Button>
          <LoadingButton
            loading={state.application.isLoading}
            disabled={
              readErrorMessage.formErrors['price-error'] ||
              readErrorMessage.formErrors['name-error'] ||
              state.product.form.price === 0
            }
            color="primary"
            type="submit"
            variant="contained">
            {translation.buttonAction.create}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateProductModal
