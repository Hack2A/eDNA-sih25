import React from 'react'

interface OverallDetailsProps {
    genus: string
    classificationType: string
    description?: string
}

const OverallDetails: React.FC<OverallDetailsProps> = ({
    genus,
    classificationType,
    description
}) => {
    const defaultDescription = `The ${genus}, a ${classificationType.toLowerCase()}, is found in various environments worldwide. It plays a crucial role in its ecosystem. Known for its distinctive characteristics and streamlined body, it primarily feeds on various organisms. Its presence is often an indicator of a healthy marine environment.`

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Overall Details</h2>
            <div className="rounded-lg p-6 px-0">
                <p className="text-[#9EB0BA] leading-relaxed">
                    {description || defaultDescription}
                </p>
            </div>
        </div>
    )
}

export default OverallDetails