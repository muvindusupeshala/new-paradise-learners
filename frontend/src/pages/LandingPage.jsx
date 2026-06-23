import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { MapPin, Phone, Mail, Users, BookOpen, Award } from 'lucide-react';

const LandingPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        }
        fetchBranches();
    }, [isAuthenticated, user, navigate]);

    const fetchBranches = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/branches');
            setBranches(response.data.branches);
        } catch (error) {
            console.error('Error fetching branches:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b-4 border-red-600">
                <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">🎓 New Paradise Learners</h1>
                    <div className="space-x-4 flex">
                        {isAuthenticated ? (
                            <Link to="/student-dashboard" className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition border-2 border-red-700">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition border-2 border-white">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition border-2 border-red-700">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to New Paradise Learners</h2>
                    <p className="text-xl text-gray-600">Premier Driving School Management System</p>
                    <p className="text-gray-500 mt-2">Comprehensive training for safe and responsible driving</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                        <Users className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
                        <p className="text-gray-600">Learn from certified and experienced driving professionals</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                        <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Digital Resources</h3>
                        <p className="text-gray-600">Access online learning materials and theory courses</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                        <Award className="w-12 h-12 text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Certification</h3>
                        <p className="text-gray-600">Receive recognized driving certification upon completion</p>
                    </div>
                </div>
            </section>

            {/* Branches Section */}
            <section className="bg-blue-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Branches</h2>
                    {loading ? (
                        <div className="text-center">
                            <p className="text-gray-600">Loading branches...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {branches.length > 0 ? (
                                branches.map((branch) => (
                                    <div key={branch._id} className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-xl font-bold mb-3">{branch.name}</h3>
                                        <div className="space-y-2 text-gray-600">
                                            <div className="flex items-center">
                                                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                                <p>{branch.location}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                                                <p>{branch.phone}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                                                <p>{branch.email}</p>
                                            </div>
                                        </div>
                                        {branch.description && (
                                            <p className="mt-3 text-gray-700">{branch.description}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No branches available</p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-6xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
                <p className="text-gray-600 mb-8 text-lg">Join hundreds of successful drivers who have completed our program</p>
                {!isAuthenticated && (
                    <Link to="/register" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Register Now
                    </Link>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p>&copy; 2026 New Paradise Learners. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
