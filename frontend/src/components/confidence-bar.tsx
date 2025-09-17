import React from 'react'

interface ConfidenceData {
    confident_match?: number
    likely_match?: number
    low_confidence?: number
    uncertain_match?: number
    very_low?: number
    very_high?: number
    high?: number
    moderate?: number
    low?: number
}

interface ConfidenceBarProps {
    data?: ConfidenceData | null
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ data }) => {
    // Handle null/undefined data
    if (!data) {
        return (
            <div className="w-full h-full flex flex-col p-2">
                <h3 className="text-md font-medium mb-2">Classification Confidence Levels</h3>
                <div className="flex-1 flex items-center justify-center text-gray-400 text-center">
                    <div>
                        <div className="text-lg mb-1">No confidence data available</div>
                        <div className="text-xs">Analysis results are being processed</div>
                    </div>
                </div>
            </div>
        )
    }

    // Normalize data structure - handle different possible field names
    const safeData = {
        confident_match: data.confident_match ?? data.very_high ?? 0,
        likely_match: data.likely_match ?? data.high ?? 0,
        low_confidence: data.low_confidence ?? data.moderate ?? 0,
        uncertain_match: data.uncertain_match ?? data.low ?? 0,
        very_low: data.very_low ?? 0,
    }

    const confidenceData = [
        { label: 'Confident Match', value: safeData.confident_match, color: '#22C55E' },
        { label: 'Likely Match', value: safeData.likely_match, color: '#84CC16' },
        { label: 'Low Confidence', value: safeData.low_confidence, color: '#EAB308' },
        { label: 'Uncertain Match', value: safeData.uncertain_match, color: '#F97316' },
        { label: 'Very Low', value: safeData.very_low, color: '#EF4444' },
    ]

    // Safely calculate max and total values
    const validValues = confidenceData.map(item => item.value).filter(val => typeof val === 'number' && !isNaN(val))
    const maxValue = validValues.length > 0 ? Math.max(...validValues) : 0
    const totalValue = validValues.reduce((sum, val) => sum + val, 0)

    return (
        <div className="w-full h-full flex flex-col p-2">
            <div className="flex-1 flex flex-col justify-between py-2">
                {confidenceData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 mb-3">
                        {/* Label */}
                        <div className="w-20 text-xs text-gray-300 text-right leading-tight">
                            {item.label}
                        </div>

                        {/* Bar container */}
                        <div className="flex-1 relative">
                            <div className="w-full bg-gray-700 rounded-md h-8 relative overflow-hidden">
                                {/* Bar fill */}
                                <div
                                    className="h-full rounded-md transition-all duration-500 ease-out flex items-center justify-end pr-2"
                                    style={{
                                        backgroundColor: item.color,
                                        width: maxValue > 0 && item.value > 0 ? `${(item.value / maxValue) * 100}%` : '0%',
                                        minWidth: item.value > 0 ? '24px' : '0px'
                                    }}
                                >
                                    {/* Value text */}
                                    {item.value > 0 && (
                                        <span className="text-xs font-semibold text-white">
                                            {item.value}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Percentage */}
                        <div className="w-12 text-xs text-gray-400 font-medium">
                            {totalValue > 0 && item.value > 0 ? Math.round((item.value / totalValue) * 100) : 0}%
                        </div>
                    </div>
                ))}
            </div>

            {/* Total count */}
            <div className="mt-auto pt-3 pb-3 border-t border-gray-600 text-xs text-gray-400 font-medium">
                Total Species: {totalValue}
            </div>
        </div>
    )
}

export default ConfidenceBar
