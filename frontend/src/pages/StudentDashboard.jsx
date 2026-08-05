import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Calendar, BookOpen, Video, FileText, Award, Clock, LogOut, CheckCircle, User as UserIcon, Mail, CreditCard, AlertTriangle, Building, Plus, Trash2, Upload, FileCheck, Image, ArrowLeft, Settings, Phone } from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const localUser = JSON.parse(localStorage.getItem('user') || 'null');
    const currentUser = user || localUser;

    // 📞 Backend එකෙන් ෆෝන් නම්බර් එක එවන්න පුළුවන් හැම විදිහක්ම Check කරනවා
    const userPhone = localUser?.contact || localUser?.contactNumber || currentUser?.contact || currentUser?.phone || currentUser?.contactNo || 'Not Available';    // 🔄 Navigation Tab State ('planner' හෝ 'profile')
    const [activeTab, setActiveTab] = useState('planner');

    const [selectedBranch, setSelectedBranch] = useState('Weliweriya');
    const [selectedInstructor, setSelectedInstructor] = useState('Mr. Perera (Weliweriya)');

    const [customDate, setCustomDate] = useState('');
    const [customTimeSlot, setCustomTimeSlot] = useState('08:30 AM - 10:30 AM');
    const [customSessionType, setCustomSessionType] = useState('Practical Driving');
    const [selectedSessions, setSelectedSessions] = useState([]);

    // 💳 Payment Slip Upload States
    const [paymentSlip, setPaymentSlip] = useState(null);
    const [slipPreview, setSlipPreview] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const [isSaved, setIsSaved] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const branchInstructors = {
        Weliweriya: ['Mr. Perera (Weliweriya)', 'Mr. Silva (Weliweriya)'],
        Ogodapola: ['Mr. Fernando (Ogodapola)', 'Miss. Jayasinghe (Ogodapola)'],
        Meerigama: ['Mr. Alwis (Meerigama)', 'Mr. Bandara (Meerigama)']
    };

    const timeSlots = [
        '08:30 AM - 10:30 AM',
        '10:40 AM - 12:40 PM',
        '01:00 PM - 03:00 PM',
        '03:30 PM - 05:30 PM',
        '06:30 PM - 08:30 PM (Night Test)'
    ];

    const handleBranchChange = (e) => {
        const branch = e.target.value;
        setSelectedBranch(branch);
        setSelectedInstructor(branchInstructors[branch][0]);
        setSelectedSessions([]);
        setIsSaved(false);
    };

    const handleAddCustomSession = () => {
        if (!customDate) {
            alert('Please select a valid date first!');
            return;
        }
        if (selectedSessions.length >= 3) {
            alert('You can only select a maximum of 3 preferred days!');
            return;
        }
        const isDuplicate = selectedSessions.some(
            s => s.date === customDate && s.time === customTimeSlot
        );
        if (isDuplicate) {
            alert('You have already added this specific date and time slot!');
            return;
        }

        const newSession = {
            id: Date.now(),
            type: customSessionType,
            date: customDate,
            time: customTimeSlot,
            branch: selectedBranch,
            instructor: selectedInstructor
        };

        setSelectedSessions([...selectedSessions, newSession]);
        setCustomDate('');
        setIsSaved(false);
    };

    const handleRemoveSession = (id) => {
        setSelectedSessions(selectedSessions.filter(session => session.id !== id));
        setIsSaved(false);
    };

    const handleSaveSchedules = () => {
        if (selectedSessions.length === 0) {
            alert('Please add at least one preferred day before saving.');
            return;
        }
        setBookingLoading(true);
        setTimeout(() => {
            setIsSaved(true);
            setBookingLoading(false);
            alert(`Successfully submitted your ${selectedSessions.length} custom preferred slots!`);
        }, 1000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentSlip(file);
            setUploadSuccess(false);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSlipPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setSlipPreview(null);
            }
        }
    };

    const handleUploadSlip = () => {
        if (!paymentSlip) {
            alert('Please select a payment slip file to upload first!');
            return;
        }
        setUploadLoading(true);
        setTimeout(() => {
            setUploadLoading(false);
            setUploadSuccess(true);
            alert('Your bank payment slip has been uploaded successfully for verification!');
        }, 1500);
    };

    const handleLogout = () => {
        if (typeof logout === 'function') { logout(); }
        localStorage.clear();
        window.location.href = '/login';
    };

    const formattedDate = currentUser?.registrationDate
        ? new Date(currentUser.registrationDate).toLocaleDateString()
        : new Date().toLocaleDateString();

    return (
        <div className="min-h-screen font-sans flex flex-col text-slate-800" style={{ backgroundColor: '#f8fafc' }}>

            {/* 🌟 Navigation Bar */}
            <nav className="bg-blue-600 text-white shadow-md px-10 py-6 flex justify-between items-center w-full">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('planner')}>
                    <Award className="w-9 h-9 text-amber-300" />
                    <span className="text-2xl font-black tracking-wider uppercase">New Paradise Learners</span>
                </div>

                <div className="flex items-center" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`font-black px-6 py-3 rounded-xl text-base flex items-center space-x-2 transition shadow-sm ${activeTab === 'profile'
                            ? 'bg-white text-blue-600 scale-105'
                            : 'bg-blue-700 bg-opacity-60 text-white hover:bg-blue-800'
                            }`}
                    >
                        <UserIcon className="w-5 h-5" />
                        <span>{currentUser?.name || 'Student Profile'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-xl transition flex items-center space-x-2 text-base shadow"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* 📦 Main Container */}
            <div style={{ maxWidth: '1480px', width: '100%', margin: '0 auto', paddingLeft: '60px', paddingRight: '60px', paddingTop: '80px', paddingBottom: '100px', boxSizing: 'border-box' }}>

                {activeTab === 'planner' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>

                        {/* 1. Header Welcome Block */}
                        <div className="bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-6" style={{ backgroundColor: '#ffffff', padding: '45px', borderRadius: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {currentUser?.name || 'Student'}! 👋</h1>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 text-base font-bold mt-2">
                                    <div className="flex items-center space-x-1.5">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        <span>{currentUser?.email || 'N/A'}</span>
                                    </div>

                                </div>
                            </div>
                            <div className="bg-green-50 border-2 border-green-500 text-green-700 px-7 py-3.5 rounded-xl flex items-center space-x-2 font-black text-lg shadow-sm self-start md:self-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <span>Approved Account</span>
                            </div>
                        </div>

                        {/* 2. Sessions Booking Section */}
                        <div className="bg-white flex flex-col" style={{ backgroundColor: '#ffffff', padding: '50px', borderRadius: '25px', borderTop: '6px solid #9333ea', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-slate-100 pb-6" style={{ marginBottom: '45px' }}>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-8 h-8 text-purple-600" />
                                    <h2 className="text-2xl font-black text-slate-900 tracking-wide">Custom Practice Session Planner</h2>
                                </div>
                                <div className="bg-purple-50 border-2 border-purple-200 text-purple-900 px-5 py-2.5 rounded-xl text-sm font-black flex items-center space-x-2 self-start sm:self-center">
                                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                                    <span>Your List: {selectedSessions.length} / 3 Days Added</span>
                                </div>
                            </div>

                            {/* Dropdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50 p-8 rounded-2xl border border-slate-200" style={{ marginBottom: '50px' }}>
                                <div className="space-y-4">
                                    <label className="text-base font-black text-slate-800 flex items-center space-x-2">
                                        <Building className="w-5 h-5 text-purple-600" />
                                        <span>1. Select Branch:</span>
                                    </label>
                                    <select
                                        value={selectedBranch}
                                        onChange={handleBranchChange}
                                        className="w-full bg-white border-2 border-slate-200 focus:border-purple-500 p-4 rounded-xl font-bold text-base text-slate-900 outline-none transition shadow-sm"
                                    >
                                        <option value="Weliweriya">Weliweriya Branch</option>
                                        <option value="Ogodapola">Ogodapola Branch</option>
                                        <option value="Meerigama">Meerigama Branch</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-base font-black text-slate-800 flex items-center space-x-2">
                                        <UserIcon className="w-5 h-5 text-purple-600" />
                                        <span>2. Select Available Instructor:</span>
                                    </label>
                                    <select
                                        value={selectedInstructor}
                                        onChange={(e) => { setSelectedInstructor(e.target.value); setIsSaved(false); }}
                                        className="w-full bg-white border-2 border-slate-200 focus:border-purple-500 p-4 rounded-xl font-bold text-base text-slate-900 outline-none transition shadow-sm"
                                    >
                                        {branchInstructors[selectedBranch].map((instructorName, idx) => (
                                            <option key={idx} value={instructorName}>{instructorName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Inputs Picker Panel */}
                            <div className="bg-purple-50 bg-opacity-40 rounded-2xl border-2 border-dashed border-purple-200" style={{ marginBottom: '50px', padding: '45px' }}>
                                <h3 className="text-xl font-black text-purple-950" style={{ marginBottom: '35px' }}>🗓️ Choose & Add a Practice Session</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10" style={{ marginBottom: '40px' }}>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-wide">Select Date:</label>
                                        <input
                                            type="date"
                                            value={customDate}
                                            onChange={(e) => setCustomDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-white border-2 border-slate-200 focus:border-purple-500 p-4 rounded-xl font-bold text-base text-slate-900 outline-none shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-wide">Select Time Slot:</label>
                                        <select
                                            value={customTimeSlot}
                                            onChange={(e) => setCustomTimeSlot(e.target.value)}
                                            className="w-full bg-white border-2 border-slate-200 focus:border-purple-500 p-4 rounded-xl font-bold text-base text-slate-900 outline-none shadow-sm"
                                        >
                                            {timeSlots.map((slot, index) => (
                                                <option key={index} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-wide">Training Type:</label>
                                        <select
                                            value={customSessionType}
                                            onChange={(e) => setCustomSessionType(e.target.value)}
                                            className="w-full bg-white border-2 border-slate-200 focus:border-purple-500 p-4 rounded-xl font-bold text-base text-slate-900 outline-none shadow-sm"
                                        >
                                            <option value="Practical Driving">Practical Driving (ප්‍රායෝගික පුහුණුව)</option>
                                            <option value="Theory Revision">Theory Revision (තියරි රිවිෂන්)</option>
                                            <option value="Night Driving Test">Night Driving Test (රාත්‍රී ඩ්‍රයිවින්)</option>
                                            <option value="Exam Preparation">Exam Preparation (විභාග පෙරහුරුව)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-start">
                                    <button
                                        type="button"
                                        onClick={handleAddCustomSession}
                                        disabled={selectedSessions.length >= 3}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-black px-8 py-4 rounded-xl text-base transition flex items-center space-x-2 shadow disabled:opacity-40"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Add This Session to List</span>
                                    </button>
                                </div>
                            </div>

                            {/* Cards List */}
                            <div style={{ marginBottom: '50px' }}>
                                <h4 className="text-lg font-black text-slate-800" style={{ marginBottom: '30px' }}>Your Added Preference Slots:</h4>
                                {selectedSessions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        {selectedSessions.map((session) => (
                                            <div key={session.id} className="bg-white border-2 border-purple-500 rounded-2xl p-7 shadow-sm relative flex flex-col justify-between min-h-[200px]">
                                                <button onClick={() => handleRemoveSession(session.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="space-y-5 pr-6">
                                                    <div className="flex flex-wrap gap-2.5">
                                                        <span className="bg-purple-100 text-purple-900 text-xs font-black px-3.5 py-1.5 rounded-lg">
                                                            {session.type}
                                                        </span>
                                                        <span className="bg-blue-50 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-lg">
                                                            📍 {session.branch}
                                                        </span>
                                                    </div>
                                                    <div className="text-slate-900 space-y-3 text-sm">
                                                        <p className="text-xl font-black text-slate-950">🗓️ {session.date}</p>
                                                        <p className="font-bold text-slate-700 flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-slate-400" />
                                                            <span>{session.time}</span>
                                                        </p>
                                                        <p className="text-slate-600 font-medium">
                                                            Instructor: <span className="font-black text-slate-800">{session.instructor}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-14 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-base font-bold">
                                        No custom dates added yet. Choose a date above and click "Add This Session".
                                    </div>
                                )}
                            </div>

                            {/* Save Button */}
                            <div className="pt-6 border-t-2 border-slate-100 flex justify-end">
                                <button
                                    onClick={handleSaveSchedules}
                                    disabled={bookingLoading || selectedSessions.length === 0}
                                    className={`px-10 py-4.5 rounded-xl font-black text-base shadow transition ${isSaved ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
                                        }`}
                                >
                                    {bookingLoading ? 'Saving...' : isSaved ? '✓ All Custom Schedules Saved' : `Confirm & Save Custom (${selectedSessions.length}) Days`}
                                </button>
                            </div>
                        </div>

                        {/* 3. Online Resources Section */}
                        <div className="bg-white flex flex-col" style={{ backgroundColor: '#ffffff', padding: '50px', borderRadius: '25px', borderTop: '6px solid #10b981', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                            <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-2 border-b-2 border-slate-100 pb-6" style={{ marginBottom: '40px' }}>
                                <BookOpen className="w-8 h-8 text-emerald-600" />
                                <span>Online Resources & Learning Materials</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="border-2 border-slate-100 rounded-2xl p-8 bg-slate-50 hover:border-emerald-200 transition flex items-start space-x-5">
                                    <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><FileText className="w-8 h-8" /></div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Traffic Rules & Regulations</h3>
                                        <p className="text-base text-slate-500 mt-2">Learn essential highway codes and road signs.</p>
                                        <a href="#" className="text-sm text-blue-600 font-black hover:underline inline-block mt-5 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">Access PDF →</a>
                                    </div>
                                </div>
                                <div className="border-2 border-slate-100 rounded-2xl p-8 bg-slate-50 hover:border-emerald-200 transition flex items-start space-x-5">
                                    <div className="bg-red-100 p-4 rounded-xl text-red-600"><Video className="w-8 h-8" /></div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Road Safety Video Course</h3>
                                        <p className="text-base text-slate-500 mt-2">Interactive clips demonstrating safe driving techniques.</p>
                                        <a href="#" className="text-sm text-blue-600 font-black hover:underline inline-block mt-5 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">Watch Video →</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Payment Slip Upload Section */}
                        <div className="bg-white flex flex-col" style={{ backgroundColor: '#ffffff', padding: '50px', borderRadius: '25px', borderTop: '6px solid #eab308', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                            <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-2 border-b-2 border-slate-100 pb-6" style={{ marginBottom: '40px' }}>
                                <CreditCard className="w-8 h-8 text-yellow-500" />
                                <span>Upload Your Bank Payment Slip</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 bg-slate-50 text-center hover:border-yellow-500 transition flex flex-col items-center justify-center relative min-h-[280px]">
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 mb-4">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800">Drag & Drop or Click to Upload</h3>
                                    <p className="text-sm text-slate-400 mt-2 font-bold">Supports JPG, PNG or PDF formats (Max 5MB)</p>
                                    {paymentSlip && (
                                        <div className="mt-5 bg-yellow-50 border border-yellow-300 text-yellow-800 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2">
                                            <FileCheck className="w-4 h-4 text-yellow-600" />
                                            <span>Selected: {paymentSlip.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-8 flex flex-col justify-between min-h-[280px]">
                                    <div>
                                        <h4 className="text-base font-black text-slate-800 flex items-center space-x-2" style={{ marginBottom: '20px' }}>
                                            <Image className="w-5 h-5 text-slate-400" />
                                            <span>Slip Preview Cover</span>
                                        </h4>
                                        {slipPreview ? (
                                            <div className="flex justify-center bg-white p-4 rounded-xl border border-slate-200 max-h-[180px] overflow-hidden shadow-sm">
                                                <img src={slipPreview} alt="Payment Slip Preview" className="h-full object-contain max-h-[140px]" />
                                            </div>
                                        ) : paymentSlip && paymentSlip.type === 'application/pdf' ? (
                                            <div className="text-center py-10 bg-white rounded-xl border border-slate-200 text-blue-600 font-bold text-sm">
                                                📄 PDF Document Loaded (No Image Preview Available)
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-slate-100/60 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm font-bold">
                                                No document or image selected yet.
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-6 flex justify-end">
                                        <button
                                            onClick={handleUploadSlip}
                                            disabled={uploadLoading || !paymentSlip}
                                            className={`px-10 py-4.5 rounded-xl font-black text-base shadow transition w-full md:w-auto ${uploadSuccess ? 'bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-slate-950 disabled:opacity-40'
                                                }`}
                                        >
                                            {uploadLoading ? 'Uploading File...' : uploadSuccess ? '✓ Slip Uploaded Successfully' : 'Upload Bank Slip Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ====================================================================== */}
                {/* 👤 Tab 2: PERSONAL STUDENT PROFILE VIEW                               */}
                {/* ====================================================================== */}
                {activeTab === 'profile' && (
                    <div className="bg-white flex flex-col animate-fadeIn" style={{ backgroundColor: '#ffffff', padding: '55px', borderRadius: '25px', borderTop: '6px solid #2563eb', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-slate-100 pb-6" style={{ marginBottom: '55px' }}>
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                                    <Settings className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Student Profile</h2>
                                    <p className="text-slate-400 text-base font-bold mt-2">Manage your private documentation and learning status</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveTab('planner')}
                                className="mt-5 sm:mt-0 bg-slate-800 hover:bg-slate-900 text-white font-black px-6 py-3.5 rounded-xl text-base transition flex items-center space-x-2 shadow self-start sm:self-center"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back to Dashboard Planner</span>
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>

                            {/* 🏢 SECTION 1: Account Basics */}
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-3" style={{ marginBottom: '30px' }}>💳 Primary Account Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-slate-700">
                                    <div className="bg-slate-50 p-7 rounded-2xl border-2 border-slate-200/70 shadow-sm space-y-4">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-black">Full Name</span>
                                        <div className="flex items-center space-x-3 text-slate-950">
                                            <UserIcon className="w-6 h-6 text-blue-600 shrink-0" />
                                            <span className="text-xl font-black tracking-tight">{currentUser?.name || 'Not Available'}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-7 rounded-2xl border-2 border-slate-200/70 shadow-sm space-y-4">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-black">Email Address</span>
                                        <div className="flex items-center space-x-3 text-slate-950">
                                            <Mail className="w-6 h-6 text-blue-600 shrink-0" />
                                            <span className="text-base font-black break-all tracking-tight">{currentUser?.email || 'Not Available'}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-7 rounded-2xl border-2 border-slate-200/70 shadow-sm space-y-4">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-black">NIC / ID Number</span>
                                        <div className="flex items-center space-x-3 text-slate-950">
                                            <CreditCard className="w-6 h-6 text-blue-600 shrink-0" />
                                            <span className="text-xl font-black tracking-tight">{currentUser?.nic || 'Not Available'}</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/70 p-7 rounded-2xl border-2 border-blue-200 shadow-sm space-y-4">
                                        <span className="text-xs text-blue-600 uppercase tracking-wider block font-black">Registration Date</span>
                                        <span className="text-xl font-black text-blue-800 block tracking-tight">🗓️ {formattedDate || 'Not Available'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 📞 SECTION 2: Contact & Training Preferences */}
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-l-4 border-purple-600 pl-3" style={{ marginBottom: '30px' }}>📞 Contact & Training Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="bg-slate-50 p-7 rounded-2xl border-2 border-slate-200/70 shadow-sm space-y-4">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-black">Contact Number</span>
                                        <div className="text-slate-950 text-xl font-black tracking-tight">
                                            📞 {
                                                currentUser?.contact ||
                                                currentUser?.contactNumber ||
                                                JSON.parse(localStorage.getItem('user'))?.contact ||
                                                JSON.parse(localStorage.getItem('user'))?.contactNumber ||
                                                'Not Available'
                                            }
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-7 rounded-2xl border-2 border-slate-200/70 shadow-sm md:col-span-2 space-y-4">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider block font-black">Residential Address</span>
                                        <div className="text-slate-950 text-xl font-black tracking-tight">
                                            📍 {currentUser?.address || 'Not Available'}
                                        </div>
                                    </div>

                                    <div className="bg-purple-50/70 p-7 rounded-2xl border-2 border-purple-200 shadow-sm md:col-span-3 space-y-4">
                                        <span className="text-xs text-purple-700 uppercase tracking-wider block font-black">Registered Vehicle Categories</span>
                                        <div className="flex flex-wrap gap-3.5 mt-2">
                                            {currentUser?.vehicleCategories && currentUser.vehicleCategories.length > 0 ? (
                                                currentUser.vehicleCategories.map((cat, idx) => (
                                                    <span key={idx} className="bg-purple-700 text-white text-sm font-black px-4 py-2.5 rounded-xl shadow-md tracking-wide">
                                                        {cat}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-500 text-sm font-medium italic">No Categories Registered</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 📑 SECTION 3: Progress Status */}
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest border-l-4 border-emerald-600 pl-3" style={{ marginBottom: '30px' }}>📋 Documentation & Progress Track</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className={`p-8 rounded-2xl border-2 flex flex-col justify-between shadow-sm min-h-[180px] ${currentUser?.medicalStatus === 'Valid' ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                                        <div className="space-y-4">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider block font-black">Medical Certificate Status</span>
                                            <span className={`text-xl font-black block tracking-tight ${currentUser?.medicalStatus === 'Valid' ? 'text-green-800' : 'text-amber-800'}`}>
                                                {currentUser?.medicalStatus === 'Valid' ? '✓ Verified & Valid' : '⚠️ Pending / Not Submitted'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-bold mt-5">Required before participating in the trial exam.</p>
                                    </div>

                                    <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-200/70 shadow-sm flex flex-col justify-between min-h-[180px]">
                                        <div className="space-y-4">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider block font-black">Exam Progress</span>
                                            <div className="space-y-3.5 mt-2 text-base font-black text-slate-950 tracking-tight">
                                                <div className="flex justify-between items-center">
                                                    <span>1. Theory Exam:</span>
                                                    <span className={`px-3 py-1 rounded-xl text-xs font-black ${currentUser?.theoryPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                                                        {currentUser?.theoryPassed ? 'PASSED' : 'PENDING'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>2. Practical Trial:</span>
                                                    <span className={`px-3 py-1 rounded-xl text-xs font-black ${currentUser?.practicalPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                                                        {currentUser?.practicalPassed ? 'PASSED' : 'PENDING'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50/70 border-2 border-emerald-300 p-8 rounded-2xl shadow-sm flex flex-col justify-between min-h-[180px]">
                                        <div className="space-y-4">
                                            <span className="text-xs text-emerald-700 uppercase tracking-wider block font-black">Payment Summary</span>
                                            <div className="space-y-3 text-base font-black text-emerald-950 tracking-tight">
                                                <div className="flex justify-between">
                                                    <span>Total Course Fee:</span>
                                                    <span className="text-slate-900">LKR {currentUser?.totalFee || '0'}</span>
                                                </div>
                                                <div className="flex justify-between text-green-800">
                                                    <span>Paid Amount:</span>
                                                    <span>LKR {currentUser?.paidAmount || '0'}</span>
                                                </div>
                                                <div className="flex justify-between text-red-600 border-t-2 border-emerald-300 pt-3 mt-3 text-lg font-black">
                                                    <span>Due Balance:</span>
                                                    <span>LKR {currentUser?.dueBalance || '0'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;