import { Outlet } from 'react-router-dom'
import Header from './Header'
import Toast from '../components/Toast'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Toast />
    </div>
  )
}

export default MainLayout

