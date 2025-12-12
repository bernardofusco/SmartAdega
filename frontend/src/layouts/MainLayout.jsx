import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Toast from '../components/Toast'

const MainLayout = () => {
  return (
    <div className="min-h-screen flex bg-base-bg dark:bg-dark-bg-primary transition-colors">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
        <Outlet />
      </main>
      <Toast />
    </div>
  )
}

export default MainLayout

