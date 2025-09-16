const Footer = () => {
    return (
        <footer className='w-full flex flex-col items-center justify-center text-[#8FB8CC] -mt-5 py-5 gap-6 border-t border-t-gray-500/30'>
            <p className='text-center text-sm w-[60%] flex justify-between px-10'>
                <a href='/'>Home</a>
                <a href='/'>About</a>
                <a href='/'>Features</a>
                <a href='/'>Contact</a>
            </p>

            <span>&copy;2025 AquaGenesis. All rights reserved.</span>
        </footer>
    )
}

export default Footer
