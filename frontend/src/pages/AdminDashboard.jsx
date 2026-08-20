import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import BranchManagement from '../components/BranchManagement';
import { LogOut, Users, Building2, Clock, CheckCircle, Mail, Phone, X, IdCard, MapPin, HeartPulse, Calendar, Car, CreditCard, Award } from 'lucide-react';

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

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

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

    const handleApproveStudent = async (studentId, newStatus, e) => {
        if (e) e.stopPropagation();

        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.put(
                `http://localhost:5000/api/auth/students/${studentId}/approve`,
                { status: newStatus },
                { headers }
            );

            setStudents(students.map((s) => (s._id === studentId ? response.data.user : s)));

            if (selectedStudent && selectedStudent._id === studentId) {
                setSelectedStudent({ ...selectedStudent, approvalStatus: newStatus });
            }

            fetchData();
        } catch (err) {
            console.error('Error updating student:', err);
            setError('Failed to update student status');
        }
    };

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nic?.includes(searchTerm);

        const matchesFilter = filterStatus === 'all' || student.approvalStatus === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (

        <div className="min-h-screen bg-slate-100 font-sans flex flex-col justify-start items-center w-full antialiased relative">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50 w-full flex justify-center border-b-2 border-blue-700">
                <div className="w-full max-w-[95vw] px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎓</span>
                        <h1 className="text-2xl font-extrabold tracking-tight">New Paradise Learners <span className="text-blue-200 font-normal text-lg">| Admin Panel</span></h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-semibold bg-blue-700 px-4 py-2 rounded-full border border-blue-500 shadow-inner">
                            {user?.name || 'Admin'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 shadow-md"
                        >
                            <LogOut className="w-4 h-4 mr-1.5" />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Layout Container */}
            <div className="w-full max-w-[95vw] px-4 py-8 flex flex-col space-y-8">
                {/* Title Header */}

                <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-2">
                        Admin Dashboard <span className="text-2xl">📊</span>
                    </h2>
                    <p className="text-slate-500 text-base mt-1 font-medium">Manage student registrations, approvals and center distribution efficiently.</p>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl font-bold">{error}</div>}

                {/* Main Dashboard Stats Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between transition-all duration-200 hover:shadow-md">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
                                <p className="text-4xl font-black text-blue-600">{stats.totalStudents}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
                                <Users className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between transition-all duration-200 hover:shadow-md">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
                                <p className="text-4xl font-black text-amber-500">{stats.pendingApprovals}</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl text-amber-500">
                                <Clock className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between transition-all duration-200 hover:shadow-md">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Students</p>
                                <p className="text-4xl font-black text-emerald-600">{stats.approvedStudents}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col w-full">
                    <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-xl font-bold text-slate-800">Student Applications</h3>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Search by name, email, or NIC..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-4 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium shadow-sm w-64"
                            />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-bold text-slate-700 shadow-sm cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-500 font-medium">Loading details...</div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
                                        <th className="px-6 py-4 text-left">Student Profile</th>
                                        <th className="px-6 py-4 text-left">Contact Info</th>
                                        <th className="px-6 py-4 text-left">Verification</th>
                                        <th className="px-6 py-4 text-left">Assigned Branch</th>
                                        <th className="px-6 py-4 text-left">Status</th>
                                        <th className="px-6 py-4 text-center">Action Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                                    {filteredStudents.map((student) => (
                                        <tr
                                            key={student._id}
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setActiveTab('profile');
                                            }}
                                            className="transition-colors hover:bg-slate-50 cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 text-base">{student.name}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">@{student.username || 'no_username'}</div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="text-slate-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{student.email}</div>
                                                <div className="text-slate-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{student.contact || student.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono bg-slate-100 px-2 py-1 rounded-md border text-xs text-slate-600 font-semibold">{student.nic}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                                                    📍 {student.branch || 'Not Specified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wide border ${student.approvalStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    student.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                    {(student.approvalStatus || 'pending').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => handleApproveStudent(student._id, 'approved')} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">Approve</button>
                                                <button onClick={() => handleApproveStudent(student._id, 'rejected')} className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ULTRA-WIDE & ULTRA-CLEAR POPUP WINDOW MODAL */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 sm:p-6 animate-fadeIn">
                    <div className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">

                        {/* Header Area */}
                        <div className="bg-blue-600 p-6 sm:p-8 text-white flex justify-between items-center flex-shrink-0 border-b border-blue-700">
                            <div className="space-y-2">
                                <span className="text-xs uppercase tracking-wider font-extrabold text-blue-200/90 block bg-blue-700/50 w-fit px-3 py-1 rounded-lg">
                                    Management Information System | Student Profile Dossier
                                </span>
                                <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug pt-1">
                                    {selectedStudent.name || 'Student Profile'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="bg-blue-700/60 hover:bg-red-500 text-white p-3 rounded-2xl transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center flex-shrink-0"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="bg-slate-50 border-b border-slate-200 flex px-6 sm:px-8 pt-4 gap-2 sm:gap-4 flex-shrink-0 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-5 py-3.5 rounded-t-xl font-black text-sm sm:text-base tracking-wide transition-all border-b-4 whitespace-nowrap ${activeTab === 'profile'
                                    ? 'bg-white text-blue-600 border-t border-x border-slate-200 border-b-blue-600 z-10 shadow-sm'
                                    : 'text-slate-500 border-b-transparent hover:text-slate-800 hover:bg-slate-200/50'
                                    }`}
                            >
                                👤 Basic Demographics
                            </button>
                            <button
                                onClick={() => setActiveTab('medical_practice')}
                                className={`px-5 py-3.5 rounded-t-xl font-black text-sm sm:text-base tracking-wide transition-all border-b-4 whitespace-nowrap ${activeTab === 'medical_practice'
                                    ? 'bg-white text-blue-600 border-t border-x border-slate-200 border-b-blue-600 z-10 shadow-sm'
                                    : 'text-slate-500 border-b-transparent hover:text-slate-800 hover:bg-slate-200/50'
                                    }`}
                            >
                                🩺 Medical & Practice
                            </button>
                            <button
                                onClick={() => setActiveTab('payments_exams')}
                                className={`px-5 py-3.5 rounded-t-xl font-black text-sm sm:text-base tracking-wide transition-all border-b-4 whitespace-nowrap ${activeTab === 'payments_exams'
                                    ? 'bg-white text-blue-600 border-t border-x border-slate-200 border-b-blue-600 z-10 shadow-sm'
                                    : 'text-slate-500 border-b-transparent hover:text-slate-800 hover:bg-slate-200/50'
                                    }`}
                            >
                                💳 Payments & Exam Schedules
                            </button>
                        </div>

                        {/* Modal Body Content */}
                        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white space-y-8">

                            {/* TAB 1: BASIC DEMOGRAPHICS */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8">
                                    <h4 className="text-xs sm:text-sm font-black uppercase text-slate-400 tracking-wider border-b-2 border-slate-100 pb-2">
                                        Student Primary Dossier
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                        <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 flex items-center hover:bg-white hover:shadow-md transition-all duration-150">
                                            <Mail className="w-8 h-8 text-blue-500 mr-5 flex-shrink-0" />
                                            <div className="space-y-1 overflow-hidden">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</p>
                                                <p className="text-lg sm:text-xl font-extrabold text-slate-800 break-all leading-relaxed">
                                                    {selectedStudent.email || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 flex items-center hover:bg-white hover:shadow-md transition-all duration-150">
                                            <Phone className="w-8 h-8 text-emerald-500 mr-5 flex-shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Contact Number</p>
                                                <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide leading-relaxed">
                                                    {selectedStudent.contact || selectedStudent.phone || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 flex items-center hover:bg-white hover:shadow-md transition-all duration-150">
                                            <IdCard className="w-8 h-8 text-purple-500 mr-5 flex-shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">NIC Identifier</p>
                                                <p className="text-xl sm:text-2xl font-mono font-black text-slate-800 tracking-widest leading-relaxed">
                                                    {selectedStudent.nic || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 flex items-center hover:bg-white hover:shadow-md transition-all duration-150">
                                            <MapPin className="w-8 h-8 text-rose-500 mr-5 flex-shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Operational Center Branch</p>
                                                <p className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 leading-relaxed">
                                                    📍 {selectedStudent.branch || 'Not Specified'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: MEDICAL REPORT & PRACTICE SESSIONS */}
                            {activeTab === 'medical_practice' && (
                                <div className="space-y-10">
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-black uppercase text-slate-400 tracking-wider border-b-2 border-slate-100 pb-2 mb-6">
                                            Official Medical Clearance
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 flex items-center">
                                                <HeartPulse className="w-8 h-8 text-rose-600 mr-5 flex-shrink-0" />
                                                <div className="space-y-1.5">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">DMT Medical Status</p>
                                                    <span className={`text-sm font-black px-3.5 py-1.5 rounded-xl inline-block border tracking-wide mt-1 ${selectedStudent.medicalStatus === 'FAILED'
                                                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                                                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                        }`}>
                                                        {selectedStudent.medicalStatus || 'PASSED / VERIFIED'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 flex items-center">
                                                <Calendar className="w-8 h-8 text-blue-500 mr-5 flex-shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Medical Examination Date</p>
                                                    <p className="text-xl sm:text-2xl font-black text-slate-800 leading-relaxed">
                                                        {selectedStudent.medicalDate || 'Not Scheduled'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs sm:text-sm font-black uppercase text-slate-400 tracking-wider border-b-2 border-slate-100 pb-2 mb-6">
                                            Behind-The-Wheel Practice Progress
                                        </h4>
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                                <div className="flex items-center">
                                                    <Car className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                                                    <div className="space-y-1">
                                                        <span className="text-xl sm:text-2xl font-black text-slate-800 block">Practical Training Course Log</span>
                                                        <span className="text-xs sm:text-sm font-medium text-slate-400">Real-time breakdown managed by certified route instructors</span>
                                                    </div>
                                                </div>
                                                <span className="bg-blue-600 text-white text-lg sm:text-xl font-black px-5 py-3 rounded-xl shadow-md w-fit">
                                                    {selectedStudent.completedSessions ?? 0} / {selectedStudent.totalSessions ?? 15} Hours Logged
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden shadow-inner mt-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-blue-700 h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            ((selectedStudent.completedSessions || 0) / (selectedStudent.totalSessions || 15)) * 100
                                                        )}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: PAYMENT TRACKING & EXAM SCHEDULES */}
                            {activeTab === 'payments_exams' && (
                                <div className="space-y-10">
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-black uppercase text-slate-400 tracking-wider border-b-2 border-slate-100 pb-2 mb-6">
                                            Financial Ledger Statements
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 flex items-center">
                                                <CreditCard className="w-8 h-8 text-slate-600 mr-5 flex-shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Gross Fee Allocation</p>
                                                    <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide mt-0.5">
                                                        LKR {selectedStudent.totalFee || selectedStudent.grossFee || '0.00'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 flex items-center">
                                                <CheckCircle className="w-8 h-8 text-emerald-600 mr-5 flex-shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Aggregated Paid</p>
                                                    <p className="text-xl sm:text-2xl font-black text-emerald-600 tracking-wide mt-0.5">
                                                        LKR {selectedStudent.amountPaid || selectedStudent.paid || '0.00'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex items-center">
                                                <Clock className="w-8 h-8 text-amber-600 mr-5 flex-shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Outstanding Balance</p>
                                                    <p className="text-xl sm:text-2xl font-black text-amber-700 tracking-wide mt-0.5">
                                                        LKR {selectedStudent.dueBalance || selectedStudent.balance || '0.00'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs sm:text-sm font-black uppercase text-slate-400 tracking-wider border-b-2 border-slate-100 pb-2 mb-6">
                                            Official Examination Schedules
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                                                <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wide border-b pb-2">
                                                    <Calendar className="w-5 h-5 text-slate-400 mr-2" />
                                                    Theory Assessment Date
                                                </div>
                                                <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide">
                                                    {selectedStudent.theoryExamDate || 'Pending'}
                                                </p>
                                                <span className={`text-xs font-extrabold px-3 py-1 rounded border inline-block ${selectedStudent.theoryStatus === 'PASSED'
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                                                    }`}>
                                                    {selectedStudent.theoryStatus || 'PENDING'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                                                <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-wide border-b pb-2">
                                                    <Award className="w-5 h-5 text-slate-400 mr-2" />
                                                    Practical Trial Route
                                                </div>
                                                <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide">
                                                    {selectedStudent.practicalExamDate || 'Pending Schedule'}
                                                </p>
                                                <span className={`text-xs font-extrabold px-3 py-1 rounded border inline-block ${selectedStudent.practicalStatus === 'PASSED'
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                                                    }`}>
                                                    {selectedStudent.practicalStatus || 'SCHEDULED'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Sticky Footer Area */}
                        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex justify-between items-center flex-shrink-0">
                            <div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-wide block">Verification Status</span>
                                <span className={`inline-flex px-4 py-1.5 rounded-xl text-xs font-black border mt-1 shadow-sm uppercase tracking-wider ${selectedStudent.approvalStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    selectedStudent.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}>
                                    {selectedStudent.approvalStatus}
                                </span>
                            </div>
                            <div className="flex gap-4">
                                {selectedStudent.approvalStatus !== 'approved' && (
                                    <button
                                        onClick={() => handleApproveStudent(selectedStudent._id, 'approved')}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-base font-bold shadow-md transition-all active:scale-95"
                                    >
                                        Approve
                                    </button>
                                )}
                                {selectedStudent.approvalStatus !== 'rejected' && (
                                    <button
                                        onClick={() => handleApproveStudent(selectedStudent._id, 'rejected')}
                                        className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl text-base font-bold shadow-md transition-all active:scale-95"
                                    >
                                        Reject
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;