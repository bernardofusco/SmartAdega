import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-base-bg dark:bg-dark-bg-primary pb-20 transition-colors">
      <main className="p-4">
        <Outlet />
      </main>
      <Navbar />
      <Toast />
    </div>
  )
}

export default MainLayout

