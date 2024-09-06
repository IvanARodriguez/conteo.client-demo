import { AppBar, Box, Paper, Typography } from '@mui/material'
import React from 'react'
import { store } from '../../utils'

type ViewHeader = {
  title: string
}

function ViewHeader(props: ViewHeader) {
  return (
    <AppBar
      component={Paper}
      sx={{
        position: 'relative',
        p: '.5rem',
        borderRadius: '5px',
        width: ' 100%',
        height: 'fit-content',
        mb: '1rem',
      }}
      variant="elevation">
      <Typography variant="h5">{props.title ?? 'Conteo'}</Typography>
    </AppBar>
  )
}

export default ViewHeader
