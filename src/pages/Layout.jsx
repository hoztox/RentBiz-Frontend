import React from 'react'
import AdminSidebar from '../components/Admin Sidebar/AdminSidebar'
import AdminNavbar from '../components/Admin Navbar/AdminNavbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminNavbar />
                <div className="flex-1 overflow-y-auto bg-[#FBFBFB]">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
