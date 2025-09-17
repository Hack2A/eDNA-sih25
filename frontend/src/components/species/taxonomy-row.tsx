import React from 'react'

interface TaxonomyRowProps {
    label?: string
    value?: string | null
    isLink?: boolean
    href?: string | null
}

const TaxonomyRow: React.FC<TaxonomyRowProps> = ({ label, value, isLink = false, href }) => {
    // Handle null/undefined values with fallbacks
    const safeLabel = label || 'Unknown Field'
    const safeValue = value || 'N/A'
    const safeHref = href || ''

    return (
        <div className="flex justify-between py-3 border-b border-[#154868]">
            <span className="text-[#9EB0BA]">{safeLabel}</span>
            {isLink && safeHref && safeValue !== 'N/A' ? (
                <a
                    href={safeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                >
                    {safeValue}
                </a>
            ) : (
                <span className={`${safeValue === 'N/A' ? 'text-gray-400' : 'text-white'}`}>
                    {safeValue}
                </span>
            )}
        </div>
    )
}

export default TaxonomyRow