import { store } from '@/utils'
import { LoadingButton } from '@mui/lab'
import { Paper, Typography, Box, TextField, Divider } from '@mui/material'
import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import { FileRejection, DropEvent, useDropzone } from 'react-dropzone'
import styled from '@emotion/styled'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { enqueueSnackbar } from 'notistack'
import ImageComponent from '../image-component'

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return '#00e676'
  }
  if (props.isDragReject) {
    return '#ff1744'
  }
  if (props.isFocused) {
    return '#2196f3'
  }
  return '#eeeeee3b'
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
  height: 100%;
  border-width: 2px;
  border-radius: 5px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa27;
  color: grey;
  outline: none;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
`

function BusinessForm() {
  const state = store.useState()
  const actions = store.useActions()

  const [file, setFile] = React.useState<File | undefined>(undefined)

  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>(
    null,
  )
  const business = state.business.business
  const businessFormData = state.business.businessDataForm

  async function handleFormSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault()
    await actions.business.updateBusiness()
    if (file) {
      await actions.business.updateBusinessLogo(file)
    }
    await actions.business.getBusinessData()
  }
  const onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void | undefined = useCallback(acceptedFiles => {
    const file = new FileReader()
    file.onload = () => {
      setPreview(file.result)
    }

    file.readAsDataURL(acceptedFiles[0])
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: { 'image/*': [] },
      disabled: business.id === '',
    })
  const invalidRNC =
    (state.business.businessDataForm.rnc !== undefined &&
      state.business.businessDataForm.rnc.toString().length < 9) ||
    (state.business.businessDataForm.rnc !== undefined &&
      state.business.businessDataForm.rnc.toString().length > 9)

  return (
    <Box
      component={'form'}
      onSubmit={handleFormSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '960px',
        margin: '0 auto',
        alignSelf: 'center',
        padding: '1rem',
      }}>
      <Typography variant="h3" textAlign={'center'}>
        Actualizar Empresa
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
          justifyContent: 'center',
          gap: '1.5rem',
          alignItems: 'center',
        }}>
        <ImageComponent
          imgSrc={
            !preview
              ? business.logourl
                ? business.logourl
                : undefined
              : (preview as string)
          }
          size={200}
          variant={'rounded'}
          alt={'Business Update Image'}
        />

        <Container
          style={{
            padding: '1rem',
            backgroundColor: isDragAccept
              ? '#3c9a5249'
              : isDragReject
                ? '#a200005b'
                : '',
          }}
          {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
          <input {...getInputProps()} />
          <AddPhotoAlternateIcon />
          {business.id ? (
            <p>Arrastra tu logo has aquí, o click para seleccionar</p>
          ) : (
            <p>
              Debe actualizar la información de la empresa antes de actualizar
              la imagen
            </p>
          )}
        </Container>
      </Box>
      <TextField
        fullWidth
        variant="filled"
        name="name"
        helperText={'Indique el nombre que será mostrado en facturas y recibos'}
        autoComplete={'off'}
        value={businessFormData.name}
        onChange={e => {
          actions.business.setFormData({
            dataType: 'name',
            value: e.target.value,
          })
        }}
        label={'Nombre'}
      />
      <TextField
        fullWidth
        variant="filled"
        name="address"
        autoComplete={'off'}
        value={businessFormData.address}
        helperText={'Esta dirección sera mostrada en los recibos y facturas'}
        onChange={e =>
          actions.business.setFormData({
            dataType: 'address',
            value: e.target.value,
          })
        }
        label={'Dirección'}
      />
      <TextField
        fullWidth
        variant="filled"
        name="email"
        autoComplete={'off'}
        value={businessFormData.email}
        helperText={'Correo que se mostrara en las facturas y es opcional'}
        onChange={e =>
          actions.business.setFormData({
            dataType: 'email',
            value: e.target.value,
          })
        }
        label={'Email'}
      />
      <TextField
        type="number"
        fullWidth
        variant="filled"
        name="RNC"
        error={invalidRNC}
        autoComplete={'off'}
        value={businessFormData.rnc}
        onChange={e =>
          actions.business.setFormData({
            dataType: 'rnc',
            value: Number.parseInt(e.target.value),
          })
        }
        helperText={'RNC debe tener 9 dígitos sin guiones'}
        label={'RNC'}
      />
      <TextField
        type="number"
        fullWidth
        variant="filled"
        name="Phone"
        autoComplete={'off'}
        onChange={e =>
          actions.business.setFormData({
            dataType: 'phone',
            value: e.target.value,
          })
        }
        value={businessFormData.phone}
        helperText={'Inserte el teléfono sin guiones ejemplo 8095638965'}
        label={'Teléfono'}
      />
      <Divider />
      <TextField
        type="text"
        multiline
        minRows={5}
        fullWidth
        variant="filled"
        name="invoice_observation"
        autoComplete={'off'}
        onChange={e =>
          actions.business.setFormData({
            dataType: 'invoice_observation',
            value: e.target.value,
          })
        }
        value={businessFormData.invoice_observation}
        helperText={
          'Ingrese las observaciones que usted quiere que aparezcan en las facturas.'
        }
        label={'Observación de factura'}
      />
      <LoadingButton
        type="submit"
        sx={{ width: 'fit-content' }}
        loading={state.business.isLoading}
        variant="contained">
        Actualizar
      </LoadingButton>
    </Box>
  )
}

export default BusinessForm
