import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import dna_anim from '../assets/animation/dna_anim.json'

const LoadingPage = () => {
    const [currentMessage, setCurrentMessage] = useState(0)

    const processingMessages = [
        "Analyzing DNA sequences...",
        "Running AI-powered classification...",
        "Processing genetic markers...",
        "Identifying taxonomic features...",
        "Calculating confidence scores...",
        "Detecting potential novel species...",
        "Building biodiversity profile...",
        "Cross-referencing database...",
        "Finalizing results..."
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % processingMessages.length)
        }, 1500) // Change message every 1.5 seconds

        return () => clearInterval(interval)
    }, [])

    // DNA Double Helix Animation Component
    const DNAHelix = () => {
        const lottieRef = useRef<any>(null);

        return (
            <div className="relative w-24 h-24 mb-6">
                {/* Lottie DNA Animation */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 1, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: [0.8, 1, 0.8]
                    }}
                    transition={{
                        opacity: { duration: 0.5, ease: "easeOut" },
                        scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                >
                    <Lottie
                        lottieRef={lottieRef}
                        animationData={dna_anim}
                        loop={true}
                        autoplay={true}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        rendererSettings={{
                            preserveAspectRatio: 'xMidYMid slice'
                        }}
                    />
                </motion.div>

                {/* Central Axis */}
                <motion.div
                    className="absolute left-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent transform -translate-x-1/2"
                    animate={{
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity
                    }}
                />

                {/* Outer Glow Effect */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)'
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="bg-white/10 backdrop-blur-md rounded-xl p-8 flex flex-col items-center border border-white/20 shadow-2xl"
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: -20 }}
                    transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                >
                    {/* DNA Animation */}
                    <DNAHelix />

                    {/* Processing Title */}
                    <motion.h2
                        className="text-white text-2xl font-bold mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Processing eDNA
                    </motion.h2>

                    {/* Dynamic Message */}
                    <div className="h-6 mb-4">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentMessage}
                                className="text-blue-200 text-lg font-medium text-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                            >
                                {processingMessages[currentMessage]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Progress Indicator */}
                    <motion.div
                        className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-green-400"
                            animate={{
                                x: ["-100%", "100%"],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>

                    {/* Warning Text */}
                    <motion.p
                        className="text-white/60 text-sm text-center max-w-sm leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        Our AI is analyzing your genetic data. This process may take several minutes depending on file size and complexity.
                        <br />
                        <span className="text-yellow-300 font-medium">Please do not close or refresh the page.</span>
                    </motion.p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default LoadingPage
