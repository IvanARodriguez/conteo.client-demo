import { store } from '@/utils'
import ImageComponent from '../image-component'
import { useEffect } from 'react'

function BusinessImage(props: { size: number }) {
  const state = store.useState()

  return (
    <ImageComponent
      size={props.size}
      variant={'circular'}
      imgSrc={state.business.business.logourl ?? ''}
      alt={'Business logo'}
    />
  )
}

export default BusinessImage
