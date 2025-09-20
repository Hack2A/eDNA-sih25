import { useEffect, useState } from "react"
import InfoCard from "../components/dashboard/info-card"
import { dataRetrievalService } from "../services/dataRetreiveService"
import ReportListItem from "../components/dashboard/report-list-item"
import ReportListHeader from "../components/dashboard/report-list-header"

const Dashboard = () => {

    window.document.title = "Dashboard | AquaGenesis"
    const [pastReports, setPastReports] = useState<any>([]);
    const [summary, setSummary] = useState<any>({});

    useEffect(() => {
        const fetchPastReports = async () => {
            try {
                const response = await dataRetrievalService.fetchAllReports();
                console.log("Fetched past reports:", response.data);
                setPastReports(response.data.history || []);
            } catch (error) {
                console.error("Error fetching past reports:", error);
            }
        };

        const fetchSummary = async () => {
            try {
                const response = await dataRetrievalService.fetchDashboardSummary();
                console.log("Fetched dashboard summary:", response.data);
                setSummary(response.data || {});
            } catch (error) {
                console.error("Error fetching dashboard summary:", error);
            }
        };


        fetchSummary();
        fetchPastReports();
    }, [])


    return (
        <div className="w-[80%] flex flex-col justify-center mx-auto text-white my-10 gap-10">
            {/* Heading */}
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <span className="text-gray-400">Welcome to your user dashboard, you can check your past insights here!</span>
            </div>

            {/* Number data for the user regarding the uploads and reports */}
            <div className="flex justify-between gap-6">
                <InfoCard title="Reports Generated" content={summary.total_reports_generated || 0} />
                <InfoCard title="Species Found" content={summary.total_species_found || 0} />
                <InfoCard title="Unique Species Found" content={summary.unique_species_found || 0} />
                <InfoCard title="Potential New Discoveries" content={summary.potential_discoveries || 0} />
            </div>

            {/* Char or Graphical Representation */}
            <div className="flex flex-col">
                <h1 className="text-xl font-bold">Report Visual</h1>
                Here, I was thinking of adding some charts and graphs to visualize user data
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-2">Reports History</h1>
                {pastReports.length === 0 ? (
                    <p className="text-gray-400">No past reports available.</p>
                ) : (
                    // In your parent component
                    <div className="rounded-lg overflow-hidden bg-[#244247]">
                        <ReportListHeader />
                        {pastReports.map((report) => (
                            <ReportListItem
                                key={report.id}
                                date={report.created_at}
                                id={report.id}
                                total_species={report.result_json.input_summary.sequences_provided}
                                unique_species={report.result_json.abundance_summary.unique_taxa_count}
                                potential_discoveries={report.result_json.confidence_summary.very_low}
                                status={report.result_json.status}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
