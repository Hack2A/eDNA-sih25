import React from 'react'

interface FilterDropdownProps {
    title: string
    options: string[]
    selected: string
    setSelected: (value: string) => void
}

const FilterDropdown = ({ title, options, selected, setSelected }: FilterDropdownProps) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleOptionSelect = (option: string) => {
        setSelected(option)
        setIsOpen(false)
    }

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-[#226FA1] px-3 py-2 text-lg font-semibold text-white cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selected || title}
                    <svg
                        className="-mr-1 h-8 w-8 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilterDropdown
