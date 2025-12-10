import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-base-bg pb-20">
      <main className="p-4">
        <Outlet />
      </main>
      <Navbar />
      <Toast />
    </div>
  )
}

export default MainLayout

