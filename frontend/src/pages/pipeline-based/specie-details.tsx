import React from 'react'
import { useLocation } from 'react-router-dom'
import SpeciesHero from '../../components/species/species-hero'
import TaxonomicTable from '../../components/species/taxonomic-table'
import OverallDetails from '../../components/species/overall-details'

interface TaxonomicLineage {
    kingdom: string
    phylum: string
    class: string
    order: string
    family: string
    genus: string
    species: string
    ncbi_taxonomy_link: string
}

interface SpeciesData {
    sequence: string
    predicted_genus: string
    final_taxonomy: string
    confidence: number
    taxonomic_lineage: TaxonomicLineage
    sequence_length: number
    classification_type: any
}

interface SpecieDetailsProps {
    data?: SpeciesData
}

const SpecieDetails: React.FC<SpecieDetailsProps> = ({ data }) => {
    const location = useLocation()
    const routerData = location.state?.s || location.state?.specieData

    window.document.title = `${routerData?.final_taxonomy || data?.final_taxonomy} | AquaGenesis`
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

    const speciesData = routerData || data || sampleData

    return (
        <div className="w-[80%] flex flex-col mx-auto text-white my-10 gap-8">
            {/* Page Title */}
            <h1 className="text-3xl font-bold">Species Details</h1>

            {/* Hero Section */}
            <SpeciesHero
                commonName={speciesData.predicted_genus}
                confidence={speciesData.confidence}
            />

            {/* Taxonomic Information */}
            <TaxonomicTable
                taxonomicLineage={speciesData.taxonomic_lineage}
                sequenceLength={speciesData.sequence_length}
            />

            {/* Overall Details */}
            <OverallDetails
                genus={speciesData.predicted_genus}
                classificationType={speciesData.classification_type}
            />
        </div>
    )
}

export default SpecieDetails
