import React, { useState, useEffect } from 'react';
import { Building2, Users, UserCheck, Car, Search, MapPin, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BranchManagement = () => {
    const [selectedBranchName, setSelectedBranchName] = useState('Ogodapola');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // අපේ Branches 3
    const branchList = [
        { id: 'ogodapola', name: 'Ogodapola', fullName: 'Ogodapola Branch' },
        { id: 'weliweriya', name: 'Weliweriya', fullName: 'Weliweriya Branch' },
        { id: 'meerigama', name: 'Meerigama', fullName: 'Meerigama Branch' }
    ];

    // System එකේ Register වෙලා ඉන්න ඔක්කොම Students ලව Backend එකෙන් ගෙන්නා ගැනීම
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                // ⚠️ මෙතනට ඔයාගේ Backend API URL එක දාන්න (e.g., '/api/students' හෝ 'http://localhost:5000/api/users')
                const response = await axios.get('/api/students');
                setStudents(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch registered students:", err);
                setError("Registered students data load කරගැනීමට නොහැකි විය.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Select කරලා තියෙන Branch එකට විතරක් අදාළ Students ලව Filter කිරීම
    const branchStudents = students.filter(student =>
        student.branch && student.branch.toLowerCase() === selectedBranchName.toLowerCase()
    );

    // Active Status එකේ ඉන්න අයගේ ගණන
    const activeStudentsCount = branchStudents.filter(student =>
        student.status === 'Active' || student.status === 'ENROLLED' || !student.status
    ).length;

    // Search bar එකෙන් Name, NIC හෝ Email එක අනුව Filter කිරීම
    const filteredStudents = branchStudents.filter(student =>
        (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.nic && student.nic.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8 p-4 sm:p-6 bg-slate-50 min-h-screen">

            {/* Header Area */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <span className="text-xs font-black uppercase text-blue-600 tracking-wider bg-blue-50 px-3 py-1 rounded-lg">
                        System Live Data
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-1">
                        🏢 Real-time Branch & Registered Student Directory
                    </h2>
                    <p className="text-sm font-semibold text-slate-500">
                        දැනට පද්ධතියේ ලියාපදිංචි වී සිටින සිසුන්ගේ ශාඛා මට්ටමේ තොරතුරු.
                    </p>
                </div>
            </div>

            {/* Branch Cards (Ogodapola, Weliweriya, Meerigama) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {branchList.map((branch) => {
                    const isSelected = selectedBranchName.toLowerCase() === branch.name.toLowerCase();
                    const countForThisBranch = students.filter(s => s.branch && s.branch.toLowerCase() === branch.name.toLowerCase()).length;

                    return (
                        <div
                            key={branch.id}
                            onClick={() => setSelectedBranchName(branch.name)}
                            className={`cursor-pointer p-6 rounded-3xl transition-all duration-200 border ${isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.02]'
                                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:shadow-md'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${isSelected ? 'bg-blue-500/50' : 'bg-blue-50 text-blue-600'}`}>
                                    <Building2 className="w-7 h-7" />
                                </div>
                                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    Live Count
                                </span>
                            </div>

                            <h3 className="text-xl font-black tracking-tight mb-1">{branch.fullName}</h3>
                            <p className={`text-xs flex items-center gap-1 mb-6 font-semibold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                <MapPin className="w-4 h-4" /> {branch.name}, Sri Lanka
                            </p>

                            <div className="pt-3 border-t border-slate-200/30">
                                <p className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                    Registered Students
                                </p>
                                <p className="text-3xl font-black">{loading ? '...' : countForThisBranch}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Loading Display */}
            {loading && (
                <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="font-extrabold text-slate-600">Database එකෙන් Registered Students data ලබා ගනිමින් පවතී...</p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-center gap-4 text-rose-700">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            {/* Selected Branch Content (Table & Details) */}
            {!loading && !error && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">

                    {/* Branch Overview Counters */}
                    <div>
                        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            {selectedBranchName} Branch Breakdown
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400">Total Registered</p>
                                    <p className="text-2xl font-black text-slate-800">{branchStudents.length}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400">Active Status</p>
                                    <p className="text-2xl font-black text-slate-800">{activeStudentsCount}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex items-center gap-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                    <Car className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-400">Branch Percentage</p>
                                    <p className="text-2xl font-black text-slate-800">
                                        {students.length > 0 ? Math.round((branchStudents.length / students.length) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="text-lg font-black text-slate-800">
                                Live Student Roster ({branchStudents.length})
                            </h3>

                            {/* Search Box */}
                            <div className="relative w-full sm:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Name, NIC, or Email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Table Layout */}
                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Student Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">NIC</th>
                                        <th className="p-4">Contact Phone</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student._id || student.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-4 font-black text-slate-800">{student.name || 'N/A'}</td>
                                                <td className="p-4 text-slate-600">{student.email || 'N/A'}</td>
                                                <td className="p-4 font-mono font-bold">{student.nic || 'N/A'}</td>
                                                <td className="p-4 text-slate-600">{student.contact || student.phone || 'N/A'}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`text-xs px-3 py-1 rounded-full font-black ${student.status === 'Active' || !student.status
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                        }`}>
                                                        {student.status || 'ACTIVE'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-400 font-semibold">
                                                {selectedBranchName} branch එකට අදාළව ලියාපදිංචි වූ සිසුන් කිසිවෙකු හමු නොවීය.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default BranchManagement;