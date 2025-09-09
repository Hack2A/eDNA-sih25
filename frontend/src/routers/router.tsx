import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from '../pages/landing'
import Info from '../pages/info'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/info" element={<Info />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes
