import React from 'react'
import TaxonomyRow from './taxonomy-row'

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

interface TaxonomicTableProps {
    taxonomicLineage: TaxonomicLineage
    sequenceLength: number
}

const TaxonomicTable: React.FC<TaxonomicTableProps> = ({ taxonomicLineage, sequenceLength }) => {
    const { kingdom, phylum, class: className, order, family, genus, species } = taxonomicLineage
    const speciesDisplay = species === 'N/A'
        ? `${family} ${(taxonomicLineage as any).predicted_genus ?? genus}`
        : species
    const fullLineage = [kingdom, phylum, className, order, family, genus, speciesDisplay]
        .filter(Boolean)
        .join(' > ')

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Taxonomic Information</h2>

            <div className="flex flex-col gap-3 py-6 pb-4">
                <div className="flex justify-between py-3 border-t border-b border-[#154868]">
                    <span className="text-[#9EB0BA]">Kingdom</span>
                    <span className="text-white">{taxonomicLineage.kingdom}</span>
                </div>
                <TaxonomyRow label="Phylum" value={taxonomicLineage.phylum} />
                <TaxonomyRow label="Class" value={taxonomicLineage.class} />
                <TaxonomyRow label="Order" value={taxonomicLineage.order} />
                <TaxonomyRow label="Family" value={taxonomicLineage.family} />
                <TaxonomyRow label="Genus" value={taxonomicLineage.genus} />
                <div className="flex justify-between py-2 border-b border-[#154868]">
                    <span className="text-[#9EB0BA]">Full Taxonomic Lineage</span>
                    <span className="text-white text-sm">{fullLineage}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#154868]">
                    <span className="text-[#9EB0BA]">NCBI Taxonomy Link</span>
                    <a
                        href={taxonomicLineage.ncbi_taxonomy_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        NCBI Link
                    </a>
                </div>
                <div className="flex justify-between py-2 border-b border-[#154868]">
                    <span className="text-[#9EB0BA]">Sequence Length</span>
                    <span className="text-white">{sequenceLength}</span>
                </div>
            </div>
        </div>
    )
}

export default TaxonomicTable