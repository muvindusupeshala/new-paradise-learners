import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { MapPin, Phone, Mail, Users, BookOpen, Award, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Default branches with formatted tel links
    const defaultBranches = [
        {
            _id: '1',
            name: 'Ogodapola Branch',
            location: 'Ogodapola',
            phones: [
                { display: '0761322844', raw: '0761322844' }
            ],
            email: 'ogodapola@paradiselearners.com'
        },
        {
            _id: '2',
            name: 'Mirigama Branch',
            location: 'Kandalama Junction, Mirigama',
            phones: [
                { display: '0761322844', raw: '0761322844' },
                { display: '0334460350', raw: '0334460350' }
            ],
            email: 'mirigama@paradiselearners.com'
        },
        {
            _id: '3',
            name: 'Weliweriya Branch',
            location: 'Weliweriya',
            phones: [
                { display: '0773933259', raw: '0773933259' }
            ],
            email: 'weliweriya@paradiselearners.com'
        }
    ];

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
            if (response.data.branches && response.data.branches.length > 0) {
                // DB එකෙන් එන string numbers dynamic split කර clickable array එකක් බවට හැරවීම
                const formattedBranches = response.data.branches.map(b => {
                    const phoneList = b.phone ? b.phone.split('/').map(p => p.trim()) : [];
                    return {
                        ...b,
                        phones: phoneList.map(p => ({ display: p, raw: p.replace(/\s+/g, '') }))
                    };
                });
                setBranches(formattedBranches);
            } else {
                setBranches(defaultBranches);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            setBranches(defaultBranches);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#1e293b', margin: 0, padding: 0 }}>

            {/* TOP NAVBAR */}
            <nav style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '15px 30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>🎓</span>
                        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
                            New Paradise <span style={{ color: '#ef4444' }}>Learners</span>
                        </h1>
                    </div>

                    {/* Nav Actions */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <Link to="/student-dashboard" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 20px', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' }}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" style={{ backgroundColor: 'transparent', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.4)', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
                                    Login
                                </Link>
                                <Link to="/register" style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', fontSize: '14px', boxShadow: '0 2px 4px rgba(220,38,38,0.3)' }}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 20px', boxSizing: 'border-box', flexGrow: 1 }}>

                {/* HERO BANNER SECTION */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', marginBottom: '40px', border: '1px solid #e2e8f0' }}>

                    {/* Left Text */}
                    <div style={{ flex: '1 1 500px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                            Premier Driving School System
                        </span>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', lineHeight: '1.2' }}>
                            Welcome to <br />
                            <span style={{ color: '#1d4ed8' }}>New Paradise Learners</span>
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 28px 0' }}>
                            Comprehensive training for safe and responsible driving. Master the roads with our certified driving instructors and flexible modern schedule.
                        </p>

                        {!isAuthenticated && (
                            <div>
                                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#dc2626', color: '#ffffff', padding: '12px 28px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 12px rgba(220,38,38,0.25)', gap: '8px' }}>
                                    Register Now <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Graphic Box */}
                    <div style={{ flex: '1 1 400px', background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#ffffff' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '36px' }}>
                            🚗
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Ready to Start Your Journey?</h3>
                        <p style={{ color: '#93c5fd', fontSize: '14px', maxWidth: '280px', margin: 0 }}>
                            Join hundreds of successful drivers who have completed our structured program.
                        </p>
                    </div>
                </div>

                {/* FEATURES (3 GRID CARDS) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>

                    {/* Feature 1 */}
                    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #1d4ed8', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <Users size={24} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>Expert Instructors</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                            Learn from certified and experienced driving professionals tailored to your learning pace.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #dc2626', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <BookOpen size={24} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>Digital Resources</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                            Access online learning materials, theoretical guidelines, and exams anytime.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '4px solid #1d4ed8', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <Award size={24} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>Certification</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                            Receive recognized driving certification upon completion of your trial readiness.
                        </p>
                    </div>
                </div>

                {/* BRANCHES DYNAMIC SECTION */}
                <section style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin color="#dc2626" size={24} /> Our Branches
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                            <p>Loading branches...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {branches.map((branch) => (
                                <div key={branch._id} style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a', margin: '0 0 12px 0' }}>{branch.name}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569' }}>

                                        {/* Location */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={16} color="#dc2626" />
                                            <span>{branch.location}</span>
                                        </div>

                                        {/* Clickable Phone Numbers */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <Phone size={16} color="#1d4ed8" style={{ marginTop: '2px', flexShrink: 0 }} />
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {branch.phones && branch.phones.length > 0 ? (
                                                    branch.phones.map((p, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <a
                                                                href={`tel:${p.raw}`}
                                                                style={{ color: '#1d4ed8', fontWeight: '600', textDecoration: 'none' }}
                                                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                                            >
                                                                {p.display}
                                                            </a>
                                                            {idx < branch.phones.length - 1 && <span>/</span>}
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <span>No contact available</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        {branch.email && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Mail size={16} color="#1d4ed8" />
                                                <a href={`mailto:${branch.email}`} style={{ color: '#475569', textDecoration: 'none' }}>
                                                    {branch.email}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {branch.description && (
                                        <p style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>{branch.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>

            {/* FOOTER */}
            <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '12px', padding: '20px 0', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <p style={{ margin: 0 }}>&copy; 2026 New Paradise Learners. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;