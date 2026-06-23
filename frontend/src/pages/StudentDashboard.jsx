import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const StudentDashboard = () => {
    const { user, logout, isAuthenticated, token } = useAuth();
    const [resources, setResources] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const approvalStatusConfig = {
        pending: {
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            message: 'Your registration is pending approval. Please wait for admin confirmation.',
        },
        approved: {
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            message: 'Congratulations! You have been approved. You can now access all resources.',
        },
        rejected: {
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            message: 'Your application has been rejected. Please contact support for more information.',
        },
    };

    const status = approvalStatusConfig[user?.approvalStatus || 'pending'];
    const StatusIcon = status.icon;

    // Sample online resources
    const onlineResources = [
        {
            id: 1,
            title: 'Traffic Rules & Regulations',
            description: 'Learn essential traffic rules and regulations',
            type: 'PDF',
            url: '#',
        },
        {
            id: 2,
            title: 'Road Safety Video Course',
            description: 'Interactive video course on road safety',
            type: 'Video',
            url: '#',
        },
        {
            id: 3,
            title: 'Practice Driving Theory Test',
            description: 'Take a mock driving theory exam',
            type: 'Quiz',
            url: '#',
        },
        {
            id: 4,
            title: 'Vehicle Maintenance Guide',
            description: 'Complete guide to vehicle maintenance',
            type: 'Guide',
            url: '#',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b-4 border-red-600">
                <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">🎓 New Paradise Learners</h1>
                    <div className="flex items-center space-x-6">
                        <span className="text-lg font-semibold text-white">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition border-2 border-red-700"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}! 👋</h2>
                    <p className="text-gray-600 mt-2">Your learning dashboard</p>
                </div>

                {/* Approval Status */}
                <div className={`mb-8 p-6 rounded-lg border ${status.bgColor} ${status.borderColor}`}>
                    <div className="flex items-start">
                        <StatusIcon className={`w-6 h-6 ${status.color} mr-4 mt-0.5`} />
                        <div>
                            <h3 className={`text-lg font-bold ${status.color}`}>
                                {user?.approvalStatus === 'pending' ? 'Pending Approval' : user?.approvalStatus === 'approved' ? 'Approved' : 'Rejected'}
                            </h3>
                            <p className="text-gray-700 mt-1">{status.message}</p>
                        </div>
                    </div>
                </div>

                {/* User Information Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600 text-sm">Full Name</p>
                            <p className="text-gray-800 font-semibold">{user?.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Email</p>
                            <p className="text-gray-800 font-semibold">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">NIC/ID Number</p>
                            <p className="text-gray-800 font-semibold">{user?.nic}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Contact Number</p>
                            <p className="text-gray-800 font-semibold">{user?.contact}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Registration Date</p>
                            <p className="text-gray-800 font-semibold">
                                {user?.enrollmentDate ? new Date(user.enrollmentDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Status</p>
                            <p className="text-gray-800 font-semibold capitalize">{user?.approvalStatus}</p>
                        </div>
                    </div>
                </div>

                {/* Online Resources */}
                {user?.approvalStatus === 'approved' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-6">
                            <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                            <h3 className="text-xl font-bold text-gray-800">Online Resources & Learning Materials</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {onlineResources.map((resource) => (
                                <div key={resource.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-800">{resource.title}</h4>
                                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                            {resource.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                                    <button className="text-blue-600 font-semibold hover:text-blue-800 text-sm">
                                        Access Resource →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pending Message */}
                {user?.approvalStatus === 'pending' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-blue-800 mb-2">Resources Coming Soon</h3>
                        <p className="text-blue-700">
                            Online resources will be available once your registration is approved by an administrator.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
