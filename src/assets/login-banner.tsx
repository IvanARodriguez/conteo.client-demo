import { Box, styled } from '@mui/material'
import React from 'react'

function LoginBanner() {
  return (
    <Box
      component="img"
      sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '40vw',
        margin: '0 auto',
      }}
      src="productivity.svg"
      alt="Computer Image"
    />
  )
}

export default LoginBanner
