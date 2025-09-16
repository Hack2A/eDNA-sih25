import React from 'react'

interface BenefitCardProps {
    image: string
    alt: string
    title: string
    description: string
}

const BenefitCard: React.FC<BenefitCardProps> = ({ image, alt, title, description }) => {
    return (
        <div className='flex-1 rounded-xl overflow-hidden'>
            <div className='h-48 overflow-hidden'>
                <img src={image} alt={alt} className='w-full h-full object-cover' />
            </div>
            <div className='py-6'>
                <h3 className='text-white font-bold text-xl mb-2'>{title}</h3>
                <p className='text-gray-300 text-sm'>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default BenefitCard