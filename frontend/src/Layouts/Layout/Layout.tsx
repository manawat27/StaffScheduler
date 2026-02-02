import Header from "../Head/Header/Header"
import Footer from "../Footer/Footer"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main Content (full width) */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}
