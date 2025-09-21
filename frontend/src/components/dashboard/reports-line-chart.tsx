import { useMemo } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

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

interface ReportsLineChartProps {
    pastReports: Report[];
}

const ReportsLineChart: React.FC<ReportsLineChartProps> = ({ pastReports }) => {
    // Process chart data for the last 10 days
    const chartData = useMemo(() => {
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
        }, {});

        // Create chart data
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

    return (
        <div className="w-1/2 h-96 bg-[#226FA1] p-4 rounded-lg flex flex-col text-white">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Species Detected Over Time</span>
            </div>
            <div className="text-sm mb-2">
                <span className="text-gray-200">Last 10 Days </span>
            </div>
            <div className="flex-1 relative">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default ReportsLineChart;