
import heroBg from '../assets/stocks/hero-bg.mp4'

import b1 from '../assets/stocks/b1.png'
import b2 from '../assets/stocks/b2.png'
import b3 from '../assets/stocks/b3.png'

import Footer from '../components/landing/footer'
import Section from '../components/landing/section'
import FeatureCard from '../components/landing/feature-card'
import BenefitCard from '../components/landing/benefit-card'
import { ChartBarIcon, Cog6ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

// Data arrays for modular components
const featuresData = [
    {
        id: 1,
        icon: MagnifyingGlassIcon,
        title: 'Advanced Species Identification',
        description: 'Our platform uses cutting-edge AI algorithms to accurately identify species from eDNA samples, even in complex environments.'
    },
    {
        id: 2,
        icon: ChartBarIcon,
        title: 'Biodiversity Monitoring',
        description: 'Track changes in biodiversity over time with our comprehensive monitoring tools, enabling informed conservation decisions.'
    },
    {
        id: 3,
        icon: Cog6ToothIcon,
        title: 'Customizable Reporting',
        description: 'Generate customized reports tailored to your specific needs, with detailed analysis and visualizations of eDNA data.'
    }
]

const benefitsData = [
    {
        id: 1,
        image: b1,
        alt: 'Comprehensive Biodiversity Insights',
        title: 'Comprehensive Biodiversity Insights',
        description: 'Gain a holistic understanding of marine ecosystems with detailed species identification, abundance estimation, and ecosystem health monitoring.'
    },
    {
        id: 2,
        image: b2,
        alt: 'Rapid and Accurate Analysis',
        title: 'Rapid and Accurate Analysis',
        description: 'Our AI-powered platform delivers rapid and accurate eDNA analysis, providing actionable insights in a fraction of the time compared to traditional methods.'
    },
    {
        id: 3,
        image: b3,
        alt: 'Empowering Conservation Efforts',
        title: 'Empowering Conservation Efforts',
        description: 'Our platform empowers conservationists, researchers, and policymakers with the data needed to make informed decisions and implement effective conservation strategies.'
    }
]

const Landing = () => {
    window.document.title = "AquaGenesis"

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }, [location.pathname])

    return (
        <div className='w-full min-h-screen bg-[#131E24] text-white flex flex-col gap-10'>
            {/* Hero Section */}
            <section
                className='relative w-full h-[60vh] flex flex-col justify-center items-center px-8 py-10 overflow-hidden rounded-lg'
            >
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className='absolute top-0 left-0 w-full h-full object-cover'
                >
                    <source src={heroBg} type='video/mp4' />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay to darken the video for text readability */}
                <div
                    className='absolute top-0 left-0 w-full h-full bg-[#131e24]/65'
                ></div>

                {/* Content */}
                <div className='relative z-10 flex flex-col justify-center items-center h-full text-center space-y-8'>
                    <div className='max-w-4xl'>
                        <h1 className='text-4xl font-bold leading-tight mb-6'>
                            Unlocking the Secrets of the Ocean's Biodiversity
                        </h1>
                        <p className='text-lg text-gray-200 max-w-3xl mx-auto'>
                            Our AI-powered eDNA platform provides unprecedented insights into marine life, enabling conservation efforts and sustainable resource management.
                        </p>
                    </div>

                    <button
                        className='px-8 py-3 bg-[#12B5D4] hover:bg-[#1099b4] text-black font-semibold rounded-lg transition-colors duration-200 cursor-pointer'
                        onClick={() => { window.location.href = '/data-ingest' }}
                    >
                        Upload eDNA Data
                    </button>
                </div>
            </section>

            {/* About eDNA Section */}
            <Section title="About eDNA">
                <div className='space-y-12'>
                    <p className='text-gray-300 bg-[#1A2E33] border border-[#335E66] rounded-lg p-6'>
                        Environmental DNA (eDNA) analysis is a revolutionary technique that allows us to detect the presence of species in an environment by analyzing traces of their DNA left behind in water samples. This non-invasive method provides unprecedented insights into biodiversity, enabling us to monitor ecosystems with minimal disturbance.
                    </p>
                </div>
            </Section>

            {/* Platform Features Section */}
            <Section title="Platform Features">
                <div className='flex gap-4'>
                    {featuresData.map((feature) => (
                        <FeatureCard
                            key={feature.id}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </Section>

            {/* Benefits of Our Platform Section */}
            <Section title="Benefits of Our Platform">
                <div className='flex gap-4'>
                    {benefitsData.map((benefit) => (
                        <BenefitCard
                            key={benefit.id}
                            image={benefit.image}
                            alt={benefit.alt}
                            title={benefit.title}
                            description={benefit.description}
                        />
                    ))}
                </div>
            </Section>

            <Footer />
        </div>
    )
}

export default Landing
