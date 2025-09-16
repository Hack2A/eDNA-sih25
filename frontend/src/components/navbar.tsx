import { PlusCircleIcon } from '@heroicons/react/24/outline';
import AquaGenesis from '/icon.png'
import { NavLink } from 'react-router-dom';
import { authService } from '../services/authService';
import { useLogout } from '../utils/logout';

const Navbar = () => {
    const isAuthenticated = authService.isAuthenticated();
    const logout = useLogout();

    const handleAuthAction = () => {
        if (isAuthenticated) {
            logout();
        }
        // If not authenticated, the NavLink will handle navigation to /u/auth
    };

    return (
        <nav className='px-2 py-1 text-white bg-[#131E24] border-b-1 border-b-gray-500'>
            <div className='flex items-center justify-between w-[90%] mx-auto py-2'>
                <NavLink to="/">
                    <img src={AquaGenesis} alt="Logo" className='w-16 h-16 -my-4' />
                </NavLink>
                <div className='flex gap-5'>
                    <NavLink to="/data-ingest">
                        <PlusCircleIcon className='h-6 w-6' />
                    </NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/report">Report</NavLink>
                    <NavLink to="/search-specie">Species Explorer</NavLink>
                    {isAuthenticated ? (
                        <button
                            onClick={handleAuthAction}
                            className="hover:text-gray-300 transition-colors cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink to="/u/auth">Authenticate</NavLink>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
