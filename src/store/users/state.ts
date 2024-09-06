import { UserByIdResult, UserData } from '@/types'
import { derived } from 'overmind'

export type RoleType = 'ADMIN' | 'EMPLOYEE'

type UserFormState = {
  id?: string
  username: string
  password: string
  confirmPassword: string
  passwordMatched: boolean
  role: RoleType
}

interface UserState {
  createModalOpen: boolean
  userFormState: UserFormState
  usersData: UserData[]
  isLoadingData: boolean
  viewUserOpen: boolean
  loadingUserData: boolean
  userById: UserByIdResult
}

export const state: UserState = {
  createModalOpen: false,
  isLoadingData: false,
  usersData: [],
  loadingUserData: false,
  userFormState: {
    id: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'EMPLOYEE',
    passwordMatched: derived((_: any, root: { users: UserState }) => {
      const matched =
        root.users.userFormState.password ===
        root.users.userFormState.confirmPassword
      if (
        root.users.userFormState.password &&
        root.users.userFormState.confirmPassword &&
        matched
      ) {
        return true
      }
      return false
    }),
  },
  viewUserOpen: false,
  userById: {
    username: '',
    role: '',
    createdAt: '',
    setting: {
      image: '',
      theme: '',
    },
    updatedAt: '',
  },
}
