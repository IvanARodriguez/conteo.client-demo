import { store } from '@/utils'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Dialog,
  TextField,
} from '@mui/material'
import React from 'react'

function CategoryForm() {
  const state = store.useState()
  const actions = store.useActions()
  const accounts = React.useMemo(
    () =>
      Object.keys(state.accounting.accounts).map(
        acc => state.accounting.accounts[acc],
      ),
    [state.accounting.accounts],
  )
  return (
    <Dialog
      onClose={() => actions.accounting.setCategoryFormDialogOpen()}
      open={state.accounting.accountCategoryForm.formDialogOpen}
      PaperProps={{ sx: { p: '1rem', width: '100%' } }}>
      <Box
        component={'form'}
        onSubmit={e => {
          e.preventDefault()
          actions.accounting.createCategory()
        }}
        sx={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <Autocomplete
          size="small"
          sx={{
            minWidth: '260px',
            gridColumn: { xs: 'span 1', sm: 'span 3' },
          }}
          id="accounts"
          options={accounts}
          getOptionLabel={opt => opt.accountName}
          onChange={(event, newSelection) => {
            actions.accounting.setCategoryFormAccountId(newSelection?.id ?? '')
          }}
          renderInput={params => (
            <TextField
              required
              {...params}
              label="Buscar por Cuentas"
              placeholder="Cuentas"
            />
          )}
        />
        <TextField
          size="small"
          label="Nombre de categoría o sub-cuenta"
          fullWidth
          value={state.accounting.accountCategoryForm.categoryName}
          required
          onChange={e => actions.accounting.setCategoryFormName(e.target.value)}
        />
        <LoadingButton
          loading={
            state.accounting.accountCategoryForm.submitState === 'loading'
          }
          type="submit">
          Crear
        </LoadingButton>
      </Box>
    </Dialog>
  )
}

export default CategoryForm
