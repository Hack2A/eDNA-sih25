import React from 'react'

interface SpecieReportCardProps {
    title: string
    kingdom?: string
    phylum?: string
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
    return (
        <div className="relative bg-[#1C2426] rounded-lg p-5 border border-[#3B4A54] w-full max-w-xs flex flex-col justify-between">
            <div className="flex items-start gap-3">
                <div className="text-white/90">{icon ?? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                        <path d="M21 12s-3-3.5-7-4c-1.5-.2-3 .5-4 1.2C6.5 10 3 12 3 12s3 2 7 2c1 .1 2.5 1.2 4 1 4-.5 7-3 7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="8.5" cy="12" r="0.9" fill="currentColor" />
                        <path d="M16 8l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}</div>

                <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{title}</h3>
                    {kingdom && <div className="text-[#9EB0BA] mt-2">Kingdom: <span className="text-[#BFD3D8]">{kingdom}</span></div>}
                    {phylum && <div className="text-[#9EB0BA]">Phylum: <span className="text-[#BFD3D8]">{phylum}</span></div>}
                </div>
            </div>

            <div className="w-full flex justify-end mt-4">
                <button
                    onClick={() => onViewDetails?.()}
                    className="px-4 py-2 bg-[#226FA1] hover:bg-[#1c5e8a] text-white rounded-md text-sm cursor-pointer"
                >
                    {viewButtonText}
                </button>
            </div>
        </div>
    )
}

export default SpecieReportCard
