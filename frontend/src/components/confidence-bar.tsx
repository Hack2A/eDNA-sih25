import React from 'react'

interface ConfidenceData {
    confident_match: number
    likely_match: number
    low_confidence: number
    uncertain_match: number
    very_low: number
}

interface ConfidenceBarProps {
    data: ConfidenceData
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ data }) => {
    const confidenceData = [
        { label: 'Confident Match', value: data.confident_match, color: '#22C55E' },
        { label: 'Likely Match', value: data.likely_match, color: '#84CC16' },
        { label: 'Low Confidence', value: data.low_confidence, color: '#EAB308' },
        { label: 'Uncertain Match', value: data.uncertain_match, color: '#F97316' },
        { label: 'Very Low', value: data.very_low, color: '#EF4444' },
    ]

    const maxValue = Math.max(...confidenceData.map(item => item.value))
    const totalValue = confidenceData.reduce((sum, item) => sum + item.value, 0)

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
                                        width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%',
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
                            {totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0}%
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
