import React from 'react'

interface ReportListItemProps {
    date: string;
    id: number;
    total_species: number;
    unique_species: number;
    potential_discoveries: number;
    status: string;
}

const ReportListItem = ({ date, id, total_species, unique_species, potential_discoveries, status }: ReportListItemProps) => {
    return (
        <div className="grid grid-cols-6 gap-4 py-4 px-6 border-b border-white hover:bg-[#1A2E33] transition-colors duration-200"
            onClick={() => { }}
        >
            <div className="text-sm" style={{ color: '#91BFC9' }}>
                {new Date(date).toLocaleDateString()}
            </div>

            <div className="text-sm" style={{ color: '#91BFC9' }}>
                RPT-{String(id).padStart(3, '0')}
            </div>

            <div className="flex justify-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === "error" || status === "Fail"
                    ? "text-white"
                    : "text-white"
                    }`} style={{
                        backgroundColor: status === "error" || status === "Fail" ? '#AF0A0D' : '#008000'
                    }}>
                    {status === "error" ? "Fail" : status}
                </span>
            </div>

            <div className="text-sm text-center" style={{ color: '#91BFC9' }}>
                {total_species}
            </div>

            <div className="text-sm text-center" style={{ color: '#91BFC9' }}>
                {unique_species}
            </div>

            <div className="text-sm text-center" style={{ color: '#91BFC9' }}>
                {potential_discoveries}
            </div>
        </div>
    )
}

export default ReportListItem