import logo from "../assets/logo.png"
import { navItems } from "../constants/index.jsx"
import { useState } from "react"
import { Menu, X, LogOut } from "lucide-react"
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { toast, Toaster } from 'react-hot-toast';
import GradientButton from "./GradientButton.jsx"

const Navbar = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    const handleLogout = () => {
        logout();
        toast.success('Successfully logged out!');
    };

    return (
        <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg bg-[#0a1128]/90 border-b border-gray-800 shadow-xl w-full">
            <Toaster position="top-center" />
            <div className="container px-4 mx-auto relative">
                <div className="flex justify-between items-center">
                    {/* Logo/Brand */}
                    <div className="flex items-center flex-shrink-0">
                        <img className="h-9 w-9 mr-3" src={logo} alt="Logo" />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                            HackManager
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="hidden lg:flex ml-14 space-x-10">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.href}
                                    className="relative py-2 px-1 text-gray-300 hover:text-white transition-colors
                        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-500 
                        after:w-0 after:hover:w-full after:transition-all after:duration-300"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 py-2 px-4 rounded-lg border border-gray-700 hover:bg-red-900/50 hover:border-red-500 text-red-400 hover:text-white transition-all duration-300 group"
                            >
                                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="py-2 px-5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300">
                                        Sign In
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="py-2 px-5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 shadow-lg hover:shadow-blue-800/50 transition-all duration-500">
                                        Create Account
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleNavbar}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                        {mobileDrawerOpen ? (
                            <X className="w-6 h-6 text-gray-300" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-300" />
                        )}
                    </button>
                </div>

                {/* Mobile Drawer */}
                {mobileDrawerOpen && (
                    <div className="fixed inset-0 z-40 bg-[#0a1128]/95 backdrop-blur-lg flex flex-col items-center justify-center lg:hidden">
                        <ul className="w-full px-6 space-y-8 text-center">
                            {navItems.map((item, index) => (
                                <li key={index} className="border-b border-gray-800 pb-4">
                                    <a
                                        href={item.href}
                                        className="block py-3 text-xl text-gray-300 hover:text-white transition-colors"
                                        onClick={toggleNavbar}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="w-full px-6 mt-10 space-y-5">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleNavbar();
                                    }}
                                    className="w-full py-3 px-5 rounded-lg bg-red-900/50 border border-red-900 text-red-300 hover:bg-red-900 hover:text-white transition-colors flex items-center justify-center space-x-3"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" onClick={toggleNavbar}>
                                        <button className="w-full py-3 px-5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-4">
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link to="/signup" onClick={toggleNavbar}>
                                        <button className="w-full py-3 px-5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 transition-all">
                                            Create Account
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;