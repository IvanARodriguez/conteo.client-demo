import { Box, Typography } from '@mui/material'
import { dictionary } from '@/utils/dictionary'
import { store } from '@/utils'
import NotFoundImage from '@/assets/no-found-image'

function NoMatch() {
  const state = store.useState()
  const translation = dictionary[state.application.language]
  return (
    <Box
      display={'flex'}
      minHeight={'100vh'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      gap={'1.3rem'}>
      <Box
        sx={{
          width: '100%',
          maxWidth: { md: '400px' },
        }}>
        <NotFoundImage />
      </Box>

      <Typography variant="h4" fontWeight={'700'}>
        Ohh Ohh...
      </Typography>
      <Typography variant="h4">{translation.notFoundMessage}</Typography>
    </Box>
  )
}

export default NoMatch
