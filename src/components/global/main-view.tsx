import { Box } from '@mui/material'
import { Suspense, useEffect, useLayoutEffect } from 'react'
import Menu from './menu'
import Header from './header'
import { store } from '../../utils'
import Loader from './loader'

function MainView(props: any) {
  const state = store.useState()
  const actions = store.useActions()
  useLayoutEffect(() => {
    if (!state.business.business.id) actions.business.getBusinessData()
  }, [])
  if (state.application.isLoading) return <Loader />
  return (
    <Suspense fallback={<Loader />}>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
        }}>
        <Header />
        <Menu />
        <Box
          sx={{
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}>
          {props.children}
        </Box>
      </Box>
    </Suspense>
  )
}

export default MainView
