import React from 'react'
import { useForm } from 'react-hook-form'

const DataIngestion = () => {
    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            file_type: 'manual',
            data: ''
        }
    })

    const fileType = watch('file_type')

    const onSubmit = (formData: any) => {
        console.log({
            file_type: formData.file_type,
            data: formData.file_type === 'file' ? formData.data[0] : formData.data
        })
    }

    const key_points = [
        { label: 'Confident', range: '90-100 %', description: 'Highly reliable match' },
        { label: 'Likely', range: '60-90 %', description: 'Fairly reliable, minor variation' },
        { label: 'Uncertain', range: '40-60 %', description: 'Ambiguous classification' },
        { label: 'Low', range: '20-40 %', description: 'Weak similarity' },
        { label: 'Very Low', range: '0-20 %', description: 'Little / no match, possible novel organism' }
    ]

    return (
        <div className="w-[80%] flex flex-col justify-center mx-auto text-white my-10 gap-5">

            {/* Heading Section */}
            <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold">Data Ingestion - Upload and Process eDNA Sequences</h1>
                <span className="text-sm">
                    Ingesting your eDNA sequences is the first step towards unlocking the biodiversity insights hidden within your samples. Our platform streamlines this process, allowing you to upload raw eDNA sequences for AI-driven processing. Simply upload your files or input sequences manually, and let our algorithms handle the rest.
                </span>
            </div>

            {/* File Upload Section */}
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">Input Your Data:</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    {/* Radio Button Tabs */}
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="manual"
                                {...register('file_type')}
                                className="w-4 h-4 text-[#226FA1] bg-gray-100 border-gray-300 focus:ring-[#226FA1]"
                            />
                            <span className="text-white font-medium">Enter Manual Sequence</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="file"
                                {...register('file_type')}
                                className="w-4 h-4 text-[#226FA1] bg-gray-100 border-gray-300 focus:ring-[#226FA1]"
                            />
                            <span className="text-white font-medium">Upload a .txt/.csv/.fasta file</span>
                        </label>
                    </div>

                    {/* Conditional Input Section */}
                    {fileType === 'manual' ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-white font-medium">Manual Sequence Input</label>
                            <textarea
                                {...register('data')}
                                placeholder="Enter the DNA sequence..."
                                rows={6}
                                className="w-full h-20 p-4 rounded-lg bg-[#244247] text-white border border-gray-600 resize-vertical"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <label className="text-white font-medium">Upload File</label>
                            <input
                                type="file"
                                accept=".txt,.csv,.fasta,.fa"
                                {...register('data')}
                                className="w-full h-20 p-4 rounded-lg bg-[#244247] text-white border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700"
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="self-end px-8 py-3 bg-[#226FA1] hover:bg-[#1c5e8a] text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Key Points Section */}
            <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">Key Points</h2>

                <div>
                    <h3 className="text-md font-semibold">Confidence Level</h3>
                    <span className="text-[#9EB0BA]">Our AI algorithms provide a confidence score for each species identification, allowing you to assess the reliability of the results.</span>

                    <ul className='list-none mt-4 space-y-3 text-sm'>
                        {key_points.map((kp) => (
                            <li key={kp.label} className='flex items-start gap-3'>
                                <span className='mt-2 block w-2 h-2 rounded-full bg-[#9EB0BA] flex-shrink-0' />
                                <p className='text-[#9EB0BA]'>
                                    <span className='text-white font-semibold'>{kp.label}</span>
                                    <span className='ml-2 text-[#9EB0BA]'>({kp.range}) → {kp.description}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-md font-semibold">Species and Taxonomy Hierarchy</h3>
                    <span className="text-[#9EB0BA]">Explore the identified species and their taxonomic classification, providing a comprehensive view of the biodiversity in your samples.</span>
                </div>

                <div>
                    <h3 className="text-md font-semibold">Novelty Detection</h3>
                    <span className="text-[#9EB0BA]">Our platform can identify potentially novel species or sequences, highlighting areas for further investigation and discovery..</span>
                </div>
            </div>
        </div>
    )
}

export default DataIngestion
