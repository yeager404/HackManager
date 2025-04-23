import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast, Toaster } from 'react-hot-toast';

function LoginPanelist() {
    const [email, setEmail] = useState('');
    const [hackathonId, setHackathonId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { panelistLogin } = useAuthStore();
    const navigate = useNavigate();

    const handlePanelistLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await panelistLogin(email, hackathonId);

            if (result.success) {
                toast.success('Successfully logged in!');
                // Let the loader run for a moment to show success
                setTimeout(() => {
                    setIsLoading(false);
                    // Navigate using the panelist ID from the response
                    navigate(`/panel/${result.panelistId}`);
                }, 1000);
            } else {
                console.error(result.message);
                toast.error(result.message || 'Login failed. Check credentials or try later');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Failed to connect to server');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center relative bg-black">
            <Toaster position="top-center" />

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black to-neutral-900"></div>

            {/* Login Card */}
            <div className="relative z-10 bg-neutral-900 rounded-xl shadow-2xl p-6 max-w-sm w-full border border-neutral-800">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-center text-2xl font-bold text-white mb-6">Login for Panelists</h2>

                <form onSubmit={handlePanelistLogin}>
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <div className="relative">
                            <input
                                className="w-full p-3 pl-4 rounded-lg bg-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700"
                                type="email"
                                id="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="absolute right-3 top-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="hackathonId" className="block text-sm font-medium text-gray-400 mb-1">Hackathon ID</label>
                        <div className="relative">
                            <input
                                className="w-full p-3 pl-4 rounded-lg bg-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700"
                                type="text"
                                id="hackathonId"
                                placeholder="Enter the Hackathon ID"
                                value={hackathonId}
                                onChange={(e) => setHackathonId(e.target.value)}
                                required
                            />
                            <div className="absolute right-3 top-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* <div className="flex justify-between items-center text-gray-400 text-sm mb-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2 accent-blue-500" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="text-blue-500 hover:text-blue-400 transition">Forgot ID?</a>
                    </div> */}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white p-3 rounded-lg font-semibold transition duration-200 shadow-lg flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </div>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-neutral-800">
                    {/* <p className="text-center text-gray-400 text-sm">
                        Don't have an account? <a href="#" className="text-blue-500 hover:text-blue-400 transition">Register with your host</a>
                    </p> */}
                    <p className="text-center text-gray-400 text-sm mt-3">
                        Login for
                        <Link to="/login" className="text-blue-500 hover:text-blue-400 transition ml-1">Hosts</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPanelist;