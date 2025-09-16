import React from 'react'

interface SectionProps {
    title: string
    children: React.ReactNode
    className?: string
}

const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => {
    return (
        <section className={`w-[80%] flex flex-col justify-center mx-auto ${className}`}>
            <h2 className='text-3xl font-bold mb-5'>{title}</h2>
            {children}
        </section>
    )
}

export default Section