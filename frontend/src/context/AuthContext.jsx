import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 💡 ඇප් එක මුලින්ම ලෝඩ් වෙද්දී LocalStorage එකේ 'user' කෙනෙක් ඉන්නවාද කියලා බලලා state එකට දාගන්නවා
    const [user, setUser] = useState(() => {
        const localUser = localStorage.getItem('user');
        try {
            return localUser ? JSON.parse(localUser) : null;
        } catch (error) {
            console.error("Error parsing user from localStorage", error);
            return null;
        }
    });

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api/auth';

    // Axios Headers සහ LocalStorage කළමනාකරණය
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            fetchCurrentUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [token]);

    // දැනට ලොග් වී සිටින යූසර්ගේ අලුත්ම විස්තර Backend එකෙන් ලබාගැනීම
    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/me`);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setError(null);
        } catch (err) {
            console.error('Error fetching user:', err);
            // ටෝකන් එක අවුල් නම් ඔක්කොම ක්ලියර් කරනවා
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    // Register User
    const register = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/register`, formData);
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return { success: true, data: response.data };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    // 💡 LOGIN FUNCTION (Username එකෙන් ලොග් වීම සහ LoginPage එකෙන් එන Object Data සෘජුවම Update කිරීම)
    const login = async (loginDataOrUsername, password) => {
        setLoading(true);
        setError(null);
        try {
            // ක්‍රමය 1: LoginPage එකෙන් කෙලින්ම response data එක object එකක් විදිහට එව්වොත් (Fast Track)
            if (typeof loginDataOrUsername === 'object' && loginDataOrUsername.token) {
                setToken(loginDataOrUsername.token);
                setUser(loginDataOrUsername.user);
                localStorage.setItem('token', loginDataOrUsername.token);
                localStorage.setItem('user', JSON.stringify(loginDataOrUsername.user));
                setLoading(false);
                return { success: true, user: loginDataOrUsername.user };
            }

            // ක්‍රමය 2: සාමාන්‍ය විදිහට (username, password) string විදිහට ආවොත්
            const response = await axios.post(`${API_URL}/login`, {
                username: loginDataOrUsername, // email වෙනුවට username පාවිච්චි කර ඇත
                password
            });

            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return { success: true, user: response.data.user };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    // 💡 LOGOUT FUNCTION (පරණ ඩේටා හිරවීම සදහටම නැති කිරීමට බලෙන්ම LocalStorage සුද්ධ කරයි)
    const logout = () => {
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.clear(); // බ්‍රවුසර් එකේ තියෙන සියලුම කැචේ ඩේටා මැකී යයි

        // 🚀 ලොග් අවුට් වූ වහාම ලොගින් පේජ් එකට හරවා යවා පේජ් එක රීලෝඩ් කරයි
        window.location.href = '/login';
    };

    const value = {
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!token,
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};