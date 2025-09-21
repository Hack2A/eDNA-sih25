import { useMemo } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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

interface SpeciesBarChartProps {
    pastReports: Report[];
}

const SpeciesBarChart: React.FC<SpeciesBarChartProps> = ({ pastReports }) => {
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
                        '#244247',
                        '#244247'
                    ],
                    borderColor: [
                        '#757575',
                        '#757575'
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
        <div className="w-1/2 h-96 bg-[#226FA1] p-4 rounded-lg flex flex-col text-white">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Unique vs. Recurring Species</span>
            </div>
            <div className="flex-1 relative">
                <Bar data={barChartData} options={barChartOptions} />
            </div>
        </div>
    );
};

export default SpeciesBarChart;