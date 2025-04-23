import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from "../store/authStore";
import { toast, Toaster } from 'react-hot-toast';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { creatorLogin, user } = useAuthStore();

  // Creator Login
  const handleCreatorLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const res = await creatorLogin(email, password);
    if (res.success) {
      console.log("Creator logged in:", user);
      toast.success('Successfully Logged In!');
      // You might want to redirect here or show a success message
    } else {
      console.error(res.message);
      toast.error("Login Failed. Check Credentials or try later")

      // You might want to show an error message to the user
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
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-white mb-6">Login for Host</h2>

        <form onSubmit={handleCreatorLogin}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <div className="relative">
              <input
                className="w-full p-3 pl-4 rounded-lg bg-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700"
                type="email"
                id="email"
                placeholder="Enter your email"
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <input
                className="w-full p-3 pl-4 rounded-lg bg-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-700"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute right-3 top-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            </div>
          </div>

          {/* <div className="flex justify-between items-center text-gray-400 text-sm mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-blue-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-500 hover:text-blue-400 transition">Forgot password?</a>
          </div> */}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-semibold transition duration-200 shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-800">
          <p className="text-center text-gray-400 text-sm">
            Don't have an account? 
            <Link to={"/signup"} className="text-blue-500 hover:text-blue-400 transition">Register</Link>
          </p>
          <p className="text-center text-gray-400 text-sm mt-3">
            Login for
            <Link to="/panelist-login" className="text-blue-500 hover:text-blue-400 transition ml-1">Panelists</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;