import React, { useState } from 'react';
import { loginUser } from './api';

const Login = () => {
    // 📝 email වෙනුවට username කියලා වෙනස් කරා Backend එකට ගැලපෙන්න
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        try {
            // Now sends { username, password } directly to backend
            const response = await loginUser(formData);
            setMessage('Login Successful! Welcome Back 🎉');
            console.log('Logged In User Data:', response.data);
            
            // 🔐 Save Token inside LocalStorage
            localStorage.setItem('profile', JSON.stringify(response.data));
            
            setFormData({ username: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Username or Password ❌');
            console.error('Login Error:', err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Customer Login</h2>
                
                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* 👤 Input type එක Text කරලා name එක username කරා */}
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                        style={styles.input}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a' },
    card: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' },
    title: { color: '#ffffff', marginBottom: '20px', fontFamily: 'sans-serif' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#334155', color: '#fff', fontSize: '16px' },
    button: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
    success: { color: '#4ade80', fontSize: '14px', marginBottom: '10px' },
    error: { color: '#f87171', fontSize: '14px', marginBottom: '10px' }
};

export default Login;