import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import WinesPage from '../pages/WinesPage'
import WineDetailPage from '../pages/WineDetailPage'
import SettingsPage from '../pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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

