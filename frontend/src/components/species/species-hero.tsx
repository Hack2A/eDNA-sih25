import React from 'react'

interface SpeciesHeroProps {
    commonName?: string | null
    confidence?: number | null
    imageUrl?: string | null
}

const SpeciesHero: React.FC<SpeciesHeroProps> = ({ commonName, confidence, imageUrl }) => {
    const safeCommonName = commonName || 'Unknown Species'
    const safeConfidence = confidence ?? 0
    const formattedConfidence = isNaN(safeConfidence) ? 0 : Math.round(safeConfidence * 100)

    return (
        <div className="relative bg-gradient-to-r from-[#1C2426] to-[#2A3B42] rounded-lg overflow-hidden">
            <div className="flex">
                {/* Species Image
            <div className="w-full h-64 bg-gradient-to-t to-gray-700 relative overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={commonName} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl">🦈</div>
                    </div>
                )}
            </div> */}

                {/* Species Info Overlay */}
                <div className="rounded-lg p-4">
                    <h2 className="text-2xl font-bold text-white break-words">
                        Scientific Name: {safeCommonName}
                    </h2>
                    <p className="text-white">
                        Confidence Score: {formattedConfidence}%
                    </p>
                </div>
            </div>
        </div >
    )
}

export default SpeciesHero