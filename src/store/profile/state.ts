import { derived } from 'overmind'

type ProfileSetting = {
  theme: 'dark' | 'light'
  image: string
}

type UpdateForm = {
  username: string
  password: string
  role: 'ADMIN' | 'EMPLOYEE'
  theme: 'light' | 'dark' | ''
}

export type Profile = {
  id: string
  username: string
  role: string
  setting: ProfileSetting
  updateForm: UpdateForm
  loading: boolean
  updatingUserData: boolean
  imageRenderingKey: string
}

export const state: Profile = {
  username: '',
  role: '',
  id: '',
  setting: {
    theme: 'dark',
    image: '',
  },
  loading: false,
  updateForm: {
    password: '',
    role: 'ADMIN',
    username: '',
    theme: '',
  },
  updatingUserData: true,
  imageRenderingKey: Date.now().toString(),
}
