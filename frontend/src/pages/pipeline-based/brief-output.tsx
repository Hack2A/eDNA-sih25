import { useEffect, useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SpecieReportCard from '../../components/landing/species-cards'
import SummaryCard from '../../components/search-specie/summary-card'
import { dataRetrievalService } from '../../services/dataRetreiveService'
import ScatterPlot from '../../components/scatter-plot'
import ConfidenceBar from '../../components/confidence-bar'

const BriefOutputScreen = () => {
    window.document.title = "Biodiversity Analysis Report | AquaGenesis"
    const [dataRecord, setDataRecord] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Check if state is present from navigation
        if (location.state && Object.keys(location.state).length > 0) {
            setDataRecord(location.state.response);
        } else {
            setIsLoading(true);
            dataRetrievalService.fetchLastReports()
                .then(response => {
                    setDataRecord(response.data.latest_result.result_json);
                })
                .catch(error => {
                    console.error('Error fetching latest report:', error);
                    // Handle error (e.g., show error message)
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [location.state])

    // Sample kingdom data (6 kingdoms) with deterministic random counts between 5 and 15
    const sampleKingdomData = useMemo(() => {
        const kingdoms = ['Animalia', 'Plantae', 'Fungi', 'Protista', 'Bacteria', 'Archaea']
        // deterministic pseudo-random counts for now (simple hash based on kingdom name)
        return kingdoms.map((k, i) => ({
            kingdom: k,
            count: 5 + ((k.charCodeAt(0) + i * 7) % 11) // yields values in 5..15
        }))
    }, [])

    // const handleExportPDF = () => {
    //     console.log(dataRecord)
    // }

    const handleExportJSON = () => {
        if (!dataRecord) {
            console.error('No data available to export');
            alert('No data available to export. Please wait for the analysis to complete.');
            return;
        }

        try {
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
        } catch (error) {
            console.error('Error exporting JSON:', error);
            alert('Failed to export data. Please try again.');
        }
    }

    // const handleExportCSV = () => {
    //     console.log('Export as CSV clicked')
    // }

    return (
        <div className="w-[80%] flex flex-col justify-center mx-auto text-white my-10 gap-10">

            {/* Heading Section */}
            <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold">Biodiversity Analysis Report</h1>
                <span className="text-sm">
                    Dive into the depths of your eDNA data with our comprehensive analysis report. Uncover the hidden biodiversity within your samples, from species identification to taxonomic classification and potential novel discoveries.
                </span>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1C2426] p-8 rounded-lg border border-[#335266] shadow-2xl">
                        <div className="flex flex-col items-center gap-4">
                            {/* Spinner */}
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#226FA1]"></div>

                            {/* Loading Text */}
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-white mb-2">Processing Analysis</h3>
                                <p className="text-gray-400 text-sm">
                                    Fetching your biodiversity analysis results...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Conditional Rendering based on data availability */}
            {!dataRecord && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="text-2xl font-semibold text-gray-400">No data set found initially</div>
                    <div className="text-sm text-gray-500">Please wait while we load your analysis results...</div>
                </div>
            ) : dataRecord ? (
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
                                dataRecord?.input_summary?.sequences_provided &&
                                    dataRecord?.abundance_summary?.unique_taxa_count &&
                                    dataRecord?.confidence_summary?.very_low !== undefined ?
                                    `The eDNA analysis of collected deep-sea samples has revealed a diverse community of organisms. A total of ${dataRecord.input_summary.sequences_provided} species were detected, including ${dataRecord.abundance_summary.unique_taxa_count} unique species, with indications of ${dataRecord.confidence_summary.very_low} potential novel discoveries not previously cataloged in reference databases. This dataset highlights the richness of deep-sea biodiversity and provides crucial insights into ecosystem composition and hidden genetic diversity.` :
                                    'Analysis summary is being generated from available data. Some details may be incomplete while processing continues.'
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
                                <ScatterPlot data={
                                    dataRecord?.kingdom_summary && Array.isArray(dataRecord.kingdom_summary) && dataRecord.kingdom_summary.length > 0
                                        ? dataRecord.kingdom_summary
                                        : sampleKingdomData
                                } />
                            </div>

                            <div className='w-1/3 h-80 border border-[#335266] rounded-lg p-3'>
                                <h3 className="text-md font-medium">Classification Confidence Levels</h3>
                                <ConfidenceBar data={dataRecord?.confidence_summary || { very_high: 0, high: 0, moderate: 0, low: 0, very_low: 0 }} />
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
                            {dataRecord?.predictions && Array.isArray(dataRecord.predictions) && dataRecord.predictions.length > 0 ? (
                                dataRecord.predictions.map((s: any, index: number) => (
                                    <SpecieReportCard
                                        key={s?.title || s?.final_taxonomy || `species-${index}`}
                                        title={s?.final_taxonomy || 'Unknown Species'}
                                        kingdom={s?.taxonomic_lineage?.kingdom || 'Unknown Kingdom'}
                                        phylum={s?.taxonomic_lineage?.phylum || 'Unknown Phylum'}
                                        onViewDetails={() => {
                                            console.log('====================================');
                                            console.log("Sending the following data to details page", s);
                                            console.log('====================================');
                                            navigate(`/visual/${s?.final_taxonomy || 'unknown'}`, { state: { specieData: s, s: s } })
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                    <div className="text-gray-400 text-lg mb-2">No species data available</div>
                                    <div className="text-gray-500 text-sm">
                                        {dataRecord ?
                                            'The analysis is complete but no species predictions were found in this sample.' :
                                            'Waiting for analysis results to load...'
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default BriefOutputScreen
