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
        <div className="bg-[#1A2E33] border border-[#335E66] rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Report #{id}</h3>
                    <p className="text-sm" style={{ color: '#91BFC9' }}>{new Date(date).toLocaleDateString()}</p>
                </div>
                <div className={`${status === "error" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"} px-3 py-1 rounded-full text-sm font-medium`}>
                    {status}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{total_species}</div>
                    <div className="text-sm" style={{ color: '#91BFC9' }}>Total Species</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{unique_species}</div>
                    <div className="text-sm" style={{ color: '#91BFC9' }}>Unique Species</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{potential_discoveries}</div>
                    <div className="text-sm" style={{ color: '#91BFC9' }}>Potential Discoveries</div>
                </div>
            </div>
        </div>
    )
}

export default ReportListItem
