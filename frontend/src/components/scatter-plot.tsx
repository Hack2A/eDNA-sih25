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
                <div className="flex items-center justify-center h-40 text-gray-400">
                    No kingdom data available
                </div>
            </div>
        )
    }

    // Calculate dimensions and scaling
    const maxCount = Math.max(...input.map(item => item.count))
    const padding = { top: 20, right: 20, bottom: 60, left: 50 }
    const chartWidth = 400
    const chartHeight = 250
    const plotWidth = chartWidth - padding.left - padding.right
    const plotHeight = chartHeight - padding.top - padding.bottom

    // Create data points
    const points = input.map((item, index) => {
        const x = padding.left + (index * plotWidth) / (input.length - 1 || 1)
        const y = padding.top + plotHeight - (item.count / maxCount) * plotHeight
        const kingdom = item.kingdom_name || item.kingdom || `Kingdom ${index + 1}`

        return { x, y, count: item.count, kingdom }
    })

    return (
        <div className="w-full h-full text-white">
            <div className="mb-3">
                <h3 className="text-md font-medium text-white">Kingdom Distribution</h3>
                <p className="text-xs text-gray-400">Species count across different biological kingdoms</p>
            </div>

            <div className="w-full h-[calc(100%-2rem)]">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="overflow-visible"
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
                                r={3}
                                fill="#3b82f6"
                                stroke="#60a5fa"
                                strokeWidth={2}
                                className="hover:fill-blue-400 transition-colors cursor-pointer"
                            />

                            {/* Count label above point */}
                            <text
                                x={point.x}
                                y={point.y - 15}
                                fill="white"
                                fontSize={12}
                                fontWeight="600"
                                textAnchor="middle"
                            >
                                {point.count}
                            </text>

                            {/* Kingdom label below */}
                            <text
                                x={point.x}
                                y={chartHeight - padding.bottom + 15}
                                fill="#94a3b8"
                                fontSize={11}
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
