import React from 'react'

const Footer = () => {
    return (
        <footer className='w-full flex flex-col items-center justify-center text-[#8FB8CC]'>
            <p className='text-center text-sm w-full flex justify-between px-10'>
                <a href='/'>Privacy Policy</a>
                <a href='/'>Terms of Service</a>
            </p>

            <span>&copy;2025 AquaScan. All rights reserved.</span>
        </footer>
    )
}

export default Footer
