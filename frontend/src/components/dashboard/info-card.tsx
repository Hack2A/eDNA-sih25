interface InfoCardProps {
    title: string
    content: string
}

const InfoCard = (props: InfoCardProps) => {

    const safeTitle = props.title || 'Unknown'
    const safeContent = props.content || '0'

    return (
        <div>
            {safeTitle}
            {safeContent}
        </div>
    )
}

export default InfoCard
