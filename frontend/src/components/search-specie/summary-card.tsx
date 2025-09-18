import React from 'react'

interface SummaryCardProps {
    // Define any props if needed in the future
    title?: string | null;
    content?: string | number | null;
}

const SummaryCard = (props: SummaryCardProps) => {
    const safeTitle = props.title || 'Unknown'
    const safeContent = props.content?.toString() || '0'

    return (
        <div className='bg-[#226FA1] p-4 rounded-lg '>
            <h2 className='text-lg font-bold mb-2'>{safeTitle}</h2>
            <p className='text-white'>{safeContent}</p>
        </div>
    )
}

export default SummaryCard
