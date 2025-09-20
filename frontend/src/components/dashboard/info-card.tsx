interface InfoCardProps {
    title: string
    content: string
}

const InfoCard = (props: InfoCardProps) => {

    const safeTitle = props.title || 'Unknown'
    const safeContent = props.content || '0'

    return (
        <div className="w-1/4 bg-[#226FA1] p-6 rounded-lg flex flex-col text-white">
            <span className="">
                {safeTitle}
            </span>
            <span className="text-3xl">
                {safeContent}
            </span>
        </div>
    )
}

export default InfoCard
