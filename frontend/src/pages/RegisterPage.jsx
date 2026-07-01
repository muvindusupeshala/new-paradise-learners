import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCustomer } from '../api';
import { User, Mail, Lock, CreditCard, Phone, Calendar, Landmark, Award, MapPin } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        nic: '',
        dob: '',
        gender: '',
        contactNumber: '',
        branch: '',
        address: ''
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        // 🎯 මෙතනට address: formData.address කියන එක නිවැරදිව එකතු කළා මචන්!
        const backendData = {
            name: formData.fullName,
            username: formData.username,
            email: formData.email,
            nic: formData.nic,
            contact: formData.contactNumber,
            address: formData.address, // 👈 දැන් Database එකට ඇඩ්‍රස් එක යනවා!
            password: formData.password,
            branchId: formData.branch
        };

        try {
            const response = await registerCustomer(backendData);

            setSuccessMessage('Registration Successful! 🎉');

            // 💾 Dashboard එකට ප්‍රශ්නයක් නොවෙන්න keys දෙකෙන්ම සේව් කරනවා
            localStorage.setItem('user', JSON.stringify({
                fullName: formData.fullName,
                name: formData.fullName,
                email: formData.email,
                contact: formData.contactNumber,
                contactNumber: formData.contactNumber,
                nic: formData.nic,
                branch: formData.branch,
                address: formData.address
            }));

            alert('Registration Successful! Redirecting to Student Dashboard...');
            navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Please provide all required fields');
            console.error('Register Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-6 font-sans text-slate-800">
            <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200 p-10 shadow-lg space-y-8">

                <div className="text-center space-y-2">
                    <div className="flex justify-center items-center space-x-2 text-blue-600 mb-2">
                        <Award className="w-10 h-10 text-amber-500" />
                        <span className="text-2xl font-black tracking-wider uppercase">New Paradise Learners</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Create Student Account</h2>
                    <p className="text-sm font-bold text-slate-400">Register today to plan your practice sessions and exams.</p>
                </div>

                {successMessage && <div className="bg-green-50 border-2 border-green-200 text-green-700 px-5 py-3 rounded-xl font-bold text-sm">🎉 {successMessage}</div>}
                {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-3 rounded-xl font-bold text-sm">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Full Name</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <User className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Username</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <User className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="kamalp" required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Email Address</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <Mail className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="kamal@gmail.com" required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Contact Number</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <Phone className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="0716545434" required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">NIC / ID Number</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <CreditCard className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <input type="text" name="nic" value={formData.nic} onChange={handleChange} placeholder="200312314532" required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Date of Birth</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <Calendar className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0 text-slate-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Gender</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <User className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0 text-slate-600">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Branch</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <Landmark className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <select name="branch" value={formData.branch} onChange={handleChange} required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0 text-slate-600">
                                    <option value="">Select a Branch</option>
                                    <option value="Malabe">Malabe</option>
                                    <option value="Colombo">Colombo</option>
                                    <option value="Galle">Galle</option>
                                    <option value="Ogodapola">Ogodapola</option>
                                    <option value="Meerigama">Meerigama</option>
                                    <option value="Weliweriya">Weliweriya</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-black text-slate-700">Residential Address</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <MapPin className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="No 123, Colombo Road, Gampaha." required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-black text-slate-700">Password</label>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-xl h-14 px-4 transition">
                                <Lock className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full h-full bg-transparent font-bold text-base outline-none border-none p-0" />
                            </div>
                        </div>

                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black p-4 rounded-xl text-base shadow transition disabled:opacity-50">
                        {loading ? 'Registering Customer...' : 'Register Customer'}
                    </button>
                </form>

                <p className="text-center text-sm font-bold text-slate-400">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
                </p>

            </div>
        </div>
    );
};

export default RegisterPage;