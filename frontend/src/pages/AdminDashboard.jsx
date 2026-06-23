import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Users, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const { user, logout, isAuthenticated, token } = useAuth();
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingApprovals: 0,
        approvedStudents: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user?.role !== 'admin') {
            navigate('/student-dashboard');
        } else {
            fetchData();
        }
    }, [isAuthenticated, user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };

            const [statsResponse, studentsResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/auth/dashboard-stats', { headers }),
                axios.get('http://localhost:5000/api/auth/students', { headers }),
            ]);

            setStats(statsResponse.data.stats);
            setStudents(studentsResponse.data.students);
            setError('');
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleApproveStudent = async (studentId, newStatus) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.put(
                `http://localhost:5000/api/auth/students/${studentId}/approve`,
                { status: newStatus },
                { headers }
            );

            // Update the local state
            setStudents(students.map((s) => (s._id === studentId ? response.data.user : s)));

            // Refresh stats
            fetchData();
        } catch (err) {
            console.error('Error updating student:', err);
            setError('Failed to update student status');
        }
    };

    // Filter students
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nic.includes(searchTerm);

        const matchesFilter = filterStatus === 'all' || student.approvalStatus === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b-4 border-red-600">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">🎓 New Paradise Learners - Admin</h1>
                    <div className="flex items-center space-x-6">
                        <span className="text-lg font-semibold text-white">{user?.name} (Admin)</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition border-2 border-red-700"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-blue-800">Admin Dashboard 📊</h2>
                    <p className="text-blue-700 mt-2 font-semibold">Manage student registrations and approvals</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg">
                        <p className="text-red-700 font-semibold">{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Students */}
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-lg p-6 border-4 border-blue-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-700 text-sm font-bold">Total Students</p>
                                    <p className="text-3xl font-black text-blue-800 mt-2">{stats.totalStudents}</p>
                                </div>
                                <Users className="w-12 h-12 text-blue-600" />
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg shadow-lg p-6 border-4 border-yellow-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-bold">Pending Approvals</p>
                                    <p className="text-3xl font-black text-yellow-600 mt-2">{stats.pendingApprovals}</p>
                                </div>
                                <Clock className="w-12 h-12 text-yellow-500" />
                            </div>
                        </div>

                        {/* Approved Students */}
                        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-lg p-6 border-4 border-green-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-bold">Approved Students</p>
                                    <p className="text-3xl font-black text-green-600 mt-2">{stats.approvedStudents}</p>
                                </div>
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Students Management */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Student Management</h3>

                        {/* Search and Filter */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or NIC..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="relative">
                                <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Students Table */}
                    {loading ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-600">Loading students...</p>
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name / Username</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">NIC</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Branch</th> {/* 👈 අලුතින් එකතු කලා */}
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                <div className="font-bold">{student.name}</div>
                                                <div className="text-xs text-gray-400">@{student.username || 'no_username'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{student.nic}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{student.contact}</td>
                                            {/* 🏛️ Branch තීරුව */}
                                            <td className="px-6 py-4 text-sm">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">
                                                    {student.branch || 'Not Specified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${student.approvalStatus === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : student.approvalStatus === 'approved'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {student.approvalStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            {/* 🎯 Actions බටන්ස් (ස්ටේටස් එක අනුව මාරු කිරීමට හැදුවා) */}
                                            <td className="px-6 py-4 text-sm space-x-2 text-center">
                                                {student.approvalStatus !== 'approved' && (
                                                    <button
                                                        onClick={() => handleApproveStudent(student._id, 'approved')}
                                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 transition"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {student.approvalStatus !== 'rejected' && (
                                                    <button
                                                        onClick={() => handleApproveStudent(student._id, 'rejected')}
                                                        className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700 transition"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-600">No students found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;