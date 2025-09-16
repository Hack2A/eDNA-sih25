import React, { useState } from 'react'
import { authService } from '../../services/authService'
import { NavLink } from 'react-router-dom'
import AquaGenesis from '/icon.png'

const Authenticate = () => {
    window.document.title = "Authenticate | AquaGenesis"
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle authentication logic here
        console.log(isLogin ? 'Login' : 'Register', { email, password })
        if (isLogin) {
            authService.login({ email, password })
                .then(response => {
                    console.log('Login successful:', response.data);
                    // Handle successful login (e.g., redirect, store token, etc.)
                })
                .catch(error => {
                    console.error('Login error:', error);
                    // Handle login error (e.g., show error message)
                });
        }
        else {
            authService.register({ email, password })
                .then(response => {
                    console.log('Registration successful:', response.data);
                    // Handle successful registration (e.g., redirect, store token, etc.)
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    // Handle registration error (e.g., show error message)
                });
        }
    }

    return (
        <div className='min-h-screen flex flex-col'>

            <nav className='px-2 py-1 text-white bg-[#131E24] border-b-1 border-b-gray-500 sticky top-0 w-full'>
                <div className='flex items-center justify-between w-[90%] mx-auto py-2'>
                    <NavLink to="/">
                        <img src={AquaGenesis} alt="Logo" className='w-16 h-16 -my-4' />
                    </NavLink>
                    <NavLink to="/" className='font-bold text-xl'>AquaGenesis</NavLink>
                </div>
            </nav>
            <div className="flex-1 w-full bg-[#131E24] text-white flex justify-center items-center">
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
                            className='w-full py-3 bg-[#226FA1] hover:bg-[#1c5c86] text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer'
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className='mt-4 text-center'>
                        <p className='text-white/60 text-sm'>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className='text-[#226FA1] hover:text-[#1b5983] font-medium underline cursor-pointer'
                            >
                                {isLogin ? 'Register' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Authenticate
