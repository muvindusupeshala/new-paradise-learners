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

    if (!user) return <div style={styles.container}><h3 style={{color: '#fff'}}>Loading...</h3></div>;

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

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', padding: '10px' },
    card: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '450px', textAlign: 'center' },
    welcome: { color: '#ffffff', marginBottom: '25px', fontFamily: 'sans-serif', fontSize: '26px' },
    profileBox: { backgroundColor: '#334155', padding: '20px', borderRadius: '8px', textAlign: 'left', marginBottom: '20px' },
    sectionTitle: { color: '#3b82f6', marginTop: 0, marginBottom: '15px', fontFamily: 'sans-serif' },
    text: { color: '#cbd5e1', margin: '8px 0', fontSize: '16px', fontFamily: 'sans-serif' },
    button: { padding: '12px 25px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }
};

export default Dashboard;