import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar'

const MainLayout = ({ children }: { children?: React.ReactNode }) => {

    return (
        <>

            <div className="bg-[#131E24] min-h-screen text-white overflow-none">
                <div className='sticky top-0 z-50'>
                    <Navbar />
                </div>
                {/* Prefer rendering nested routes via Outlet; fallback to children when used directly */}
                {children ?? <Outlet />}
            </div>
        </>
    )
}

export default MainLayout
