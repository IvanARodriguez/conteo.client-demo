import TransactionView from '@/components/accounting/transaction-view'
import MainView from '@/components/global/main-view'
import { store } from '@/utils'
import { dictionary } from '@/utils/dictionary'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'

function Transactions() {
  const actions = store.useActions()
  const state = store.useState()
  const links = dictionary[state.application.language]?.navLinks
  useEffect(() => {
    actions.application.setMenuSection('transaction')
    actions.application.setCurrentPage(links.transactions)
  }, [])
  return (
    <MainView>
      <TransactionView />
    </MainView>
  )
}

export default Transactions
