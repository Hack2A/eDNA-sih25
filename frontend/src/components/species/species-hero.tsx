import React from 'react'

interface SpeciesHeroProps {
    commonName: string
    confidence: number
    imageUrl?: string
}

const SpeciesHero: React.FC<SpeciesHeroProps> = ({ commonName, confidence, imageUrl }) => {
    return (
        <div className="relative bg-gradient-to-r from-[#1C2426] to-[#2A3B42] rounded-lg overflow-hidden">
            <div className="flex">
                {/* Species Image */}
                <div className="w-full h-64 bg-gradient-to-t to-gray-700 relative overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={commonName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl">🦈</div>
                        </div>
                    )}
                </div>

                {/* Species Info Overlay */}
                <div className="absolute bottom-0 rounded-lg p-4">
                    <h2 className="text-2xl font-bold text-white">
                        Scientific Name: {commonName}
                    </h2>
                    <p className="text-white">
                        Confidence Score: {(confidence) * 100}%
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SpeciesHero