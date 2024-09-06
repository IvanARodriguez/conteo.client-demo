import { useCallback, useEffect, useMemo, useState } from 'react'
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTableProps,
} from 'material-react-table'

import { Edit, Delete } from '@mui/icons-material'
import {
  Box,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Paper,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { dictionary } from '../../utils/dictionary'
import { Customer } from '../../types'
import * as store from '../../store'
import CreateCustomerModal from './create-customer-modal'
import ConfirmationDialog from '../global/confirmation-dialog'
import { getRowCount } from '@/utils'
import useComponentSize from '@/hooks/use-component-size'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import CustomerDeactivationModal from './activation-moda'
import CustomerTaxInput from './customer-tax-input'

function CustomerTable() {
  const state = store.useState()
  const actions = store.useActions()
  const { height, ref } = useComponentSize()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, //customize the default page size
  })
  const customers = useMemo(
    () => state.customer.customers,
    [state.customer.customers],
  )
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({})
  const translations = dictionary[state.application.language ?? 'es']

  const handleSaveRowEdits: MaterialReactTableProps<Customer>['onEditingRowSave'] =
    async ({ exitEditingMode }) => {
      if (!Object.keys(validationErrors).length) {
        await actions.customer.updateCustomer()
        exitEditingMode()
      }
    }

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Customer>,
    ): MRT_ColumnDef<Customer>['muiTableBodyCellEditTextFieldProps'] => ({
      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
      onChange: event => {
        if (cell.column.id === 'email') {
          actions.customer.setCustomerProp({
            option: 'email',
            value: event.target.value,
          })
        }
        const isValid =
          cell.column.id === 'rnc'
            ? validateRNC(Number.parseInt(event.target.value))
            : cell.column.id === 'name'
            ? validateRequired(event.target.value)
            : cell.column.id === 'address'
            ? validateRequired(event.target.value)
            : true

        if (!isValid) {
          setValidationErrors({
            ...validationErrors,
            [cell.id]: `${cell.column.columnDef.header} es invalido`,
          })
        } else {
          // remove validation error for cell if valid
          delete validationErrors[cell.id]
          setValidationErrors({
            ...validationErrors,
          })
        }
        if (cell.column.id === 'name')
          actions.customer.setCustomerProp({
            option: 'name',
            value: event.target.value,
          })
        if (cell.column.id === 'address')
          actions.customer.setCustomerProp({
            option: 'address',
            value: event.target.value,
          })

        if (cell.column.id === 'phone')
          actions.customer.setCustomerProp({
            option: 'phone',
            value: event.target.value,
          })

        if (cell.column.id === 'rnc')
          actions.customer.setCustomerProp({
            option: 'rnc',
            value: Number.parseInt(event.target.value),
          })
      },
    }),
    [validationErrors],
  )

  const getCommonViewProps = useCallback(
    (
      cell: MRT_Cell<Customer>,
    ): MRT_ColumnDef<Customer>['muiTableBodyCellEditTextFieldProps'] => ({
      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
    }),
    [setValidationErrors],
  )

  const formatRnc = useCallback((rnc: string): string => {
    const cleanInput = rnc.replace(/\D/g, '')
    if (cleanInput.length < 9) {
      return 'RNC invalido'
    }
    const formattedInput = `${cleanInput.slice(0, 3)}-${cleanInput.slice(
      3,
      7,
    )}-${cleanInput.slice(7, 8)}`
    return formattedInput
  }, [])
  const formatPhoneNumber = useCallback((rnc: string): string => {
    const cleanInput = rnc.replace(/\D/g, '').replace('-', '')
    if (cleanInput.length < 9) {
      return 'Teléfono invalido'
    }
    const formattedInput = `${cleanInput.slice(0, 3)}-${cleanInput.slice(
      3,
      6,
    )}-${cleanInput.slice(6, 10)}`
    return formattedInput
  }, [])
  const columns: MRT_ColumnDef<Customer>[] = useMemo<MRT_ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 30,
      },
      {
        accessorKey: 'name',
        header: translations.customerPage.customer.name,

        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          error: validationErrors[cell.column.id] !== undefined,
          helperText: validationErrors[cell.column.id],
          ...getCommonEditTextFieldProps(cell),
          ...getCommonViewProps(cell),
        }),
      },
      {
        accessorKey: 'tax_type',
        header: 'Tipo de Comprobante',
        Cell: ({ cell }) => <Box>{cell.getValue<string>() ?? '--'}</Box>,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          ...getCommonViewProps(cell),
        }),
        Edit: () => <CustomerTaxInput />,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 300,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          ...getCommonViewProps(cell),
        }),
      },
      {
        accessorKey: 'address',
        size: 300,
        header: translations.customerPage.customer.address,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'phone',
        header: translations.customerPage.customer.phone ?? 'Teléfono',
        Cell: ({ cell }) => (
          <Box>{formatPhoneNumber(cell.getValue<string>())}</Box>
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'rnc',
        header: translations.customerPage.customer.rnc,
        Cell: ({ cell }) => (
          <Paper
            elevation={5}
            sx={{ py: '.3rem', width: 'fit-content', px: '1rem' }}>
            {formatRnc(cell.getValue<number>().toString())}
          </Paper>
        ),
        Edit: table => (
          <TextField
            error={!!validationErrors[table.cell.id]}
            helperText={validationErrors[table.cell.id]}
            onChange={e => {
              const isValid = validateRNC(Number.parseFloat(e.target.value))
              !isValid
                ? setValidationErrors({
                    [table.cell
                      .id]: `${table.cell.column.columnDef.header} es requerido y debe ser numero`,
                  })
                : delete validationErrors[table.cell.id]
              actions.customer.setCustomerProp({
                option: 'rnc',
                value: Number.parseFloat(e.target.value),
              })
            }}
            type="number"
            label={translations.customerPage.customer.rnc}
            defaultValue={state.customer.customerForm.rnc || 0}
          />
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps],
  )
  function handleDeleteRow(row: MRT_Row<Customer>) {
    actions.customer.setCustomerProp({
      option: 'id',
      value: row.getValue('id'),
    })
    actions.application.setConfirmationModal()
  }
  function changeActivation(row: MRT_Row<Customer>) {
    actions.customer.setCustomerProp({
      option: 'id',
      value: row.getValue('id'),
    })
    actions.customer.setActivationModal()
  }
  useEffect(() => {
    const newHight = getRowCount(height, 72)

    setPagination({
      pageIndex: 0,
      pageSize: newHight,
    })
  }, [height])

  return (
    <Box
      display={'flex'}
      overflow={'auto'}
      height={'100%'}
      width={'100%'}
      flex={1}>
      <MaterialReactTable
        state={{
          isLoading: state.customer.loadingData,
          pagination,
        }}
        initialState={{
          columnVisibility: { id: false },
          showGlobalFilter: true,
        }}
        onPaginationChange={state => setPagination(state)}
        localization={MRT_Localization_ES}
        columns={columns}
        data={customers ?? []}
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        muiTablePaperProps={{
          sx: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            width: '100%',
          },
        }}
        muiTableContainerProps={{
          sx: {
            flex: 1,
          },
          ref,
        }}
        renderRowActions={({ row, table }) => (
          <Box
            sx={{
              display: state.customer.loadingData ? 'none' : 'flex',
              gap: '1rem',
            }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={() => {
                  actions.customer.setCustomerProp({
                    option: 'id',
                    value: row.getValue('id'),
                  })
                  actions.customer.setCustomerProp({
                    option: 'name',
                    value: row.getValue('name'),
                  })
                  actions.customer.setCustomerProp({
                    option: 'address',
                    value: row.getValue('address'),
                  })
                  actions.customer.setCustomerProp({
                    option: 'tax',
                    value: row.getValue('tax_type'),
                  })
                  actions.customer.setCustomerProp({
                    option: 'email',
                    value: row.getValue('email'),
                  })
                  actions.customer.setCustomerProp({
                    option: 'rnc',
                    value: Number.parseInt(row.getValue('rnc') as string),
                  })
                  actions.customer.setCustomerProp({
                    option: 'phone',
                    value: row.getValue('phone'),
                  })
                  table.setEditingRow(row)
                }}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Desactivar">
              <IconButton onClick={() => changeActivation(row)}>
                <PersonRemoveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '100rem',
              p: 0,
            }}
            color="primary"
            onClick={() => actions.customer.setCreateModal()}
            variant="text">
            {translations.buttonAction.create}
          </Button>
        )}
      />
      <CreateCustomerModal />

      <ConfirmationDialog
        key={'customer-delete-dialog'}
        open={state.application.confirmationOpen}
        question="Seguro que quiere ELIMINAR cliente?"
        advice="Esta acción no es reversible"
        type="delete"
        handleConfirm={() => actions.customer.deleteCustomer()}
      />
    </Box>
  )
}

