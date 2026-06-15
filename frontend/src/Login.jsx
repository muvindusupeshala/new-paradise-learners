import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            
            {/* 1. TOP UTILITY BAR (image_764380.jpg එකේ වගේමයි) */}
            <div className="bg-blue-900 text-white text-xs py-2 px-6 flex flex-wrap justify-between items-center border-b border-blue-800">
                <div className="flex gap-4 opacity-90">
                    <span className="hover:underline cursor-pointer">Facebook</span>
                    <span className="hover:underline cursor-pointer">YouTube</span>
                    <span className="hover:underline cursor-pointer">Instagram</span>
                </div>
                <div className="flex gap-6 font-semibold">
                    <span>📍 Colombo | Nugegoda | Galle</span>
                    <span>📞 Hotline: 077 782 5171</span>
                </div>
            </div>

            {/* 2. MAIN HEADER / NAVIGATION */}
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-3">
                    {/* Main Driving School Badge */}
                    <div className="bg-red-600 text-white p-2 rounded-xl shadow-md">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">
                            Paradise <span className="text-blue-700">Learners</span>
                        </h1>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Driving School</span>
                    </div>
                </div>
                <nav className="hidden md:flex gap-6 text-sm font-bold text-slate-600">
                    <span className="hover:text-blue-700 cursor-pointer transition-colors">Home</span>
                    <span className="hover:text-blue-700 cursor-pointer transition-colors">Gallery</span>
                    <span className="hover:text-blue-700 cursor-pointer transition-colors">Contact Us</span>
                    <span className="text-blue-700 cursor-pointer border-b-2 border-blue-700 pb-1">Student Portal</span>
                </nav>
            </header>

            {/* 3. HERO / LOGIN SPLIT SECTION */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full mx-auto p-4 md:p-8 gap-8 items-center">
                
                {/* LEFT SIDE: Marketing & Info Section (Inspired by image_764380.jpg / image_769558.png) */}
                <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-6">
                    <div className="space-y-4">
                        <span className="bg-red-50 text-red-600 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider inline-block border border-red-100">
                            #1 Government Approved Driving School
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                            "Drive With Confidence, <br />
                            <span className="text-blue-700">Learn With Us!"</span>
                        </h2>
                        <p className="text-slate-500 font-medium text-base max-w-xl">
                            Please sign in to your official student account to access exam papers, book practical lessons, and track your driving progress.
                        </p>
                    </div>

                    {/* Digital Resources Cards Grid (image_764380.jpg එකේ යට තියෙන ඒවා වගේ) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Exam Papers</h4>
                                <p className="text-xs text-gray-400 mt-1">Practice trial theory test papers online.</p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Student Portal</h4>
                                <p className="text-xs text-gray-400 mt-1">Book your driving slots & slots anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Corporate Student Login Form Card */}
                <div className="lg:col-span-5 w-full">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                        
                        {/* Top Accent Line for the Login Card */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-700 to-red-600"></div>

                        <div className="mb-6">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <span>STUDENT LOGIN</span>
                                <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-ping"></span>
                            </h3>
                            <p className="text-xs text-gray-400 font-medium mt-1">Enter your registered credentials below</p>
                        </div>

                        {/* Error Handling */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-3 rounded-r-xl text-xs font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all font-medium text-sm"
                                        placeholder="yourname@gmail.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                                    Password
                                </label>
                                <div className="relative rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all font-medium text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-700/20 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 transform active:scale-[0.99]"
                            >
                                <span>Sign In to Portal</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </button>
                        </form>

                        {/* Footer Sign Up Link */}
                        <div className="text-center text-xs text-gray-500 font-semibold pt-4 mt-5 border-t border-gray-100 flex items-center justify-center gap-1.5">
                            <span>New Student?</span>
                            <a href="/register" className="font-bold text-red-600 hover:text-red-700 transition-all inline-flex items-center gap-0.5 hover:underline uppercase tracking-wider">
                                <span>Register Online Now</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;