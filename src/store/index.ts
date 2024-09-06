import { namespaced } from 'overmind/config'
import { IContext } from 'overmind'
import {
  createStateHook,
  createActionsHook,
  createEffectsHook,
} from 'overmind-react'
import * as application from './application'
import * as profile from './profile'
import * as product from './products'
import * as customer from './customer'
import * as invoice from './invoice'
import * as dashboard from './dashboard'
import * as users from './users'
import * as quote from './quote'
import * as report from './report'
import * as transaction from './transaction'
import * as accounting from './accounting'
import * as business from './business'
import * as vendor from './vendor'
import * as tax from './tax'
import * as registration from './registration'

const applicationParts = {
  application,
  customer,
  product,
  profile,
  invoice,
  dashboard,
  users,
  quote,
  report,
  transaction,
  accounting,
  business,
  vendor,
  tax,
  registration,
}

export type Context = IContext<typeof overmindConfig>
export const useState = createStateHook<Context>()
export const useActions = createActionsHook<Context>()
export const useEffects = createEffectsHook<Context>()

export const overmindConfig = namespaced(applicationParts)
