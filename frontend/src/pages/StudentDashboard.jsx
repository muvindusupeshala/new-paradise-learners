import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Calendar, BookOpen, Video, FileText, Award, Clock, LogOut, CheckCircle, User as UserIcon, Mail, CreditCard, AlertTriangle, Building, Plus, Trash2, Upload, FileCheck, Image, ArrowLeft, Settings } from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const localUser = JSON.parse(localStorage.getItem('user') || 'null');
    const currentUser = user || localUser;

    // 🔄 Navigation Tab State ('planner' හෝ 'profile')
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
        <div className="min-h-screen bg-slate-100 font-sans flex flex-col text-slate-800" style={{ backgroundColor: '#f1f5f9' }}>

            {/* 🌟 Navigation Bar - image_8bb503.png එකේ තිබ්බ හිරවීම inline style `gap` එකෙන් බලෙන්ම විසඳුවා */}
            <nav className="bg-blue-600 text-white shadow-md px-8 py-5 flex justify-between items-center w-full">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('planner')}>
                    <Award className="w-9 h-9 text-amber-300" />
                    <span className="text-2xl font-black tracking-wider uppercase">New Paradise Learners</span>
                </div>

                {/* 🛠️ මෙතනට inline style එකක් දාලා gap එක 24px වලින් බලෙන්ම ඈත් කළා */}
                <div className="flex items-center" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`font-black px-5 py-2.5 rounded-xl text-base flex items-center space-x-2 transition shadow-sm ${activeTab === 'profile'
                                ? 'bg-white text-blue-600 scale-105'
                                : 'bg-blue-700 bg-opacity-60 text-white hover:bg-blue-800'
                            }`}
                    >
                        <UserIcon className="w-5 h-5" />
                        <span>{currentUser?.name || 'Student Profile'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-black px-5 py-2.5 rounded-xl transition flex items-center space-x-2 text-base shadow"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* 📦 Main Container */}
            <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px', paddingTop: '50px', paddingBottom: '50px', boxSizing: 'border-box' }}>

                {/* ====================================================================== */}
                {/* 📂 Tab 1: PLANNER DASHBOARD VIEW                                      */}
                {/* ====================================================================== */}
                {activeTab === 'planner' && (
                    <>
                        {/* Header Welcome Block */}
                        <div className="bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-6" style={{ marginBottom: '50px', backgroundColor: '#ffffff', padding: '32px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {currentUser?.name || 'Student'}! 👋</h1>
                                <p className="text-slate-500 text-lg mt-1.5">Pick your preferred branch, instructor, and choose any 3 practice dates below</p>
                            </div>
                            <div className="bg-green-50 border-2 border-green-500 text-green-700 px-6 py-3 rounded-xl flex items-center space-x-2 font-black text-lg shadow-sm self-start md:self-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <span>Approved Account</span>
                            </div>
                        </div>

                        {/* Sessions Booking Section */}
                        <div className="bg-white flex flex-col" style={{ marginBottom: '50px', backgroundColor: '#ffffff', padding: '32px', borderRadius: '20px', borderTop: '5px solid #9333ea', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4" style={{ marginBottom: '30px' }}>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-7 h-7 text-purple-600" />
                                    <h2 className="text-2xl font-black text-slate-900">Custom Practice Session Planner</h2>
                                </div>
                                <div className="bg-purple-50 border-2 border-purple-200 text-purple-900 px-4 py-2 rounded-xl text-sm font-black flex items-center space-x-2 self-start sm:self-center">
                                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                                    <span>Your List: {selectedSessions.length} / 3 Days Added</span>
                                </div>
                            </div>

                            {/* Dropdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200" style={{ marginBottom: '35px' }}>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-800 flex items-center space-x-1.5">
                                        <Building className="w-4 h-4 text-purple-600" />
                                        <span>1. Select Branch:</span>
                                    </label>
                                    <select
                                        value={selectedBranch}
                                        onChange={handleBranchChange}
                                        className="w-full bg-white border border-slate-300 focus:border-purple-500 p-3.5 rounded-xl font-bold text-base text-slate-900 outline-none transition shadow-sm"
                                    >
                                        <option value="Weliweriya">Weliweriya Branch</option>
                                        <option value="Ogodapola">Ogodapola Branch</option>
                                        <option value="Meerigama">Meerigama Branch</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-800 flex items-center space-x-1.5">
                                        <UserIcon className="w-4 h-4 text-purple-600" />
                                        <span>2. Select Available Instructor:</span>
                                    </label>
                                    <select
                                        value={selectedInstructor}
                                        onChange={(e) => { setSelectedInstructor(e.target.value); setIsSaved(false); }}
                                        className="w-full bg-white border border-slate-300 focus:border-purple-500 p-3.5 rounded-xl font-bold text-base text-slate-900 outline-none transition shadow-sm"
                                    >
                                        {branchInstructors[selectedBranch].map((instructorName, idx) => (
                                            <option key={idx} value={instructorName}>{instructorName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Inputs Picker Panel */}
                            <div className="bg-purple-50 bg-opacity-40 p-6 rounded-xl border-2 border-dashed border-purple-200" style={{ marginBottom: '35px', padding: '30px' }}>
                                <h3 className="text-base font-black text-purple-950" style={{ marginBottom: '25px' }}>🗓️ Choose & Add a Practice Session</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '30px' }}>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-wide">Select Date:</label>
                                        <input
                                            type="date"
                                            value={customDate}
                                            onChange={(e) => setCustomDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-white border border-slate-300 focus:border-purple-500 p-3 rounded-xl font-bold text-base text-slate-900 outline-none shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-wide">Select Time Slot:</label>
                                        <select
                                            value={customTimeSlot}
                                            onChange={(e) => setCustomTimeSlot(e.target.value)}
                                            className="w-full bg-white border border-slate-300 focus:border-purple-500 p-3 rounded-xl font-bold text-base text-slate-900 outline-none shadow-sm"
                                        >
                                            {timeSlots.map((slot, index) => (
                                                <option key={index} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-600 uppercase tracking-wide">Training Type:</label>
                                        <select
                                            value={customSessionType}
                                            onChange={(e) => setCustomSessionType(e.target.value)}
                                            className="w-full bg-white border border-slate-300 focus:border-purple-500 p-3 rounded-xl font-bold text-base text-slate-900 outline-none shadow-sm"
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
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-xl text-base transition flex items-center space-x-2 shadow disabled:opacity-40"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Add This Session to List</span>
                                    </button>
                                </div>
                            </div>

                            {/* Cards List */}
                            <div style={{ marginBottom: '35px' }}>
                                <h4 className="text-base font-black text-slate-800" style={{ marginBottom: '20px' }}>Your Added Preference Slots:</h4>
                                {selectedSessions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {selectedSessions.map((session) => (
                                            <div key={session.id} className="bg-white border-2 border-purple-500 rounded-xl p-5 shadow-sm relative flex flex-col justify-between">
                                                <button onClick={() => handleRemoveSession(session.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="space-y-3 pr-6">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <span className="bg-purple-100 text-purple-900 text-xs font-black px-2.5 py-1 rounded">
                                                            {session.type}
                                                        </span>
                                                        <span className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded">
                                                            📍 {session.branch}
                                                        </span>
                                                    </div>
                                                    <div className="text-slate-900 space-y-1 text-sm">
                                                        <p className="text-base font-black text-slate-950">🗓️ {session.date}</p>
                                                        <p className="font-bold text-slate-700 flex items-center gap-1">
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
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-base font-bold">
                                        No custom dates added yet. Choose a date above and click "Add This Session".
                                    </div>
                                )}
                            </div>

                            {/* Save Button */}
                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleSaveSchedules}
                                    disabled={bookingLoading || selectedSessions.length === 0}
                                    className={`px-8 py-3.5 rounded-xl font-black text-base shadow transition ${isSaved ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
                                        }`}
                                >
                                    {bookingLoading ? 'Saving...' : isSaved ? '✓ All Custom Schedules Saved' : `Confirm & Save Custom (${selectedSessions.length}) Days`}
                                </button>
                            </div>
                        </div>

                        {/* Online Resources Section */}
                        <div className="bg-white flex flex-col" style={{ marginBottom: '50px', backgroundColor: '#ffffff', padding: '32px', borderRadius: '20px', borderTop: '5px solid #10b981', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-4" style={{ marginBottom: '25px' }}>
                                <BookOpen className="w-7 h-7 text-emerald-600" />
                                <span>Online Resources & Learning Materials</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 hover:border-emerald-200 transition flex items-start space-x-4">
                                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><FileText className="w-7 h-7" /></div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">Traffic Rules & Regulations</h3>
                                        <p className="text-sm text-slate-500 mt-1">Learn essential highway codes and road signs.</p>
                                        <a href="#" className="text-sm text-blue-600 font-black hover:underline inline-block mt-3 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">Access PDF →</a>
                                    </div>
                                </div>
                                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 hover:border-emerald-200 transition flex items-start space-x-4">
                                    <div className="bg-red-100 p-3 rounded-xl text-red-600"><Video className="w-7 h-7" /></div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">Road Safety Video Course</h3>
                                        <p className="text-sm text-slate-500 mt-1">Interactive clips demonstrating safe driving techniques.</p>
                                        <a href="#" className="text-sm text-blue-600 font-black hover:underline inline-block mt-3 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">Watch Video →</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Slip Upload Section */}
                        <div className="bg-white flex flex-col" style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '20px', borderTop: '5px solid #eab308', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-4" style={{ marginBottom: '25px' }}>
                                <CreditCard className="w-7 h-7 text-yellow-500" />
                                <span>Upload Your Bank Payment Slip</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 text-center hover:border-yellow-500 transition flex flex-col items-center justify-center relative min-h-[220px]">
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 mb-3">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800">Drag & Drop or Click to Upload</h3>
                                    <p className="text-sm text-slate-400 mt-1 font-semibold">Supports JPG, PNG or PDF formats (Max 5MB)</p>
                                    {paymentSlip && (
                                        <div className="mt-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2">
                                            <FileCheck className="w-4 h-4 text-yellow-600" />
                                            <span>Selected: {paymentSlip.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between min-h-[220px]">
                                    <div>
                                        <h4 className="text-base font-black text-slate-800 flex items-center space-x-1.5" style={{ marginBottom: '15px' }}>
                                            <Image className="w-5 h-5 text-slate-400" />
                                            <span>Slip Preview Cover</span>
                                        </h4>
                                        {slipPreview ? (
                                            <div className="flex justify-center bg-white p-2 rounded-lg border border-slate-200 max-h-[140px] overflow-hidden shadow-sm">
                                                <img src={slipPreview} alt="Payment Slip Preview" className="h-full object-contain max-h-[120px]" />
                                            </div>
                                        ) : paymentSlip && paymentSlip.type === 'application/pdf' ? (
                                            <div className="text-center py-6 bg-white rounded-lg border border-slate-200 text-blue-600 font-bold text-sm">
                                                📄 PDF Document Loaded (No Image Preview Available)
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-slate-100/60 rounded-lg border border-dashed border-slate-200 text-slate-400 text-sm font-semibold">
                                                No document or image selected yet.
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={handleUploadSlip}
                                            disabled={uploadLoading || !paymentSlip}
                                            className={`px-8 py-3 rounded-xl font-black text-base shadow transition w-full md:w-auto ${uploadSuccess ? 'bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-slate-950 disabled:opacity-40'
                                                }`}
                                        >
                                            {uploadLoading ? 'Uploading File...' : uploadSuccess ? '✓ Slip Uploaded Successfully' : 'Upload Bank Slip Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ====================================================================== */}
                {/* 👤 Tab 2: PERSONAL STUDENT PROFILE VIEW                                */}
                {/* ====================================================================== */}
                {activeTab === 'profile' && (
                    <div className="bg-white flex flex-col animate-fadeIn" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '20px', borderTop: '5px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>

                        {/* Profile Header Block */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5" style={{ marginBottom: '35px' }}>
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                                    <Settings className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Student Profile</h2>
                                    <p className="text-slate-500 text-sm font-semibold mt-0.5">Manage your private documentation and account details</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveTab('planner')}
                                className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-900 text-white font-black px-5 py-2.5 rounded-xl text-base transition flex items-center space-x-2 shadow self-start sm:self-center"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back to Dashboard Planner</span>
                            </button>
                        </div>

                        {/* Profile Grid Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-base font-semibold text-slate-700" style={{ marginBottom: '40px' }}>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-bold">Full Name</span>
                                <div className="flex items-center space-x-2 text-slate-900">
                                    <UserIcon className="w-5 h-5 text-blue-500" />
                                    <span className="text-lg font-black">{currentUser?.name || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-bold">Email Address</span>
                                <div className="flex items-center space-x-2 text-slate-900">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                    <span className="text-base font-bold break-all">{currentUser?.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-bold">NIC / ID Number</span>
                                <div className="flex items-center space-x-2 text-slate-900">
                                    <CreditCard className="w-5 h-5 text-blue-500" />
                                    <span className="text-base font-bold">{currentUser?.nic || '123123123V'}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <span className="text-xs text-blue-500 uppercase tracking-wider block mb-2 font-bold">Registration Date</span>
                                <span className="text-lg font-black text-blue-700 block mt-0.5">🗓️ {formattedDate}</span>
                            </div>
                        </div>

                        {/* Future Custom Details Placeholder */}
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center bg-slate-50/50">
                            <p className="text-slate-400 font-bold text-base">⚙️ Additional profile variables and status analytics layout will be rendered here...</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default StudentDashboard;