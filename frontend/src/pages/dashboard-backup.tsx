import { useEffect, useState } from "react"
import InfoCard from "../components/dashboard/info-card"
import { dataRetrievalService } from "../services/dataRetreiveService"
import ReportListItem from "../components/dashboard/report-list-item"
import ReportListHeader from "../components/dashboard/report-list-header"
import ReportsLineChart from "../components/dashboard/reports-line-chart"
import SpeciesBarChart from "../components/dashboard/species-bar-chart"

interface Report {
    id: number;
    created_at: string;
    result_json: {
        input_summary: {
            sequences_provided: number;
        };
        abundance_summary: {
            unique_taxa_count: number;
        };
        confidence_summary: {
            very_low: number;
        };
        status: string;
    };
}

const Dashboard = () => {

    window.document.title = "Dashboard | AquaGenesis"
    const [pastReports, setPastReports] = useState<Report[]>([]);
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
        if (!pastReports || pastReports.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        // Get last 10 days
        const today = new Date();
        const last10Days = Array.from({ length: 10 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() - (9 - i));
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        });

        // Process reports data
        const reportsByDate = pastReports.reduce((acc: Record<string, number>, report: Report) => {
            const reportDate = new Date(report.created_at).toISOString().split('T')[0];
            const totalSpecies = report.result_json?.input_summary?.sequences_provided || 0;

            if (!acc[reportDate]) {
                acc[reportDate] = 0;
            }
            acc[reportDate] += totalSpecies;
            return acc;
        }, {});        // Create chart data
        const data = last10Days.map(date => reportsByDate[date] || 0);
        const labels = last10Days.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Total Species',
                    data,
                    borderColor: '#12B5D4',
                    backgroundColor: 'rgba(18, 181, 212, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#12B5D4',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }
            ]
        };
    }, [pastReports]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 12
                    },
                    beginAtZero: true
                }
            }
        },
        elements: {
            point: {
                hoverBackgroundColor: '#12B5D4',
            }
        }
    };

    // Bar chart data for unique vs recurring species
    const barChartData = useMemo(() => {
        if (!pastReports || pastReports.length === 0) {
            return {
                labels: ['Species Comparison'],
                datasets: []
            };
        }

        // Calculate totals across all reports
        const totalSpecies = pastReports.reduce((sum: number, report: Report) => {
            return sum + (report.result_json?.input_summary?.sequences_provided || 0);
        }, 0);

        const uniqueSpecies = pastReports.reduce((sum: number, report: Report) => {
            return sum + (report.result_json?.abundance_summary?.unique_taxa_count || 0);
        }, 0);

        const recurringSpecies = totalSpecies - uniqueSpecies;

        return {
            labels: ['Unique', 'Recurring'],
            datasets: [
                {
                    data: [uniqueSpecies, recurringSpecies],
                    backgroundColor: [
                        'rgba(18, 181, 212, 0.8)', // Teal for unique
                        'rgba(255, 159, 64, 0.8)'  // Orange for recurring
                    ],
                    borderColor: [
                        '#12B5D4',
                        '#FF9F40'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        };
    }, [pastReports]);

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 12
                    },
                    beginAtZero: true
                }
            }
        },
    };


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
                <h1 className="text-xl font-bold mb-2">Report Visual</h1>
                <div className="flex justify-between gap-6">
                    <ReportsLineChart pastReports={pastReports} />
                    <SpeciesBarChart pastReports={pastReports} />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-2">Reports History</h1>
                {pastReports.length === 0 ? (
                    <p className="text-gray-400">No past reports available.</p>
                ) : (
                    <div className="rounded-lg overflow-hidden bg-[#244247]">
                        <ReportListHeader />
                        <div className="max-h-[620px] overflow-y-auto">
                            {pastReports.map((report: Report) => (
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
