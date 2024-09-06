import { derived } from 'overmind'
import { Application } from '../../types'
import { Profile } from '../profile/state'

export const state: Application = {
  menuOpen: false,
  language: 'es',
  currentPage: '',
  isLoading: false,
  login: {
    username: '',
    password: '',
    tenant: '',
  },
  sessionIO: 'unauthorized',
  isAuthorized: derived(
    (_, rootState: { profile: Profile; application: Application }) => {
      const userNotAvailable =
        rootState.profile.username === '' ||
        rootState.profile.id === '' ||
        rootState.profile.role === ''
      const authorized =
        rootState.application.sessionIO === 'authorized' && !userNotAvailable
      return authorized
    },
  ),
  isNavigating: false,
  confirmationOpen: false,
  currentSection: '',
  tenant: null,
  loadingTheme: false,
  useNarrowedMenu: false,
}
