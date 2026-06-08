import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/pages/LoginPage'
import ServicesPage from '@/pages/ServicesPage'
import UsersPage from '@/pages/UsersPage'
import MainLayout from '@/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  const { token } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/services" replace /> : <LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/services" element={<ServicesPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<MainLayout />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/services" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
