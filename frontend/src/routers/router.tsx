import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from '../pages/landing'
import Info from '../pages/info'
import Authenticate from '../pages/forms/authenticate'
import DataIngestion from '../pages/pipeline-based/data-ingestion'
import BriefOutputScreen from '../pages/pipeline-based/brief-output'
import SpecieSearch from '../pages/specie-search'
import MainLayout from '../layout/main-layout'
import SpecieDetails from '../pages/pipeline-based/specie-details'
import ProtectedRoute from './ProtectedRoute'
import Dashboard from '../pages/dashboard'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public routes - no authentication required */}
                <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
                <Route path="/u/auth" element={<Authenticate />} />

                {/* Protected routes - require authentication */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/info" element={<Info />} />
                        <Route path="/data-ingest" element={<DataIngestion />} />
                        <Route path="/report" element={<BriefOutputScreen />} />
                        <Route path="/visual/:specieID" element={<SpecieDetails />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/search-specie" element={<SpecieSearch />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes
