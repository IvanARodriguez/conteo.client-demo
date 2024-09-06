import { styled } from '@mui/material'
import { MaterialDesignContent, SnackbarProvider } from 'notistack'

function CustomNotification(props: { children: JSX.Element }) {
  return (
    <SnackbarProvider
      preventDuplicate
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
      }}>
      {props.children}
    </SnackbarProvider>
  )
}

export default CustomNotification

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    background: 'rgba( 22, 22, 22, 0.4 )',
    backdropFilter: 'blur( 10.5px )',
    WebkitBackdropFilter: ' blur( 10.5px )',
    borderRadius: '.3rem',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    borderRight: ' 5px solid #268439',
  },
  '&.notistack-MuiContent-error': {
    background: 'rgba( 22, 22, 22, 0.4 )',
    backdropFilter: 'blur( 10.5px )',
    WebkitBackdropFilter: ' blur( 10.5px )',
    borderRadius: '.3rem',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    borderRight: ' 5px solid #ff0000',
  },
  '&.notistack-MuiContent-info': {
    background: 'rgba( 22, 22, 22, 0.4 )',
    backdropFilter: 'blur( 10.5px )',
    WebkitBackdropFilter: ' blur( 10.5px )',
    borderRadius: '.3rem',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    borderRight: ' 5px solid #0095ff',
  },
  '&.notistack-MuiContent-warning': {
    background: 'rgba( 22, 22, 22, 0.4 ) !important',
    backdropFilter: 'blur( 10.5px )',
    WebkitBackdropFilter: ' blur( 10.5px )',
    borderRadius: '.3rem',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    borderRight: ' 5px solid #ffc800',
  },
  '&.notistack-MuiContent-default': {
    background: 'rgba( 22, 22, 22, 0.4 )',
    backdropFilter: 'blur( 10.5px )',
    WebkitBackdropFilter: ' blur( 10.5px )',
    borderRadius: '.3rem',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    borderRight: ' 5px solid #0099ff',
  },
}))