export default CustomerTable

const validateRequired = (value: string) => !!value.length
const validateRNC = (value: any) =>
  typeof value !== 'number' ||
  value.toString().length > 9 ||
  value.toString().length < 9
    ? false
    : true

export const CustomerView = () => {
  const actions = store.useActions()
  const state = store.useState()
  const translation = dictionary[state.application.language]
  const customer = state.customer.customerForm
  const page = translation.customerPage
  return (
    <Dialog key={'Customer View Dialog'} open={state.customer.viewOpen}>
      <DialogTitle fontSize={'3rem'} textAlign="start">
        {page.title}
      </DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            gap: '1.5rem',
          }}>
          <Box>
            <Typography variant="h6" color={grey[600]}>
              {page.customer.name}
            </Typography>
            <Paper elevation={6} sx={{ p: '1rem 1rem', mt: '.5rem' }}>
              <Typography variant="h5">{customer.name}</Typography>
            </Paper>
          </Box>
          <Box>
            <Typography variant="h6" color={grey[600]}>
              {page.customer.address}
            </Typography>
            <Paper elevation={6} sx={{ p: '1rem 1rem', mt: '.5rem' }}>
              <Typography variant="h5">{customer.address}</Typography>
            </Paper>
          </Box>
          <Box>
            <Typography variant="h6" color={grey[600]}>
              {page.customer.phone}
            </Typography>
            <Paper elevation={6} sx={{ p: '1rem 1rem', mt: '.5rem' }}>
              <Typography variant="h5">{customer.phone}</Typography>
            </Paper>
          </Box>
          <Box>
            <Typography variant="h6" color={grey[600]}>
              {page.customer.rnc}
            </Typography>
            <Paper elevation={6} sx={{ p: '1rem 1rem', mt: '.5rem' }}>
              <Typography variant="h5">{customer.rnc}</Typography>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button
          variant="contained"
          onClick={() => {
            actions.customer.setViewModal()
          }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
