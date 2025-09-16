import React from 'react'

interface FeatureCardProps {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
    return (
        <div className='flex-1 text-gray-300 bg-[#1A2E33] border border-[#335E66] rounded-lg p-6 flex flex-col gap-2'>
            <Icon className='h-6 w-6 text-white' />
            <span className='text-white font-bold text-lg'>{title}</span>
            <span>{description}</span>
        </div>
    )
}

export default FeatureCard