import React from 'react'

interface TaxonomyRowProps {
    label: string
    value: string
    isLink?: boolean
    href?: string
}

const TaxonomyRow: React.FC<TaxonomyRowProps> = ({ label, value, isLink = false, href }) => {
    return (
        <div className="flex justify-between py-3 border-b border-[#154868]">
            <span className="text-[#9EB0BA]">{label}</span>
            {isLink && href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                >
                    {value}
                </a>
            ) : (
                <span className="text-white">{value}</span>
            )}
        </div>
    )
}

export default TaxonomyRow