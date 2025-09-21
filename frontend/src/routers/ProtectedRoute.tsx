import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'

interface ProtectedRouteProps {
    children?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation()
    // Check if user is authenticated using authService
    const isAuthenticated = authService.isAuthenticated()

    // If not authenticated, redirect to auth page with current location
    if (!isAuthenticated) {
        return <Navigate to="/u/auth" state={{ from: location }} replace />
    }

    // If authenticated, render the children or Outlet for nested routes
    return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute