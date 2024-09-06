import { useEffect, useLayoutEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  redirect,
} from 'react-router-dom'
import Invoices from './pages/invoices'
import NotFoundPage from './pages/not-found-page'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Product from './pages/product'
import Customer from './pages/customer'
import { store } from './utils'
import Loader from './components/global/loader'
import Users from './pages/users'
import UserProfile from './pages/user-profile'
import Quote from './pages/quote'
import ReportSummary from './pages/report-summary'
import Report from './pages/report'
import Transactions from './pages/transactions'
import PendingInvoices from './pages/pending-invoices'
import Business from './pages/business'
import Vendors from './pages/vendors'
import ExpiredInvoicesPage from './pages/expired-invoices-page'
import { useActions } from './store'
import Activate from './pages/activate'
import Register from './pages/register'

function IsAuthorized() {
  const state = store.useState()

  if (state.profile.updatingUserData) {
    return <Loader />
  }

  return !state.application.isAuthorized ? <Outlet /> : <Navigate to="/" />
}

function ProtectedRoute() {
  const state = store.useState()

  if (state.profile.updatingUserData) {
    return <Loader />
  }

  return state.application.isAuthorized ? <Outlet /> : <Navigate to="/login" />
}

function App() {
  const actions = useActions()

  useLayoutEffect(() => {
    actions.profile.getUser()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<IsAuthorized />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Dashboard />} path="/" />
          <Route element={<Product />} path="/product" />
          <Route element={<Customer />} path="/customer" />
          <Route element={<Users />} path="/users" />
          <Route element={<UserProfile />} path="/users/profile" />
          <Route element={<Report />} path="/accounting/report" />
          <Route element={<Transactions />} path="/transaction" />
          <Route element={<Business />} path="/business" />
          <Route element={<Vendors />} path="/vendors" />
          <Route element={<Invoices />} path="/invoice" />
          <Route element={<Quote />} path="/invoice/quote" />
          <Route element={<PendingInvoices />} path="/invoice/pending" />
          <Route element={<ExpiredInvoicesPage />} path="/invoice/expired" />
          <Route
            element={<ReportSummary />}
            path="/accounting/report-summary"
          />
        </Route>

        <Route path="/activate?*" element={<Activate />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
