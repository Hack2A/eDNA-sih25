import React from 'react'

interface SummaryCardProps {
    // Define any props if needed in the future
    title: string;
    content: string;
}

const SummaryCard = (props: SummaryCardProps) => {
    return (
        <div className='bg-[#226FA1] p-4 rounded-lg '>
            <h2 className='text-lg font-bold mb-2'>{props.title}</h2>
            <p className='text-white'>{props.content}</p>
        </div>
    )
}

export default SummaryCard
