import ConfirmationDialog from '@/components/global/confirmation-dialog'
import MainView from '@/components/global/main-view'
import CreateUserModal from '@/components/users/create-user-modal'
import UsersTable from '@/components/users/user-table'
import UserView from '@/components/users/user-view'
import { store } from '@/utils'
import { Box } from '@mui/material'
import React, { useCallback, useEffect } from 'react'

function Users() {
  const state = store.useState()
  const actions = store.useActions()
  const [rol, setRol] = React.useState('')

  const loadUsers = useCallback(async () => {
    await actions.users.getUsers()
  }, [state.users.usersData])
  useEffect(() => {
    actions.application.setMenuSection('users')
    actions.application.setCurrentPage('')
    loadUsers()
  }, [])
  return (
    <MainView>
      <Box
        sx={{
          height: { xs: 'auto', sm: '100vh' },
          padding: '1rem',
          overflow: 'auto',
        }}>
        <Box display={'flex'} overflow={'auto'} height={'100%'}>
          <UsersTable />
        </Box>
      </Box>
      <CreateUserModal />
      <ConfirmationDialog
        open={state.application.confirmationOpen}
        key={'user-delete-modal'}
        question="Seguro que desea eliminar usuario?"
        advice="Una vez se elimine este usuario, el cambio es irreversible"
        type="delete"
        handleConfirm={() => actions.users.deleteUser()}
      />
      <UserView />
    </MainView>
  )
}

export default Users
