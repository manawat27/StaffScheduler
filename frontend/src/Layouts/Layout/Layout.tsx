import Header from "../Head/Header/Header"
import Footer from "../Footer/Footer"
import SideBar from "../SideBar/SideBar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="">
          <SideBar />
        </aside>
        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}
