import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import SpeciesCard from '../components/search-specie/specie-card'
import SummaryCard from '../components/search-specie/summary-card';
import FilterDropdown from '../components/search-specie/filter-dropdown';

const SpecieSearch = () => {

    const sampleData = [
        { name: "Common Dolphin", taxonomy: "Mammalia", image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRqqMpavY3T4jGjVYwTCCTh3eivellshGD64R8r1JEuUGePo80DcXTLxtsRlfggN_7vT_KoNwsVVe9Jsd5mDZr4klabSrmGL6xgot8tR8k" },
        { name: "Sea Turtle", taxonomy: "Reptilia", image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQHkYgrL5Yju3v-83fPbximfPVqOXyGuhONO6f6pFPr37IR_4VEtC7p3W0gvLUwW7eHO1HGOisyd36cFrObO2eU2Pczg6sAUD7m7FOD27HmPQ" },
        { name: "Great White Shark", taxonomy: "Chondrichthyes", image: "https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg" },
        { name: "Clownfish", taxonomy: "Actinopterygii", image: "https://www.aquariumofpacific.org/images/made_new/images-uploads-clownfish_400_q85.jpg" },
        { name: "Blue Whale", taxonomy: "Mammalia", image: "https://www.antarctica.gov.au/site/assets/files/45670/ia40342.1200x630.jpg" },
        { name: "Octopus", taxonomy: "Mollusca", image: "https://images.squarespace-cdn.com/content/v1/5bc75d83e4afe931ade4f0d8/a6c5e4c1-7492-447e-b313-5d6ef7c4fbc7/octopus+2.png" },
        { name: "Starfish", taxonomy: "Asteroidea", image: "https://cdn.mos.cms.futurecdn.net/v2/t:0,l:240,cw:1440,ch:1080,q:80,w:1440/BkJN5NBYHTSafdtAfiL42P.jpg" },
        { name: "Jellyfish", taxonomy: "Scyphozoa", image: "https://images.theconversation.com/files/513157/original/file-20230302-28-r91z9l.jpg?ixlib=rb-4.1.0&rect=10%2C0%2C6699%2C4466&q=45&auto=format&w=926&fit=clip" },
        { name: "Seahorse", taxonomy: "Hippocampus", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS56fNwb3t-2l24mdWY5a1U2_Kbd6Y2bGkWvw&s" },
        { name: "Anglerfish", taxonomy: "Lophiiformes", image: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Humpback_anglerfish.png" }
    ];


    return (
        <div className='w-screen h-screen flex items-center justify-center bg-[#131E24] text-white py-5 px-10 gap-5'>
            {/* Left Pane */}
            <div className='h-full w-[20%] flex flex-col px-3 gap-5'>
                <div className='relative'>
                    <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                        type="text"
                        placeholder="Search species"
                        className='w-full p-2 pl-10 rounded-lg bg-[#244247] text-[#91BFC9] focus:outline-none focus:border-blue-800'
                    />
                </div>

                <div className='flex flex-col gap-3'>
                    <h2 className='text-lg font-bold mb-2'>Summary</h2>
                    <SummaryCard title="Total Species" content="120" />
                    <SummaryCard title="Unique Species" content="85" />
                </div>

                <div className='flex flex-col gap-3'>
                    <h2 className='text-lg font-bold mb-2'>Filter</h2>

                    <FilterDropdown
                        title="Taxonomy"
                        options={['Mammalia', 'Reptilia', 'Chondrichthyes', 'Actinopterygii', 'Mollusca', 'Asteroidea', 'Scyphozoa', 'Hippocampus', 'Lophiiformes']}
                        selected={''}
                        setSelected={(value) => { console.log(value) }}
                    />
                    <FilterDropdown
                        title="Abundance"
                        options={['Mammalia', 'Reptilia', 'Chondrichthyes', 'Actinopterygii', 'Mollusca', 'Asteroidea', 'Scyphozoa', 'Hippocampus', 'Lophiiformes']}
                        selected={''}
                        setSelected={(value) => { console.log(value) }}
                    />
                    <FilterDropdown
                        title="AI Confidence"
                        options={['Mammalia', 'Reptilia', 'Chondrichthyes', 'Actinopterygii', 'Mollusca', 'Asteroidea', 'Scyphozoa', 'Hippocampus', 'Lophiiformes']}
                        selected={''}
                        setSelected={(value) => { console.log(value) }}
                    />
                </div>
            </div>

            {/* Right Pane */}
            <div className='h-full w-[80%] flex flex-col gap-10 overflow-y-auto'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-2xl font-bold'>
                        Species Explorer
                    </h1>
                    <h3 className='text-sm'>Explore the biodiversity detected in your samples</h3>
                </div>

                {/* This shows all the species list */}
                <div className='flex flex-wrap overflow-y-visible gap-3'>
                    {sampleData.map((species, idx) => (
                        <SpeciesCard
                            key={idx}
                            name={species.name}
                            taxonomy={species.taxonomy}
                            imageUrl={species.image}
                        />
                    ))}
                </div>
            </div>
        </div >
    )
}

export default SpecieSearch
