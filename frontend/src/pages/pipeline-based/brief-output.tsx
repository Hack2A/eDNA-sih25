import SpecieReportCard from '../../components/landing/species-cards'
import SummaryCard from '../../components/search-specie/summary-card'

const BriefOutputScreen = () => {
    window.document.title = "Biodiversity Analysis Report - AquaGenesis"

    const handleExportPDF = () => {
        console.log('Export as PDF clicked')
    }

    const handleExportJSON = () => {
        console.log('Export as JSON clicked')
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

            {/* Export Report Section */}
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">Export Report</h2>
                <div className="flex gap-4">
                    <button
                        onClick={handleExportPDF}
                        className="px-5 py-2.5 bg-[#226FA1] hover:bg-[#1c5e8a] text-white font-medium rounded-lg cursor-pointer"
                    >
                        Export as PDF
                    </button>

                    <button
                        onClick={handleExportJSON}
                        className="px-5 py-2.5 bg-[#226FA1] hover:bg-[#1c5e8a] text-white font-medium rounded-lg cursor-pointer"
                    >
                        Export as JSON
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="px-5 py-2.5 bg-[#226FA1] hover:bg-[#1c5e8a] text-white font-medium rounded-lg cursor-pointer"
                    >
                        Export as CSV
                    </button>
                </div>
            </div>

            {/* Quick Summary Section */}
            <div className="flex flex-col gap-3">
                <h1 className="text-xl font-bold">Quick Summary</h1>
                <span className="text-sm">
                    {
                        `The eDNA analysis of collected deep-sea samples has revealed a diverse community of organisms. A total of ${'{X}'} species were detected, including ${'{Y}'} unique species, with indications of ${'{Z}'} potential novel discoveries not previously cataloged in reference databases. This dataset highlights the richness of deep-sea biodiversity and provides crucial insights into ecosystem composition and hidden genetic diversity.`
                    }
                </span>
            </div>

            {/* Biodiversity Insights Section */}
            <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">Biodiversity Insights</h2>

                <div className="flex gap-5 w-full">
                    <div className='w-1/3 h-80 border border-[#335266] rounded-lg p-3 flex flex-col justify-between'>
                        <SummaryCard title="Total Species" content="120" />
                        <SummaryCard title="Unique Species" content="120" />
                        <SummaryCard title="Potential Discovery" content="120" />
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
                    {[
                        { title: 'Streptomyces sp.', kingdom: 'Bacillati', phylum: 'Actinomycetota' },
                        { title: 'Abyssocladia', kingdom: 'Animalia', phylum: 'Porifera' },
                        { title: 'Peniagone vitrea', kingdom: 'Animalia', phylum: 'Echinodermata' },
                        { title: 'Psychropotes longicauda', kingdom: 'Animalia', phylum: 'Echinodermata' },
                        { title: 'Elpidia glacialis', kingdom: 'Animalia', phylum: 'Echinodermata' },
                        { title: 'Scotoplanes globosas', kingdom: 'Animalia', phylum: 'Echinodermata' }
                    ].map((s) => (
                        <SpecieReportCard
                            key={s.title}
                            title={s.title}
                            kingdom={s.kingdom}
                            phylum={s.phylum}
                            onViewDetails={() => console.log('View Details clicked for', s.title)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BriefOutputScreen
