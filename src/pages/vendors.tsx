import MainView from '@/components/global/main-view'
import ViewHeader from '@/components/global/view-header'
import { store } from '@/utils'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DirectionsIcon from '@mui/icons-material/Directions'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Skeleton,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useLayoutEffect, useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { red } from '@mui/material/colors'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import { LoadingButton } from '@mui/lab'

function Vendors() {
  const [filter, setFilter] = useState('')
  const actions = store.useActions()
  const state = store.useState()
  const vendors = state.vendor.vendors

  function stringToColor(string: string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name: string) {
    const length = name.split(' ').length
    const firstNameFirstLetter = length > 0 ? name.split(' ')[0][0] : ''
    const lastNameFirstLetter = length > 1 ? name.split(' ')[1][0] : ''
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${firstNameFirstLetter}${lastNameFirstLetter}`,
    }
  }

  useLayoutEffect(() => {
    actions.vendor.getVendors()
  }, [])
  return (
    <MainView>
      <Box
        sx={{
          padding: '1rem',
          display: 'grid',
          height: '100%',
          gridTemplateRows: 'auto auto 1fr',
          gap: '1rem',
        }}>
        <AppBar
          component={Paper}
          sx={{
            position: 'relative',
            p: '.5rem',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'start',
            width: ' 100%',
            flexDirection: 'row',
            gap: '.5rem',
          }}
          variant="elevation">
          <Typography variant="h5" sx={{ width: 'fit-content' }}>
            Vendedores
          </Typography>
          <Tooltip title="Agregar Vendedor">
            <IconButton
              size="small"
              onClick={() => {
                actions.vendor.changeFormActionType('create')
                actions.vendor.toggleFormDialog()
              }}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'end',
            }}>
            <Paper
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: '2px 4px',
              }}>
              <InputBase
                startAdornment={<SearchIcon />}
                sx={{
                  gap: '.5rem',
                  width: 'fit-content',
                }}
                placeholder="Filtrar por nombre"
                onChange={e => setFilter(e.target.value)}
                inputProps={{ 'aria-label': 'search vendor' }}
              />
            </Paper>
          </Box>
        </AppBar>

        <Box
          sx={{
            display: 'grid',
            gap: '1rem',
            alignItems: 'start',
            overflow: 'auto',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
              lg: '1fr 1fr 1fr 1fr',
            },
          }}>
          {state.vendor.loadingIOState === 'loading'
            ? Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  sx={{ bgcolor: 'grey.900' }}
                  variant="rectangular"
                  height={235}
                />
              ))
            : vendors.length > 0 &&
              vendors
                .filter(v =>
                  filter ? v.vendor_name.includes(filter) : v.vendor_name,
                )
                .map(v => (
                  <Card
                    elevation={3}
                    sx={{
                      borderBottom: `1px solid ${
                        v.active ? 'var(--primary-color)' : red[300]
                      }`,
                      padding: '1rem',
                    }}
                    key={v.id}>
                    <CardMedia>
                      <Avatar {...stringAvatar(v.vendor_name)} />
                    </CardMedia>
                    <CardContent sx={{ opacity: v.active ? 1 : 0.3 }}>
                      <Typography gutterBottom variant="h5">
                        {v.vendor_name ?? 'Nombre desconocido'}
                      </Typography>
                      <Divider />
                      <Typography gutterBottom variant="body2">
                        Estado: {v.active ? 'Activo' : 'Inactivo'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        onClick={() => {
                          actions.vendor.setVendorFormField({
                            type: 'name',
                            newValue: v.vendor_name,
                          })
                          actions.vendor.setVendorFormField({
                            type: 'active',
                            newValue: v.active,
                          })
                          actions.vendor.setVendorFormField({
                            type: 'id',
                            newValue: v.id,
                          })
                          actions.vendor.toggleFormDialog()
                          actions.vendor.changeFormActionType('update')
                        }}
                        size="small">
                        Editar
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          actions.vendor.setVendorFormField({
                            type: 'name',
                            newValue: v.vendor_name,
                          })
                          actions.vendor.setVendorFormField({
                            type: 'active',
                            newValue: v.active,
                          })
                          actions.vendor.setVendorFormField({
                            type: 'id',
                            newValue: v.id,
                          })
                          actions.vendor.deleteVendor()
                        }}>
                        Eliminar
                      </Button>
                    </CardActions>
                  </Card>
                ))}
        </Box>
      </Box>
      <ModalForm />
    </MainView>
  )
}

export default Vendors

export function ModalForm() {
  const actions = store.useActions()
  const state = store.useState()
  const formState = state.vendor.vendorForm
  const handleCLose = () => {
    actions.vendor.setVendorFormField({ newValue: '', type: 'name' })
    actions.vendor.setVendorFormField({ newValue: true, type: 'active' })
    actions.vendor.toggleFormDialog()
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    state.vendor.vendorForm.formType === 'update'
      ? actions.vendor.updateVendor()
      : actions.vendor.createVendor()
  }
  return (
    <Dialog open={state.vendor.vendorForm.isOpen} onClose={handleCLose}>
      <Paper sx={{ p: '1rem', display: 'grid', gap: '1rem' }}>
        <Typography variant="h5" gutterBottom>
          {' '}
          {formState.formType === 'update'
            ? 'Actualizar Vendedor'
            : 'Crear Vendedor'}
        </Typography>
        <Box
          component={'form'}
          sx={{ display: 'grid', gap: '1rem' }}
          onSubmit={handleSubmit}>
          <TextField
            sx={{ minWidth: { xs: 'none', sm: '350px' } }}
            onChange={e =>
              actions.vendor.setVendorFormField({
                type: 'name',
                newValue: e.target.value,
              })
            }
            value={state.vendor.vendorForm.vendorName}
            variant="outlined"
            size="small"
            label="Nombre Completo"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={(e, value) =>
                  actions.vendor.setVendorFormField({
                    newValue: value,
                    type: 'active',
                  })
                }
                checked={formState.active}
              />
            }
            label="Activo"
          />
          <LoadingButton
            loading={state.vendor.loadingIOState === 'loading'}
            disabled={!formState.vendorName}
            variant="contained"
            type="submit">
            {formState.formType === 'update' ? 'Actualizar' : 'Crear'}
          </LoadingButton>
        </Box>
      </Paper>
    </Dialog>
  )
}
