import {
  Box,
  FormControlLabel,
  ListItemButton,
  ListItemText,
  Paper,
  Switch,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'
import AccountList from './account-summary'
import CreateAccount from './create-account'
import { store } from '@/utils'
import MaterialReactTable from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import useAccountOrCategoryDefaultName from '@/hooks/use-default-account-name'
import CategoryForm from './category-form'
import FormatCurrency from '../global/format-currency'

function AccountManager() {
  const state = store.useState()
  const actions = store.useActions()

  const columns = useMemo(
    () => [
      {
        accessorKey: 'category_name',
        header: 'Nombre de Categoría',
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
        Cell: ({ cell }: any) => (
          <Typography variant="caption" component={'p'}>
            {FormatCurrency({ value: Number.parseFloat(cell.getValue()) })}
          </Typography>
        ),
      },
    ],
    [],
  )

  const categories = useMemo(() => {
    if (Object.keys(state.accounting.selectedAccount.categories).length === 0) {
      return []
    }
    return Object.keys(state.accounting.selectedAccount.categories).map(key => {
      const category_name = useAccountOrCategoryDefaultName(key)
      return {
        category_name,
        ...state.accounting.selectedAccount.categories[key],
      }
    })
  }, [state.accounting.selectedAccount, state.accounting.accounts])

  return (
    <Box
      sx={{
        padding: '.5rem',
        display: 'grid',
        gap: '.5rem',
        gridTemplateColumns: { sm: '1fr', md: 'auto 1fr' },
        gridTemplateRows: {
          sm: '1fr',
          md: 'auto 1fr',
        },
      }}>
      <Paper
        sx={{ padding: '.5rem', gridColumn: { sm: 'span 1', md: 'span 2' } }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            placeContent: 'start',
            placeItems: 'start',
            width: 'fit-content',
            height: 'fit-content',
          }}>
          <ListItemButton
            sx={{ width: 'fit-content', borderRadius: '.5rem' }}
            onClick={() => actions.accounting.setCreateAccountFormOpen()}>
            <ListItemText>Agregar Cuenta</ListItemText>
          </ListItemButton>
          <ListItemButton
            onClick={() => actions.accounting.setCategoryFormDialogOpen()}
            sx={{ width: 'fit-content', borderRadius: '.5rem' }}>
            <ListItemText>Agregar Categoría</ListItemText>
          </ListItemButton>
        </Box>
      </Paper>
      <Paper
        className="one"
        elevation={3}
        sx={{
          width: '100%',
          padding: '1rem',
        }}>
        <AccountList />
      </Paper>
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={state.accounting.selectedAccount.visible}
              onChange={(e, value) =>
                actions.accounting.setAccountFormVisibility(value)
              }
              inputProps={{ 'aria-label': 'visibility switch' }}
            />
          }
          label="Mostrar a Empleados"
        />
        <MaterialReactTable
          enableSorting={false}
          enableColumnFilters={false}
          enableRowOrdering={false}
          enableDensityToggle={false}
          enableColumnFilterModes={false}
          state={{
            density: 'compact',
            isLoading: state.accounting.loadingFilteredTransactions,
            showProgressBars: state.accounting.loadingFilteredTransactions,
          }}
          columns={columns}
          data={categories ?? []}
          enableRowNumbers={true}
          enablePagination={false}
          localization={MRT_Localization_ES}
        />
      </Box>
      <CreateAccount />
      <CategoryForm />
    </Box>
  )
}

export default AccountManager
