import { store } from '../utils'
import { dictionary } from '../utils/dictionary'

export function useTranslation() {
  const state = store.useState()
  return dictionary[state.application.language ?? 'es']
}
