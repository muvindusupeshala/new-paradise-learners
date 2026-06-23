import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 🔐 LocalStorage එකෙන් ලොග් වුණු යූසර්ගේ ප්‍රොෆයිල් විස්තර ගන්නවා
        const loggedInUser = localStorage.getItem('profile');
        if (!loggedInUser) {
            // යූසර් ලොග් වෙලා නැත්නම් කෙලින්ම ලොගින් පේජ් එකට ඇදලා හරවනවා
            navigate('/login');
        } else {
            setUser(JSON.parse(loggedInUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        // 🚪 LocalStorage එක ක්ලියර් කරලා ලොගින් පේජ් එකට යවනවා
        localStorage.clear();
        navigate('/login');
    };

    if (!user) return <div style={styles.loadingContainer}><h3>Loading...</h3></div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.welcome}>Welcome to Paradise Learners 🎉</h1>

                <div style={styles.profileBox}>
                    <h3 style={styles.sectionTitle}>👤 Customer Profile</h3>
                    {/* Backend එකෙන් එන response structure එක අනුව user.result හෝ user විදිහට ගන්න */}
                    <p style={styles.text}><strong>Full Name:</strong> {user.result?.fullName || user.fullName || "N/A"}</p>
                    <p style={styles.text}><strong>Username:</strong> {user.result?.username || user.username || "N/A"}</p>
                    <p style={styles.text}><strong>Branch:</strong> {user.result?.branch || user.branch || "N/A"}</p>
                </div>

                <button onClick={handleLogout} style={styles.button}>Logout</button>
            </div>
        </div>
    );
};

// ==========================================
// MODERN BLUE, RED & WHITE INLINE STYLES
// ==========================================
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc', // Clean White/Light Gray background
        padding: '10px'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc',
        color: '#2563eb',
        fontFamily: 'sans-serif'
    },
    card: {
        backgroundColor: '#ffffff', // Pure White Card
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Professional shadow
        borderTop: '5px solid #dc2626', // Top Red Accent Bar
        borderBottom: '1px solid #e2e8f0',
        borderLeft: '1px solid #e2e8f0',
        borderRight: '1px solid #e2e8f0',
        width: '450px',
        textAlign: 'center'
    },
    welcome: {
        color: '#1e3a8a', // Dark Pure Blue
        marginBottom: '25px',
        fontFamily: 'sans-serif',
        fontSize: '24px',
        fontWeight: 'bold'
    },
    profileBox: {
        backgroundColor: '#eff6ff', // Light Blue Box Background
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'left',
        marginBottom: '25px',
        border: '1px solid #bfdbfe' // Soft blue border
    },
    sectionTitle: {
        color: '#dc2626', // Bright Red Title
        marginTop: 0,
        marginBottom: '15px',
        fontFamily: 'sans-serif',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    text: {
        color: '#1e293b', // Dark Charcoal text for maximum readability
        margin: '10px 0',
        fontSize: '15px',
        fontFamily: 'sans-serif'
    },
    button: {
        padding: '12px 30px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#dc2626', // Pure Red Button
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)',
        transition: '0.3s background-color ease'
    }
};

export default Dashboard;