import { Cancel } from '@mui/icons-material'
import CropIcon from '@mui/icons-material/Crop'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slider,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import getCroppedImg from './utils/crop-image'

type CropperProps = {
  photoURL: string
  setOpenCrop: (value: boolean) => void
  setPhotoURL: (photoUrl: string) => void
  setFile: (file: Blob) => void
}

const CropEasy = (props: CropperProps) => {
  const { photoURL, setOpenCrop, setPhotoURL, setFile } = props
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  })
  const cropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }
  async function cropImage() {
    try {
      const { ...croppedImage } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation,
      )
      setPhotoURL(croppedImage.url)
      setFile(croppedImage.file)
      setOpenCrop(false)
      console.log(croppedImage.url)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <DialogContent
        dividers
        sx={{
          position: 'relative',
          height: 400,
          width: 'auto',
          minWidth: { sm: 500 },
        }}>
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          cropShape="round"
          onZoomChange={setZoom}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={cropComplete}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay="auto"
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(_e, zoom) => setZoom(zoom as number)}
            />
          </Box>
          <Box>
            <Typography>Rotate: {rotation}</Typography>
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={360}
              value={rotation}
              onChange={(_e, rotation) => setRotation(rotation as number)}
            />
          </Box>
        </Box>
        <Box display={'flex'} gap={'1rem'} flexWrap={'wrap'}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => setOpenCrop(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<CropIcon />}
            onClick={cropImage}>
            Cortar
          </Button>
        </Box>
      </DialogActions>
    </>
  )
}

export default CropEasy

const zoomPercent = (value: number) => {
  return `${Math.round(value * 100)}%`
}
