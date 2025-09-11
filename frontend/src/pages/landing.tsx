import React from 'react'
import heroBg from '../assets/stocks/hero-bg.png'

import about1 from '../assets/stocks/about1.png'
import about2 from '../assets/stocks/about2.png'
import about3 from '../assets/stocks/about3.png'
import about4 from '../assets/stocks/about4.png'

import AboutCard from '../components/landing/about-cards'
import Footer from '../components/landing/footer'

const Landing = () => {
    const aboutCardsData = [
        {
            id: 1,
            image: about1,
            title: "Revolutionizing Biodiversity Monitoring",
            description: "Provides unparalleled insights into species distribution and ecosystem health.",
            bgColor: "bg-blue-800"
        },
        {
            id: 2,
            image: about2,
            title: "Novel Species Discovery",
            description: "Uncover previously unknown species and gain deeper insights into ecosystem dynamics.",
            bgColor: "bg-green-800"
        },
        {
            id: 3,
            image: about3,
            title: "Conservation Insights",
            description: "Inform conservation efforts with accurate and comprehensive biodiversity data.",
            bgColor: "bg-orange-800"
        },
        {
            id: 4,
            image: about4,
            title: "Non-invasive Sampling",
            description: "eDNA analysis allows for biodiversity monitoring without disturbing marine life.",
            bgColor: "bg-purple-800"
        }
    ]

    return (
        <div className='w-full min-h-screen bg-[#131E24] text-white py-5 px-10 flex flex-col gap-10'>
            {/* Hero Section */}
            <section
                className='relative w-full h-[60vh] flex flex-col justify-center items-center px-8 py-10 bg-cover bg-center bg-no-repeat rounded-lg'
                style={{
                    backgroundImage: `linear-gradient(rgba(19, 30, 36, 0.7), rgba(19, 30, 36, 0.7)), url(${heroBg})`,
                }}
            >
                <div className='relative z-10 flex flex-col justify-center items-center h-full text-center space-y-8'>
                    <div className='max-w-4xl'>
                        <h1 className='text-4xl font-bold leading-tight mb-6'>
                            Discover the Hidden Biodiversity of the Deep Ocean with AI
                        </h1>
                        <p className='text-lg text-gray-200 max-w-3xl mx-auto'>
                            AI-powered eDNA analysis to uncover species richness and monitor ecosystems.
                        </p>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-4'>
                        <button className='px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer'>
                            Explore Dashboard
                        </button>
                        <button className='px-8 py-3 bg-[#213D4A] text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer'>
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* About eDNA Section */}
            <section className='w-full flex flex-col justify-center items-center'>
                <div className='mx-auto space-y-12 px-4'>
                    <div className=''>
                        <h2 className='text-3xl font-bold mb-4'>About eDNA</h2>
                        <p className='text-gray-300 mb-12'>
                            Environmental DNA (eDNA) analysis is a revolutionary technique that allows us to detect the presence of species in an environment by analyzing traces of their DNA left behind in water samples. This non-invasive method provides unprecedented insights into biodiversity, enabling us to monitor ecosystems with minimal disturbance.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[75%] mx-auto'>
                        {aboutCardsData.map((card) => (
                            <AboutCard
                                key={card.id}
                                image={card.image}
                                title={card.title}
                                description={card.description}
                                bgColor={card.bgColor}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Landing
