interface AboutCardProps {
    image: string
    title: string
    description: string
    bgColor: string
}

const AboutCard = ({ image, title, description, bgColor }: AboutCardProps) => {
    return (
        <div className='bg-transparent p-6 rounded-lg text-center'>
            <div className={`w-full h-40 ${bgColor} rounded-lg mb-4 flex items-center justify-center overflow-hidden`}>
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <h3 className='font-semibold mb-2'>{title}</h3>
            <p className='text-sm text-[#8FB8CC]'>{description}</p>
        </div>
    )
}

export default AboutCard
