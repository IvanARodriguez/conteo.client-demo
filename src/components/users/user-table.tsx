import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTableProps,
} from 'material-react-table'

import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import * as store from '../../store'
import { MRT_Localization_ES } from 'material-react-table/locales/es'

import useComponentSize from '@/hooks/use-component-size'
import { getRowCount } from '@/utils/helper'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { UserData } from '@/types'
import { Edit, Delete } from '@mui/icons-material'
import VisibilityIcon from '@mui/icons-material/Visibility'

function UsersTable() {
  const state = store.useState()
  const actions = store.useActions()

  const { height, ref } = useComponentSize()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, //customize the default page size
  })

  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({})

  const handleSaveRowEdits: MaterialReactTableProps<UserData>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      await actions.users.updateUserInfo()
      exitEditingMode()
    }

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<UserData>,
    ): MRT_ColumnDef<UserData>['muiTableBodyCellEditTextFieldProps'] => ({
      disabled: cell.column.id === 'disabled' && state.profile.role !== 'ADMIN',

      error: !!validationErrors[cell.id],
      helperText: validationErrors[cell.id],
      onBlur: event => {
        console.log('onblur')
      },
      onChange: e => {
        const isInvalidMessage = validatePassword(e.target.value)
        const isValidUsername = validateRequired(e.target.value)
        if (cell.column.id === 'password') {
          actions.users.setPassword(e.target.value)
          if (isInvalidMessage.length > 0) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: isInvalidMessage,
            })
            return
          }
        }
        if (cell.column.id === 'username') {
          actions.users.setFormUsername(e.target.value)
          if (!isValidUsername) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: 'Nombre de usuario es requerido',
            })
            return
          }
        }
        if (cell.column.id === 'confirm-password') {
          actions.users.setConfirmPassword(e.target.value)
        }

        delete validationErrors[cell.id]
        setValidationErrors({
          ...validationErrors,
        })
      },
    }),
    [validationErrors],
  )

  const columns = useMemo<MRT_ColumnDef<UserData>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
      },
      {
        accessorKey: 'username',
        header: 'Nombre de Usuario',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'password',
        header: 'Contraseña',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          type: 'password',
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: 'role',
        header: 'Tipo de cuenta',
        Edit: props => (
          <Autocomplete
            onChange={(_, value) =>
              value && actions.users.setRole(value as 'EMPLOYEE' | 'ADMIN')
            }
            renderInput={params => (
              <TextField {...params} label="Tipo de usuario" />
            )}
            defaultValue={state.users.userFormState.role}
            options={['ADMIN', 'EMPLOYEE']}
          />
        ),
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de creación',
        enableEditing: false,
        Cell: ({ cell }) => (
          <Typography>
            {new Date(cell.getValue<string>()).toLocaleString('es-DO')}
          </Typography>
        ),
        Edit: props => (
          <TextField
            label="Fecha de creación"
            disabled
            value={new Date(props.cell.getValue<string>()).toLocaleString(
              'es-DO',
            )}
          />
        ),
      },
    ],
    [getCommonEditTextFieldProps],
  )

  async function handleDeleteRow(row: MRT_Row<UserData>) {
    const id = row.getValue<string>('id')
    actions.users.setId(id)
    actions.application.setConfirmationModal()
  }

  async function handleCancelRowEdits() {
    actions.users.setFormUsername('')
    actions.users.setConfirmPassword('')
    actions.users.setRole('EMPLOYEE')
    actions.users.setId('')
    actions.users.setFormUsername('')
  }
  function handleViewUser(row: MRT_Row<UserData>) {
    const id = row.getValue<string>('id')
    if (id === state.users.userFormState.id) {
      actions.users.setUserViewModal()
      return
    }
    actions.users.setId(id)
    actions.users.getUserById()
  }

  useEffect(() => {
    const newHeight = getRowCount(height, 72)

    setPagination({
      pageIndex: 0,
      pageSize: newHeight,
    })
  }, [height])

  return (
    <MaterialReactTable
      state={{
        pagination,
        isLoading: state.users.isLoadingData,
      }}
      onPaginationChange={state => setPagination(state)}
      columns={columns}
      enableStickyFooter
      enablePagination
      initialState={{
        columnVisibility: {
          id: false,
          password: false,
          confirmPassword: false,
        },
        showGlobalFilter: true,
      }}
      localization={MRT_Localization_ES}
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
      data={state.users.usersData ?? []}
      renderTopToolbarCustomActions={() =>
        state.profile.role === 'ADMIN' ? (
          <IconButton
            onClick={() => actions.users.setDialogOpen()}
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '100rem',
              p: 0,
            }}
            color="primary">
            <GroupAddIcon />
          </IconButton>
        ) : (
          ''
        )
      }
      enableColumnOrdering
      onEditingRowSave={handleSaveRowEdits}
      onEditingRowCancel={handleCancelRowEdits}
      enableRowActions
      renderRowActions={({ row, table }) => (
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
          }}>
          <Tooltip arrow placement="right" title="Ver usuario">
            <IconButton onClick={() => handleViewUser(row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="left" title="Editar usuario">
            <IconButton
              onClick={() => {
                actions.users.setFormUsername(row.getValue('username'))
                actions.users.setRole(row.getValue('role'))
                actions.users.setPassword(row.getValue('password'))
                actions.users.setId(row.getValue('id'))
                table.setEditingRow(row)
              }}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="right" title="Eliminar usuario">
            <IconButton
              disabled={row.getValue('id') === state.profile.id}
              onClick={() => handleDeleteRow(row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    />
  )
}

export default UsersTable

export function validatePassword(value: string) {
  const regex = /^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/
  return value.length === 0
    ? ''
    : value.length > 1 && value.length < 6
    ? 'Contraseña debe tener al menos 6 caracteres'
    : !regex.test(value)
    ? 'Contraseña debe contener al menos un numero y un carácter especial'
    : ''
}

export const validateRequired = (value: string) => !!value.length
