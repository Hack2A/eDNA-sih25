import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from '../pages/landing'
import Info from '../pages/info'
import Authenticate from '../pages/forms/authenticate'
import DataIngestion from '../pages/pipeline-based/data-ingestion'
import BriefOutputScreen from '../pages/pipeline-based/brief-output'
import VisualDataScreen from '../pages/pipeline-based/visual-data'
import DiversityDashboard from '../pages/diversity-dashboard'
import SpecieSearch from '../pages/specie-search'
import MainLayout from '../layout/main-layout'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/u/auth" element={<Authenticate />} />

                <Route element={<MainLayout></MainLayout>}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/info" element={<Info />} />

                    <Route path="/data-ingest" element={<DataIngestion />} />
                    <Route path="/data-output" element={<BriefOutputScreen />} />
                    <Route path="/visual/:specieID" element={<VisualDataScreen />} />

                    <Route path="/diversityglobe" element={<DiversityDashboard />} />
                    <Route path="/search-specie" element={<SpecieSearch />} />
                </Route>

            </Routes>
        </Router>
    )
}

export default AppRoutes
