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
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material'
import * as store from '../../store'
import { dictionary } from '../../utils/dictionary'
import { Product } from '../../types'
import CreateProductModal from './create-product-modal'
import ConfirmationDialog from '../global/confirmation-dialog'
import FormatCurrency from '../global/format-currency'
import useComponentSize from '@/hooks/use-component-size'
import { getRowCount } from '@/utils'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import AddBoxIcon from '@mui/icons-material/AddBox'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ViewProduct from './view-produt-modal'

function ProductTable() {
  const state = store.useState()
  const actions = store.useActions()
  const { height, ref } = useComponentSize()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const products = useMemo(
    () => state.product.products,
    [state.product.products],
  )

  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({})

  const translations = dictionary[state.application.language ?? 'es']

  const handleSaveRowEdits: MaterialReactTableProps<Product>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(state.product.validationErrors).length) {
        actions.product.setFormField({ value: values.id, fieldType: 'id' })
        actions.product.setFormField({ value: values.name, fieldType: 'name' })
        await actions.product.updateProduct()
        exitEditingMode()
      }
    }

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Product>,
    ): MRT_ColumnDef<Product>['muiTableBodyCellEditTextFieldProps'] => ({
      disabled: cell.column.id === 'disabled' && state.profile.role !== 'ADMIN',

      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
      onBlur: event => {
        const isValid =
          cell.column.id === 'name'
            ? validateRequired(event.target.value)
            : cell.column.id === 'price'
              ? validateNumber(event.target.value)
              : validateRequired(event.target.value)
        if (!isValid) {
          setValidationErrors({
            ...validationErrors,
            [cell.id]: `${cell.column.columnDef.header} es requerido`,
          })
          return
        }

        delete validationErrors[cell.id]
        setValidationErrors({
          ...validationErrors,
        })
      },
      onChange: e => {
        if (cell.column.id === 'name')
          actions.product.setFormField({
            value: e.target.value,
            fieldType: 'name',
          })
        if (cell.column.id === 'price')
          actions.product.setFormField({
            value: e.target.value,
            fieldType: 'price',
          })
        if (cell.column.id === 'details')
          actions.product.setFormField({
            value: e.target.value,
            fieldType: 'details',
          })
        if (cell.column.id === 'id')
          actions.product.setFormField({
            value: e.target.value,
            fieldType: 'id',
          })
        if (cell.column.id === 'disabled')
          actions.product.setFormField({
            value: e.target.value,
            fieldType: 'disabled',
          })
      },
    }),
    [validationErrors],
  )
  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: translations.productPage.name,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'price',
        header: translations.productPage.price,
        Cell: ({ cell }) => <FormatCurrency value={cell.getValue<number>()} />,
        Edit: table => (
          <TextField
            disabled={state.profile.role !== 'ADMIN'}
            error={!!validationErrors[table.cell.id]}
            helperText={validationErrors[table.cell.id]}
            onChange={e => {
              const isValid = validateNumber(Number.parseFloat(e.target.value))
              !isValid
                ? setValidationErrors({
                    [table.cell.id]:
                      `${table.cell.column.columnDef.header} es requerido y debe ser numero`,
                  })
                : delete validationErrors[table.cell.id]
              actions.product.setFormField({
                value: Number.parseFloat(e.target.value),
                fieldType: 'price',
              })
            }}
            type="number"
            label={translations.productPage.price}
            defaultValue={state.product.form.price || 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'details',
        header: translations.productPage.details,
        Edit: _ => (
          <TextField
            defaultValue={state.product.form.details || ''}
            label={translations.productPage.details}
            onChange={e => {
              actions.product.setFormField({
                value: e.target.value,
                fieldType: 'details',
              })
            }}
            multiline
            minRows={3}
          />
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'inventory_managed',
        header: 'Existe en inventario',

        Edit: _ => (
          <FormControlLabel
            control={
              <Switch
                defaultChecked={state.product.form.inventory_managed}
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
        ),
      },
      {
        accessorKey: 'disabled',
        header: 'disabled',
        Edit: () => (
          <FormControlLabel
            control={
              <Switch
                defaultChecked={state.product.form.disabled}
                onChange={(_, checked) =>
                  actions.product.setFormField({
                    value: checked,
                    fieldType: 'disabled',
                  })
                }
                name="Deshabilitado"
              />
            }
            label="Deshabilitado"
          />
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'createdAt',
        header: 'Creado',
        Edit: () => <></>,
      },
      {
        accessorKey: 'updatedAt',
        header: 'Actualizado',
        Edit: () => <></>,
      },
      {
        accessorKey: 'inventory_quantity',
        header: 'Disponible',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        Edit: ({ cell }) =>
          state.product.form.inventory_managed ? (
            <TextField
              defaultValue={cell.getValue()}
              disabled
              label={'Disponible'}
            />
          ) : (
            <></>
          ),
      },
    ],
    [getCommonEditTextFieldProps],
  )

  async function handleDeleteRow(row: MRT_Row<Product>) {
    actions.product.setFormField({
      value: row.getValue<string>('id'),
      fieldType: 'id',
    })

    actions.application.setConfirmationModal()
  }

  async function handleCancelRowEdits() {}
  useEffect(() => {
    const newHeight = getRowCount(height, 80)

    setPagination({
      pageIndex: 0,
      pageSize: newHeight,
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
          pagination,
          isLoading: state.product.loadingProduct,
        }}
        initialState={{
          columnVisibility: {
            id: false,
            disabled: false,
            inventory_managed: false,
            inventory_quantity: false,
          },
          showGlobalFilter: true,
        }}
        localization={MRT_Localization_ES}
        columns={columns}
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
        onPaginationChange={state => setPagination(state)}
        data={products ?? []}
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box
            sx={{
              display: state.product.loadingProduct ? 'none' : 'flex',
              gap: '1rem',
            }}>
            <Tooltip arrow placement="left" title="Ver Producto">
              <IconButton
                onClick={() => {
                  const id = row.getValue<string>('id')
                  actions.product.setSelectedProduct(id)
                  actions.product.setProductViewModal()
                }}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={() => {
                  actions.product.setFormField({
                    value: row.getValue<boolean>('disabled'),
                    fieldType: 'disabled',
                  })
                  actions.product.setFormField({
                    value: row.getValue<boolean>('inventory_managed'),
                    fieldType: 'inventory_managed',
                  })
                  actions.product.setFormField({
                    value: row.getValue<string>('name'),
                    fieldType: 'name',
                  })
                  actions.product.setFormField({
                    value: row.getValue<number>('price'),
                    fieldType: 'price',
                  })
                  actions.product.setFormField({
                    value: row.getValue<string>('details'),
                    fieldType: 'details',
                  })
                  actions.product.setFormField({
                    value: row.getValue<string>('id'),
                    fieldType: 'id',
                  })
                  table.setEditingRow(row)
                }}>
                <Edit />
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
          <IconButton
            size="large"
            color="primary"
            onClick={() => {
              actions.product.setCreateModalOpen(true)
            }}>
            <AddBoxIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        )}
      />
      <CreateProductModal />
      <ViewProduct />
      <ConfirmationDialog
        key={'product-delete-dialog'}
        question="Seguro que desea eliminar este producto?"
        advice="Esta acción es irreversible"
        open={state.application.confirmationOpen}
        type="delete"
        handleConfirm={() => actions.product.deleteProduct()}
      />
    </Box>
  )
}

export default ProductTable

const validateRequired = (value: string) => !!value.length
const validateNumber = (value: any) =>
  typeof value !== 'number' || !!value || value === 0
