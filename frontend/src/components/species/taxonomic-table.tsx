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
    taxonomicLineage?: TaxonomicLineage | null
    sequenceLength?: number | null
}

const TaxonomicTable: React.FC<TaxonomicTableProps> = ({ taxonomicLineage, sequenceLength }) => {
    // Handle null/undefined props
    if (!taxonomicLineage) {
        return (
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Taxonomic Information</h2>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="text-gray-400 text-lg mb-2">No taxonomic data available</div>
                        <div className="text-gray-500 text-sm">Please check your data source or try again later</div>
                    </div>
                </div>
            </div>
        )
    }

    const { kingdom, phylum, class: className, order, family, genus, species } = taxonomicLineage
    const speciesDisplay = (!species || species === 'N/A')
        ? `${family || 'Unknown'} ${(taxonomicLineage as any).predicted_genus ?? genus ?? 'sp.'}`
        : species
    const fullLineage = [kingdom, phylum, className, order, family, genus, speciesDisplay]
        .filter(item => item && item !== 'N/A')
        .join(' > ') || 'No lineage data available'

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Taxonomic Information</h2>
            <div className='flex gap-3'>
                {/* This is the written content */}
                <div className="flex flex-col gap-3 py-6 pb-4 w-2/3">
                    <div className="flex justify-between py-3 border-t border-b border-[#154868]">
                        <span className="text-[#9EB0BA]">Kingdom</span>
                        <span className="text-white">{taxonomicLineage.kingdom || 'N/A'}</span>
                    </div>
                    <TaxonomyRow label="Phylum" value={taxonomicLineage.phylum || 'N/A'} />
                    <TaxonomyRow label="Class" value={taxonomicLineage.class || 'N/A'} />
                    <TaxonomyRow label="Order" value={taxonomicLineage.order || 'N/A'} />
                    <TaxonomyRow label="Family" value={taxonomicLineage.family || 'N/A'} />
                    <TaxonomyRow label="Genus" value={taxonomicLineage.genus || 'N/A'} />
                    {/* <div className="flex justify-between py-2 border-b border-[#154868]"> */}
                    {/* <span className="text-[#9EB0BA]">Full Taxonomic Lineage</span> */}
                    {/* <span className="text-white text-sm">{fullLineage}</span> */}
                    {/* </div> */}
                    <div className="flex justify-between py-2 border-b border-[#154868]">
                        <span className="text-[#9EB0BA]">NCBI Taxonomy Link</span>
                        {taxonomicLineage.ncbi_taxonomy_link ? (
                            <a
                                href={taxonomicLineage.ncbi_taxonomy_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline"
                            >
                                NCBI Link
                            </a>
                        ) : (
                            <span className="text-gray-400">Not available</span>
                        )}
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#154868]">
                        <span className="text-[#9EB0BA]">Sequence Length</span>
                        <span className="text-white">{sequenceLength ?? 'N/A'}</span>
                    </div>
                </div>

                {/* This is the taxonomic lineage in visual form */}
                <div className="flex flex-col gap-3 py-6 pb-4 w-1/3 items-center justify-center">
                    {/* <h3 className="text-lg font-semibold text-white mb-4">Taxonomic Tree</h3> */}

                    {/* Tree structure */}
                    <div className="flex flex-col gap-1 text-xl mx-auto justify-center scale-125 items-center">
                        {/* Kingdom */}
                        <div className="flex items-center gap-2">
                            {/* <div className="w-2 h-2 bg-blue-500 rounded-full"></div> */}
                            {/* <span className="text-gray-300 text-xs">Kingdom</span> */}
                            <span className="text-white font-medium">{taxonomicLineage.kingdom || 'N/A'}</span>
                        </div>

                        {/* Phylum */}
                        <div className="flex items-center gap-2">
                            <div className="w-px h-4 bg-gray-600 ml-1"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
                            {/* <span className="text-gray-300 text-xs">Phylum</span> */}
                            <span className="text-white font-medium">{taxonomicLineage.phylum || 'N/A'}</span>
                        </div>

                        {/* Class */}
                        <div className="flex items-center gap-">
                            <div className="w-px h-4 bg-gray-600 ml-1"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <div className="w-2 h-2 bg-yellow-500 rounded-full"></div> */}
                            {/* <span className="text-gray-300 text-xs">Class</span> */}
                            <span className="text-white font-medium">{taxonomicLineage.class || 'N/A'}</span>
                        </div>

                        {/* Order */}
                        <div className="flex items-center gap-2">
                            <div className="w-px h-4 bg-gray-600 ml-1"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <div className="w-2 h-2 bg-orange-500 rounded-full"></div> */}
                            {/* <span className="text-gray-300 text-xs">Order</span> */}
                            <span className="text-white font-medium">{taxonomicLineage.order || 'N/A'}</span>
                        </div>

                        {/* Family */}
                        <div className="flex items-center gap-2">
                            <div className="w-px h-4 bg-gray-600 ml-1"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <div className="w-2 h-2 bg-red-500 rounded-full"></div> */}
                            {/* <span className="text-gray-300 text-xs">Family</span> */}
                            <span className="text-white font-medium">{taxonomicLineage.family || 'N/A'}</span>
                        </div>

                        {/* Genus */}
                        <div className="flex items-center gap-2">
                            <div className="w-px h-4 bg-gray-600 ml-1"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <div className="w-2 h-2 bg-purple-500 rounded-full"></div> */}
                            {/* <span className="text-gray-300 text-xs">Genus</span> */}
                            <span className="text-white font-medium">{taxonomicLineage.genus || 'N/A'}</span>
                        </div>

                        {/* Species */}
                        <div className="flex items-center gap-2">
                            <div className="w-px h-4 bg-gray-600 ml-1"></div>
                        </div>
                        <div className="flex items-center gap-2 w-2/3 text-center">
                            {/* <div className="w-2 h-2 bg-pink-500 rounded-full"></div> */}
                            {/* <span className="text-gray-300 text-xs">Species</span> */}
                            <span className="text-white font-medium break-words">{speciesDisplay || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaxonomicTable