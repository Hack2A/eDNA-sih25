const ReportListHeader = () => {
    return (
        <div className="grid grid-cols-6 gap-4 py-3 px-6 border-b-2 border-white font-medium text-white bg-[#121717]">
            <div>Date</div>
            <div>Report ID</div>
            <div className="text-center">Status</div>
            <div className="text-center">Total Species</div>
            <div className="text-center">Unique Species</div>
            <div className="text-center">Discoveries</div>
        </div>
    )
}

export default ReportListHeader;