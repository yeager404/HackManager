import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success('Signup successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      toast.error('Failed to sign up. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="bg-neutral-900/90 p-8 rounded-xl backdrop-blur-md w-full max-w-md shadow-xl border border-blue-800/30">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-900/50 p-3 rounded-full">
            <UserPlus className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-8">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-blue-200 mb-1 ml-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-blue-700/50 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-blue-200 mb-1 ml-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-blue-700/50 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1 ml-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 pl-10 rounded-lg bg-neutral-800 border border-blue-700/50 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                placeholder="john@example.com"
              />
              <div className="absolute left-3 top-2.5 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-1 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 pl-10 rounded-lg bg-neutral-800 border border-blue-700/50 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                placeholder="••••••••"
              />
              <div className="absolute left-3 top-2.5 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-1 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 pl-10 rounded-lg bg-neutral-800 border border-blue-700/50 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                placeholder="••••••••"
              />
              <div className="absolute left-3 top-2.5 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all duration-200 shadow-lg shadow-blue-900/30"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-neutral-400 text-sm">
          Already have an account? 
          <Link to={"/login"} className="text-blue-400 hover:text-blue-300 font-medium">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;