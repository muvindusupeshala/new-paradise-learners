import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

// 🎯 ලොග් වෙන කෙනා කවුද කියලා බලලා අදාළ ඩෑෂ්බෝඩ් එකට හරවන ලොජික් එක
const DashboardRouter = () => {
    const { user, isAuthenticated } = useAuth();

    // LocalStorage එකෙන් user ව ගන්නවා (State එක රීලෝඩ් වුණත් ඩේටා රැකගන්න)
    const localUser = JSON.parse(localStorage.getItem('user') || 'null');
    const currentUser = user || localUser;

    if (!isAuthenticated || !currentUser) {
        return <Navigate to="/login" replace />;
    }

    // 👑 Admin නම් කෙලින්ම Admin Dashboard එකට
    if (currentUser.role === 'admin') {
        return <AdminDashboard />;
    }

    // 🫱‍🲵 Student නම් කෙලින්ම Student Dashboard එකට
    return <StudentDashboard />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* 🎯 පොදු ඩෑෂ්බෝඩ් Route එක (මේකට ආවම Role එක බලලා බෙදනවා) */}
                    <Route path="/dashboard" element={<DashboardRouter />} />

                    {/* පරණ ලින්ක්ස් ආවොත් ඒවා /dashboard එකට හරවනවා */}
                    <Route path="/student-dashboard" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/admin-dashboard" element={<Navigate to="/dashboard" replace />} />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;