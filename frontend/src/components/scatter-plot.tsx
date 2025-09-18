import React from 'react'

interface KingdomData {
    kingdom_name?: string
    kingdom?: string
    count: number
}

interface ScatterPlotProps {
    data?: KingdomData[] | any
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
    // Defensive: ensure we have an array with actual data
    const input: KingdomData[] = Array.isArray(data) && data.length > 0 ? data : []

    // Debug log to see what we're receiving
    console.log('ScatterPlot received data:', data, 'processed input:', input)

    if (input.length === 0) {
        return (
            <div className="w-full h-full text-white">
                <div className="mb-3">
                    <h3 className="text-md font-medium text-white">Kingdom Distribution</h3>
                    <p className="text-xs text-gray-400">Species count across different biological kingdoms</p>
                </div>
                <div className="flex items-center justify-center h-40 text-gray-400 text-center">
                    <div>
                        <div className="text-lg mb-1">No kingdom data available</div>
                        <div className="text-xs">Data is being processed or no species were detected</div>
                    </div>
                </div>
            </div>
        )
    }

    // Validate and sanitize data points
    const validInput = input.filter(item =>
        item &&
        typeof item.count === 'number' &&
        !isNaN(item.count) &&
        item.count >= 0
    ).map(item => ({
        ...item,
        count: Math.max(0, item.count || 0), // Ensure non-negative count
        kingdom_name: item.kingdom_name || item.kingdom || 'Unknown Kingdom'
    }))

    if (validInput.length === 0) {
        return (
            <div className="w-full h-full text-white">
                <div className="mb-3">
                    <h3 className="text-md font-medium text-white">Kingdom Distribution</h3>
                    <p className="text-xs text-gray-400">Species count across different biological kingdoms</p>
                </div>
                <div className="flex items-center justify-center h-40 text-gray-400 text-center">
                    <div>
                        <div className="text-lg mb-1">Invalid data format</div>
                        <div className="text-xs">Unable to process the provided kingdom data</div>
                    </div>
                </div>
            </div>
        )
    }

    // Calculate dimensions and scaling with fallback for edge cases
    const maxCount = Math.max(...validInput.map(item => item.count), 1) // Minimum of 1 to avoid division by zero
    const padding = { top: 30, right: 30, bottom: 80, left: 60 }
    const chartWidth = 480
    const chartHeight = 300
    const plotWidth = chartWidth - padding.left - padding.right
    const plotHeight = chartHeight - padding.top - padding.bottom

    // Create data points with better spacing
    const points = validInput.map((item, index) => {
        // Spread points evenly across the width
        const x = padding.left + (index * plotWidth) / Math.max(validInput.length - 1, 1)
        // Use full height range, ensuring points don't go below minimum
        const y = padding.top + plotHeight - (item.count / maxCount) * plotHeight * 0.9 // Use 90% of height for better spacing
        const kingdom = item.kingdom_name || item.kingdom || `Kingdom ${index + 1}`

        return { x, y, count: item.count, kingdom }
    })

    return (
        <div className="w-full h-full flex flex-col text-white">
            <div className="mb-2 flex-shrink-0">
                <h3 className="text-md font-medium text-white">Kingdom Distribution</h3>
                <p className="text-xs text-gray-400">Species count across different biological kingdoms</p>
            </div>

            <div className="flex-1 min-h-0 w-full">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Background */}
                    <rect
                        x={0}
                        y={0}
                        width={chartWidth}
                        height={chartHeight}
                        fill="#0f172a"
                        rx={8}
                    />

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = padding.top + plotHeight - ratio * plotHeight
                        return (
                            <line
                                key={i}
                                x1={padding.left}
                                x2={chartWidth - padding.right}
                                y1={y}
                                y2={y}
                                stroke="#334155"
                                strokeWidth={1}
                                opacity={0.3}
                            />
                        )
                    })}

                    {/* Y-axis labels */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = padding.top + plotHeight - ratio * plotHeight
                        const value = Math.round(ratio * maxCount)
                        return (
                            <text
                                key={i}
                                x={padding.left - 10}
                                y={y + 4}
                                fill="#94a3b8"
                                fontSize={12}
                                textAnchor="end"
                            >
                                {value}
                            </text>
                        )
                    })}

                    {/* Data points */}
                    {points.map((point, index) => (
                        <g key={index}>
                            {/* Point */}
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r={5}
                                fill="#3b82f6"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                className="hover:fill-blue-400 transition-colors cursor-pointer"
                            />

                            {/* Count label above point */}
                            <text
                                x={point.x}
                                y={point.y - 18}
                                fill="white"
                                fontSize={13}
                                fontWeight="600"
                                textAnchor="middle"
                            >
                                {point.count}
                            </text>

                            {/* Kingdom label below */}
                            <text
                                x={point.x}
                                y={chartHeight - padding.bottom + 20}
                                fill="#94a3b8"
                                fontSize={12}
                                textAnchor="middle"
                                transform={`rotate(-45, ${point.x}, ${chartHeight - padding.bottom + 15})`}
                            >
                                {point.kingdom}
                            </text>
                        </g>
                    ))}

                    {/* Axis labels */}
                    <text
                        x={chartWidth / 2}
                        y={chartHeight - 10}
                        fill="#94a3b8"
                        fontSize={12}
                        textAnchor="middle"
                        fontWeight="500"
                    >
                        Biological Kingdoms
                    </text>

                    <text
                        x={15}
                        y={chartHeight / 2}
                        fill="#94a3b8"
                        fontSize={12}
                        textAnchor="middle"
                        fontWeight="500"
                        transform={`rotate(-90, 15, ${chartHeight / 2})`}
                    >
                        Species Count
                    </text>
                </svg>
            </div>
        </div>
    )
}

export default ScatterPlot
