import React from 'react'

interface SpecieCardProps {
    // Define any props if needed in the future
    imageUrl?: string;
    name?: string;
    taxonomy?: string;
}

const SpeciesCard = (props: SpecieCardProps) => {
    return (
        <div className='w-fit h-fit bg-transparent rounded flex flex-col py-2 gap-2'>
            <div className='w-45 h-45 bg-gray-600 rounded-xl'
                style={{ backgroundImage: `url(${props.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            </div>
            <div className='flex flex-col'>
                <span className='font-bold text-lg'>{props.name || 'Species Name'}</span>
                <span className='text-sm text-[#91BFC9]'>{props.taxonomy || 'Taxonomy Info'}</span>
            </div>
        </div>
    )
}

export default SpeciesCard
