import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { authService } from '../../services/authService'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import AquaGenesis from '/icon.png'

interface FormData {
    email: string
    password: string
}

const Authenticate = () => {
    window.document.title = "Authenticate | AquaGenesis"
    const [isLogin, setIsLogin] = useState(true)
    const [apiError, setApiError] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    // Get the intended destination from the location state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard'

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        clearErrors
    } = useForm<FormData>({
        mode: 'onBlur' // Validate on blur for better UX
    })

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsSubmitting(true)
        setApiError('')

        try {
            if (isLogin) {
                const response = await authService.login(data)
                localStorage.setItem('token', response.data.access_token)
                navigate(from, { replace: true })
            } else {
                const response = await authService.register(data)
                localStorage.setItem('token', response.data.access_token)
                navigate(from, { replace: true })
            }
        } catch (error: any) {
            console.error(`${isLogin ? 'Login' : 'Registration'} error:`, error)

            // Handle different types of errors
            if (error.response?.data?.message) {
                setApiError(error.response.data.message)
            } else if (error.response?.data?.detail) {
                setApiError(error.response.data.detail)
            } else if (error.message) {
                setApiError(error.message)
            } else {
                setApiError(isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleAuthMode = () => {
        setIsLogin(!isLogin)
        setApiError('')
        clearErrors()
        reset()
    }

    return (
        <div className='min-h-screen flex flex-col'>

            <nav className='px-2 py-1 text-white bg-[#131E24] border-b-1 border-b-gray-500 sticky top-0 w-full'>
                <div className='flex items-center justify-between w-[90%] mx-auto py-2'>
                    <NavLink to="/" className="flex items-center gap-2">
                        <img src={AquaGenesis} alt="Logo" className='w-16 h-16 -my-4' />
                        {/* <span className='font-bold text-xl'>
                            AquaGenesis
                        </span> */}
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

                    {/* API Error Display */}
                    {apiError && (
                        <div className='mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg'>
                            <p className='text-red-400 text-sm'>{apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium mb-2'>
                                Email Address
                            </label>
                            <input
                                type='email'
                                id='email'
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                className={`w-full p-3 rounded-lg bg-[#244247] text-white border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    } focus:outline-none focus:ring-1`}
                                placeholder='Enter your email'
                            />
                            {errors.email && (
                                <p className='mt-1 text-sm text-red-400'>{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor='password' className='block text-sm font-medium mb-2'>
                                Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters long'
                                    }
                                })}
                                className={`w-full p-3 rounded-lg bg-[#244247] text-white border ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    } focus:outline-none focus:ring-1`}
                                placeholder='Enter your password'
                            />
                            {errors.password && (
                                <p className='mt-1 text-sm text-red-400'>{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className={`w-full py-3 text-white font-semibold rounded-lg transition-colors duration-200 ${isSubmitting
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-[#226FA1] hover:bg-[#1c5c86] cursor-pointer'
                                }`}
                        >
                            {isSubmitting ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                </div>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className='mt-4 text-center'>
                        <p className='text-white/60 text-sm'>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type='button'
                                onClick={toggleAuthMode}
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
