import React from 'react'
import dnasvg from '../../assets/dna-svgrepo-com.svg'

interface SpecieReportCardProps {
    title?: string
    kingdom?: string | null
    phylum?: string | null
    // optional icon (React node) to display in the top-left
    icon?: React.ReactNode
    // callback when the button is clicked
    onViewDetails?: () => void
    // optional button label
    viewButtonText?: string
}

const SpecieReportCard: React.FC<SpecieReportCardProps> = ({
    title,
    kingdom,
    phylum,
    icon,
    onViewDetails,
    viewButtonText = 'View Details'
}) => {
    // Safe extraction with fallbacks
    const safeTitle = title || 'Unknown Species'
    const safeKingdom = kingdom || 'Unknown Kingdom'
    const safePhylum = phylum || 'Unknown Phylum'

    return (
        <div className="relative bg-[#1C2426] rounded-lg p-5 border border-[#3B4A54] w-full max-w-xs flex flex-col justify-between">
            <div className="flex items-start gap-3">
                {icon || <img src={dnasvg} alt="dna" className='w-10 text-white' />}

                <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg break-words">{safeTitle}</h3>
                    <div className="text-[#9EB0BA] mt-2">
                        Kingdom: <span className={`${kingdom ? 'text-[#BFD3D8]' : 'text-gray-400'}`}>{safeKingdom}</span>
                    </div>
                    <div className="text-[#9EB0BA]">
                        Phylum: <span className={`${phylum ? 'text-[#BFD3D8]' : 'text-gray-400'}`}>{safePhylum}</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-end mt-4">
                <button
                    onClick={() => onViewDetails?.()}
                    className="px-4 py-2 bg-[#226FA1] hover:bg-[#1c5e8a] text-white rounded-md text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!onViewDetails}
                >
                    {viewButtonText}
                </button>
            </div>
        </div>
    )
}

export default SpecieReportCard
