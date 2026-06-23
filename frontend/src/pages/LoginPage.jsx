import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        credential: '', // email හෝ username දෙකටම පොදුවේ
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.credential || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            // 🎯 Backend එක email බලාපොරොත්තු වුණත්, username බලාපොරොත්තු වුණත් දෙකටම ඩේටා යවනවා
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.credential,
                username: formData.credential,
                password: formData.password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                setSuccess('Login successful! Redirecting...');

                if (typeof login === 'function') {
                    await login(response.data);
                }

                const role = response.data.user?.role;
                setTimeout(() => {
                    if (role === 'admin') {
                        window.location.href = '/admin-dashboard';
                    } else {
                        window.location.href = '/student-dashboard';
                    }
                }, 1000);
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md my-6">
                <div className="bg-white rounded-lg shadow-2xl p-8 border-4 border-blue-300">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-blue-700 mb-2">🎓 New Paradise Learners</h1>
                        <p className="text-red-600 font-semibold">System Login</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-lg flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-700 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-blue-100 border-2 border-blue-500 rounded-lg flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-blue-700 text-sm font-semibold">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Email / Username</label>
                            <input
                                type="text"
                                name="credential"
                                value={formData.credential}
                                onChange={handleChange}
                                placeholder="Enter your email or username"
                                className="w-full px-5 py-4 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 bg-blue-50"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 bg-blue-50"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white font-black py-4 rounded-xl mt-6 hover:bg-red-700 transition disabled:opacity-50 text-xl border-2 border-red-700"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;