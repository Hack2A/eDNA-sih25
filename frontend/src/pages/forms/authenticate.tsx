import React, { useState } from 'react'

const Authenticate = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle authentication logic here
        console.log(isLogin ? 'Login' : 'Register', { email, password })
    }

    return (
        <div className="w-full min-h-screen bg-[#131E24] text-white flex justify-center items-center">
            <div className='bg-white/2 backdrop-blur-sm rounded-[100px] w-full max-w-lg p-20 shadow-white/5 shadow-2xl border border-white/20'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold mb-2'>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className='text-white/60 -mt-1'>
                        {isLogin
                            ? 'Sign in to your account to continue'
                            : 'Join us to start your eDNA journey'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium mb-2'>
                            Email Address
                        </label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-3 rounded-lg bg-[#244247] text-white border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            placeholder='Enter your email'
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='password' className='block text-sm font-medium mb-2'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-3 rounded-lg bg-[#244247] text-white border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            placeholder='Enter your password'
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer'
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className='mt-4 text-center'>
                    <p className='text-white/60 text-sm'>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className='text-blue-400 hover:text-blue-300 font-medium underline cursor-pointer'
                        >
                            {isLogin ? 'Register' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Authenticate
