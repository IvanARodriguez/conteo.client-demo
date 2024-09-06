export type RegistrationState = {
  isActivated: boolean
  activationForm: {
    isLoading: boolean
    admin: {
      username: string
      password: string
      confirmPassword: string
    }

    business: {
      name: string
      address: string
      rnc: number
      phone: string
      email: string
    }

    tax: {
      B01: number
      B02: number
      B04: number
      B14: number
      B15: number
      B16: number
    }
  }
}

export const state: RegistrationState = {
  isActivated: false,
  activationForm: {
    isLoading: false,
    admin: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    business: {
      name: '',
      address: '',
      rnc: 0,
      phone: '',
      email: '',
    },
    tax: {
      B01: 0,
      B02: 0,
      B04: 0,
      B14: 0,
      B15: 0,
      B16: 0,
    },
  },
}
