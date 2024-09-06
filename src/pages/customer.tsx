import { Box, useTheme } from '@mui/material'
import { useEffect } from 'react'
import MainView from '@/components/global/main-view'
import { dictionary } from '@/utils/dictionary'
import * as store from '@/store'
import CustomerTable from '@/components/customer/customer-table'
import ViewHeader from '@/components/global/view-header'
import CustomerDeactivationModal from '@/components/customer/activation-moda'

function Customer() {
  const state = store.useState()
  const actions = store.useActions()
  const theme = useTheme()
  const translation = dictionary[state.application.language ?? 'es']

  const links = dictionary[state.application.language]?.navLinks
  useEffect(() => {
    actions.application.setMenuSection('customer')
    actions.application.setCurrentPage(links.customer)
    if (state.customer.customers.length === 0) {
      actions.customer.getCustomers()
    }
  }, [])
  return (
    <MainView>
      <Box
        p={'1rem'}
        display={'grid'}
        gridTemplateRows={'auto 1fr'}
        overflow={'auto'}
        flexDirection={'column'}
        minHeight={'100vh'}>
        <ViewHeader title={translation.customerPage.title ?? 'title'} />
        <CustomerTable />
      </Box>
      <CustomerDeactivationModal />
    </MainView>
  )
}

export default Customer
