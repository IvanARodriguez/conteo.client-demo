import React, { useState, useEffect } from 'react'
import { Avatar, Skeleton } from '@mui/material'

const ImageComponent = React.memo(function ImageComponent(props: {
  size: number
  variant: 'circular' | 'rectangular' | 'rounded'
  imgSrc: string | undefined
  alt: string
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [errorImage, setErrorImage] = useState(false)
  const { imgSrc, size, variant, alt } = props

  useEffect(() => {
    setImageLoaded(false)
    setErrorImage(false)

    if (imgSrc) {
      const img = new Image()
      img.onload = () => {
        setImageLoaded(true)
        setErrorImage(false)
      }
      img.onerror = () => {
        setErrorImage(true)
      }
      img.src = imgSrc
    } else {
      setErrorImage(true)
    }
  }, [imgSrc])

  if (errorImage) {
    return (
      <Avatar sx={{ width: size, height: size, margin: '0 auto' }}>P</Avatar>
    )
  }
  if (!imageLoaded) {
    return (
      <Skeleton
        variant={variant}
        width={size}
        height={size}
        sx={{ margin: '0 auto' }}
      />
    )
  }
  return (
    <img
      src={imgSrc}
      width={size}
      height={size}
      loading="lazy"
      alt={alt}
      style={{
        margin: '0 auto',
        objectFit: 'cover',
        borderRadius:
          variant === 'circular' ? '50%' : variant === 'rounded' ? '5px' : 0,
      }}
    />
  )
})

export default ImageComponent
