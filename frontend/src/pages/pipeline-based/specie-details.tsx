import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SpeciesHero from '../../components/species/species-hero'
import TaxonomicTable from '../../components/species/taxonomic-table'
import OverallDetails from '../../components/species/overall-details'

interface TaxonomicLineage {
    kingdom?: string
    phylum?: string
    class?: string
    order?: string
    family?: string
    genus?: string
    species?: string
    ncbi_taxonomy_link?: string
}

interface SpeciesData {
    sequence?: string
    predicted_genus?: string
    final_taxonomy?: string
    confidence?: number
    taxonomic_lineage?: TaxonomicLineage
    sequence_length?: number
    classification_type?: any
}

interface SpecieDetailsProps {
    data?: SpeciesData
}

const SpecieDetails: React.FC<SpecieDetailsProps> = ({ data }) => {
    const location = useLocation()
    const routerData = location.state?.s || location.state?.specieData

    // Scroll to top when this page mounts or when the location changes
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }, [location.pathname, location.key])

    // Handle cases where no data is available at all
    if (!routerData && !data) {
        return (
            <div className="w-[80%] flex flex-col mx-auto text-white my-10 gap-8">
                <h1 className="text-3xl font-bold">Species Details</h1>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="text-2xl font-semibold text-gray-400">No species data available</div>
                    <div className="text-sm text-gray-500">
                        Please navigate to this page from the species report or provide valid species data.
                    </div>
                </div>
            </div>
        )
    }

    const speciesData = routerData || data || {}

    // Safe extraction with fallbacks
    const safeSpeciesData = {
        final_taxonomy: speciesData?.final_taxonomy || 'Unknown Species',
        predicted_genus: speciesData?.predicted_genus || 'Unknown',
        confidence: speciesData?.confidence ?? 0,
        taxonomic_lineage: speciesData?.taxonomic_lineage || {},
        sequence_length: speciesData?.sequence_length || null,
        classification_type: speciesData?.classification_type || 'Unknown'
    }

    window.document.title = `${safeSpeciesData.final_taxonomy} | AquaGenesis`
    // Sample data for testing - will be replaced by props
    const sampleData: SpeciesData = {
        sequence: "AGAGTTTGATCCTGGCTCAGGACGAACGCTGGCGGCGTGCCTAATACATGCAAGTCGAGCGGATGAAGGTTTTCGGATCGGAGTGCTTGCGAAAGGGGAGCGAACAGGATTAGATACCCTGGTAGTCCACGCCGTAAACGATGAGTGCTAGGTGACGGTACCTGAGACACGGCCCAGACTCCTACGGGAGGCAGCAGTGGGGAATATTGGACAATGGGCGAAAGCCTGATGCAGCCATGCCGCGTGTGTGAAGAAGGTCTTCGGATTGTAAAGCACTTTAAGTTGGGAGGAAGGGTACTTACCTAATACGTGAGTATGCGGGACCTTACGGTGTGAGAGGGTTGCCAAGCCGCGAGGTGGAGCTAATCCCATAATGCCGGGGAACGTATTCACCGCGGC",
        predicted_genus: "Great White Shark",
        final_taxonomy: "Carcharodon carcharias",
        confidence: 0.95,
        taxonomic_lineage: {
            kingdom: "Animalia",
            phylum: "Chordata",
            class: "Chondrichthyes",
            order: "Lamniformes",
            family: "Lamnidae",
            genus: "Carcharodon",
            species: "carcharias",
            ncbi_taxonomy_link: "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=7950"
        },
        sequence_length: 1200,
        classification_type: "Confident Match"
    }

    return (
        <div className="w-[80%] flex flex-col mx-auto text-white my-10 gap-8">
            {/* Page Title */}
            <h1 className="text-3xl font-bold">Species Details</h1>

            {/* Hero Section */}
            <SpeciesHero
                commonName={
                    safeSpeciesData?.taxonomic_lineage?.family && safeSpeciesData?.predicted_genus
                        ? `${safeSpeciesData.taxonomic_lineage.family} ${safeSpeciesData.predicted_genus}`
                        : safeSpeciesData?.final_taxonomy || 'Unknown Species'
                }
                confidence={safeSpeciesData.confidence}
            />

            {/* Taxonomic Information */}
            <TaxonomicTable
                taxonomicLineage={safeSpeciesData.taxonomic_lineage}
                sequenceLength={safeSpeciesData.sequence_length}
            />

            {/* Overall Details */}
            {/* <OverallDetails
                genus={safeSpeciesData.predicted_genus}
                classificationType={safeSpeciesData.classification_type}
            /> */}
        </div>
    )
}

export default SpecieDetails
