import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '', // 👈 Username එක සඳහා අලුතින් එකතු කරන ලදී
        email: '',
        nic: '',
        contact: '',
        password: '',
        confirmPassword: '',
        branchId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/student-dashboard');
        }
    }, [isAuthenticated, navigate]);

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

        // Validation - Username එකත් මෙතනට එකතු කලා
        if (!formData.name || !formData.username || !formData.email || !formData.nic || !formData.contact || !formData.password) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // 💡 ඔයාගේ useAuth hook එක හරහා backend එකට username එකත් යවනවා
            const result = await register({
                name: formData.name,
                username: formData.username, // 👈 Backend එකට username එක මෙතනින් යනවා
                email: formData.email,
                nic: formData.nic,
                contact: formData.contact,
                password: formData.password,
                branchId: formData.branchId || undefined,
            });

            if (result.success) {
                setSuccess('Registration successful! Your account is pending approval. Redirecting...');
                setTimeout(() => navigate('/student-dashboard'), 2000);
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md my-6">
                {/* Card */}
                <div className="bg-white rounded-lg shadow-2xl p-8 border-4 border-blue-300">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-blue-700 mb-2">🎓 New Paradise Learners</h1>
                        <p className="text-red-600 font-semibold">Student Registration</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-lg flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-700 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div className="mb-4 p-3 bg-blue-100 border-2 border-blue-500 rounded-lg flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-blue-700 text-sm font-semibold">{success}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Full Name Field */}
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Full Name</label>
                            <div className="relative mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-5 py-5 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-blue-50"
                                    style={{ paddingLeft: '20px' }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* 👤 2. Username Field (අලුතින්ම එකතු කල කොටස) */}
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Username</label>
                            <div className="relative mt-2">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="johndoe123"
                                    className="w-full px-5 py-5 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-blue-50"
                                    style={{ paddingLeft: '20px' }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* 3. Email Field */}
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Email</label>
                            <div className="relative mt-2">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    className="w-full px-5 py-5 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-blue-50"
                                    style={{ paddingLeft: '20px' }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* 4. NIC Field */}
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">NIC/ID Number</label>
                            <div className="relative mt-2">
                                <input
                                    type="text"
                                    name="nic"
                                    value={formData.nic}
                                    onChange={handleChange}
                                    placeholder="123456789V"
                                    className="w-full px-5 py-5 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-blue-50"
                                    style={{ paddingLeft: '20px' }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* 5. Contact Field */}
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Contact Number</label>
                            <div className="relative mt-2">
                                <input
                                    type="tel"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="+94 71 234 5678"
                                    className="w-full px-5 py-5 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-blue-50"
                                    style={{ paddingLeft: '20px' }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* 6. Branch Selection */}
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Branch (Optional)</label>
                            <div className="relative mt-2">
                                <select
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    className="w-full px-5 py-5 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-blue-50 cursor-pointer"
                                    style={{ paddingLeft: '20px' }}
                                    disabled={loading}
                                >
                                    <option value="">Select a branch</option>
                                    <option value="Ogodapola">Ogodapola</option>
                                    <option value="Weliweriya">Weliweriya</option>
                                    <option value="Meerigama">Meerigama</option>
                                </select>
                            </div>
                        </div>

                        {/* 7. Password Field */}
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Password</label>
                            <div className="relative mt-2">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-5 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-blue-50"
                                    style={{ paddingLeft: '20px' }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* 8. Confirm Password Field */}
                        <div>
                            <label className="block text-xl font-black text-blue-800 mb-4 leading-tight">Confirm Password</label>
                            <div className="relative mt-2">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-5 border-4 border-blue-400 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-blue-50"
                                    style={{ paddingLeft: '20px' }}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white font-black py-5 rounded-xl mt-6 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-xl border-2 border-red-700"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-600 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;