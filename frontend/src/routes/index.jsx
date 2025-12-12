import { createHashRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import WinesPage from '../pages/WinesPage'
import WineDetailPage from '../pages/WineDetailPage'
import SettingsPage from '../pages/SettingsPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import AuthCallbackPage from '../pages/AuthCallbackPage'

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/signup',
    element: <SignupPage />
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <WinesPage />
      },
      {
        path: 'wines/:id',
        element: <WineDetailPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  }
])

