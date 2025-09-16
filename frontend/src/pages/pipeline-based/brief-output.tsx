import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SpecieReportCard from '../../components/landing/species-cards'
import SummaryCard from '../../components/search-specie/summary-card'
import { dataRetrievalService } from '../../services/dataRetreiveService'

const BriefOutputScreen = () => {
    window.document.title = "Biodiversity Analysis Report | AquaGenesis"
    const [dataRecord, setDataRecord] = useState<any>(null)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Check if state is present from navigation
        if (location.state && Object.keys(location.state).length > 0) {
            setDataRecord(location.state.response);
            console.log('====================================');
            console.log(location.state.response);
            console.log('====================================');
        } else {
            dataRetrievalService.fetchLastReports()
                .then(response => {
                    setDataRecord(response.data.latest_result.result_json);
                })
                .catch(error => {
                    console.error('Error fetching latest report:', error);
                    // Handle error (e.g., show error message)
                });
        }
    }, [location.state])

    const handleExportPDF = () => {
        console.log(dataRecord)
    }

    const handleExportJSON = () => {
        if (!dataRecord) {
            console.error('No data available to export');
            return;
        }

        // Create a blob with the JSON data
        const jsonString = JSON.stringify(dataRecord, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        link.download = `biodiversity-analysis-report-${timestamp}.json`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('JSON export completed');
    }

    const handleExportCSV = () => {
        console.log('Export as CSV clicked')
    }

    return (
        <div className="w-[80%] flex flex-col justify-center mx-auto text-white my-10 gap-10">

            {/* Heading Section */}
            <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold">Biodiversity Analysis Report</h1>
                <span className="text-sm">
                    Dive into the depths of your eDNA data with our comprehensive analysis report. Uncover the hidden biodiversity within your samples, from species identification to taxonomic classification and potential novel discoveries.
                </span>
            </div>

            {/* Conditional Rendering based on data availability */}
            {!dataRecord ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="text-2xl font-semibold text-gray-400">No data set found initially</div>
                    <div className="text-sm text-gray-500">Please wait while we load your analysis results...</div>
                </div>
            ) : (
                <>
                    {/* Export Report Section */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-xl font-bold">Export Report</h2>
                        <div className="flex gap-4">
                            {/* <button
                                onClick={handleExportPDF}
                                className="px-5 py-2.5 bg-[#226FA1] hover:bg-[#1c5e8a] text-white font-medium rounded-lg cursor-pointer"
                            >
                                Export as PDF
                            </button> */}

                            <button
                                onClick={handleExportJSON}
                                className="px-5 py-2.5 bg-[#226FA1] hover:bg-[#1c5e8a] text-white font-medium rounded-lg cursor-pointer"
                            >
                                Export as JSON
                            </button>

                            {/* <button
                                onClick={handleExportCSV}
                                className="px-5 py-2.5 bg-[#226FA1] hover:bg-[#1c5e8a] text-white font-medium rounded-lg cursor-pointer"
                            >
                                Export as CSV
                            </button> */}
                        </div>
                    </div>

                    {/* Quick Summary Section */}
                    <div className="flex flex-col gap-3">
                        <h1 className="text-xl font-bold">Quick Summary</h1>
                        <span className="text-sm">
                            {
                                dataRecord?.input_summary && dataRecord?.abundance_summary && dataRecord?.confidence_summary ?
                                    `The eDNA analysis of collected deep-sea samples has revealed a diverse community of organisms. A total of ${dataRecord.input_summary.sequences_provided} species were detected, including ${dataRecord.abundance_summary.unique_taxa_count} unique species, with indications of ${dataRecord.confidence_summary.very_low} potential novel discoveries not previously cataloged in reference databases. This dataset highlights the richness of deep-sea biodiversity and provides crucial insights into ecosystem composition and hidden genetic diversity.` :
                                    'Loading analysis summary...'
                            }
                        </span>
                    </div>

                    {/* Biodiversity Insights Section */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl font-bold">Biodiversity Insights</h2>

                        <div className="flex gap-5 w-full">
                            <div className='w-1/3 h-80 border border-[#335266] rounded-lg p-3 flex flex-col justify-between'>
                                <SummaryCard title="Total Species" content={dataRecord?.input_summary?.sequences_provided || 0} />
                                <SummaryCard title="Unique Species" content={dataRecord?.abundance_summary?.unique_taxa_count || 0} />
                                <SummaryCard title="Potential Discovery" content={dataRecord?.confidence_summary?.very_low || 0} />
                            </div>

                            <div className='w-1/3 h-80 border border-[#335266] rounded-lg p-3'>
                                Need to figure out what to put here
                            </div>

                            <div className='w-1/3 h-80 border border-[#335266] rounded-lg p-3'>
                                <h3 className="text-md font-medium">Classification Confidence Levels</h3>
                                <div>
                                    Need to implement bar graph here
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Species card Section */}
                    <div className="flex flex-col gap-3">
                        <h1 className="text-xl font-bold">Species Cards</h1>
                        <span className="text-sm">
                            Explore the biodiversity detected in your samples
                        </span>
                        {/* Sample species grid - replace with real data later */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {dataRecord?.predictions?.map((s: any) => (
                                <SpecieReportCard
                                    key={s.title}
                                    title={s.final_taxonomy}
                                    kingdom={s.taxonomic_lineage.kingdom}
                                    phylum={s.taxonomic_lineage.phylum}
                                    onViewDetails={() => {
                                        console.log('====================================');
                                        console.log("Sending the following data to details page", s);
                                        console.log('====================================');
                                        navigate(`/visual/${s.final_taxonomy}`, { state: { specieData: s, s: s } })
                                    }}
                                />
                            )) || []}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default BriefOutputScreen
