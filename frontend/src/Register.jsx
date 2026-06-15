import React, { useState } from 'react';
import { registerCustomer } from './api';

const Register = () => {
    // 📝 Backend එක ඉල්ලන සේරම නිවැරදි Field Names ටික දැම්මා
    const [formData, setFormData] = useState({
        fullName: '',      // 👈 name වෙනුවට fullName කරා
        username: '',
        email: '',
        password: '',
        nic: '',           // 👈 අලුත්
        dob: '',           // 👈 අලුත්
        gender: '',        // 👈 අලුත්
        contactNumber: '', // 👈 අලුත්
        branch: '',
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
            const response = await registerCustomer(formData);
            setMessage('Registration Successful! 🎉');
            console.log('Success Customer Data:', response.data);
            // ඔක්කොම ක්ලියර් කරන්න
            setFormData({ fullName: '', username: '', email: '', password: '', nic: '', dob: '', gender: '', contactNumber: '', branch: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong ❌');
            console.error('Register Error:', err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Customer Registration</h2>
                
                {message && <p style={styles.success}>{message}</p>}
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input 
                        type="text" 
                        name="fullName" 
                        placeholder="Full Name" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        required 
                        style={styles.input}
                    />
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
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        value={formData.email} 
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
                    <input 
                        type="text" 
                        name="nic" 
                        placeholder="NIC Number" 
                        value={formData.nic} 
                        onChange={handleChange} 
                        required 
                        style={styles.input}
                    />
                    <input 
                        type="text" 
                        name="contactNumber" 
                        placeholder="Contact Number" 
                        value={formData.contactNumber} 
                        onChange={handleChange} 
                        required 
                        style={styles.input}
                    />
                    
                    {/* 📅 Date of Birth Input එක */}
                    <div style={styles.row}>
                        <label style={styles.label}>DOB:</label>
                        <input 
                            type="date" 
                            name="dob" 
                            value={formData.dob} 
                            onChange={handleChange} 
                            required 
                            style={{ ...styles.input, flex: 1 }}
                        />
                    </div>

                    {/* 🚻 Gender Dropdown එක */}
                    <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        required 
                        style={styles.input}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* 🏛️ Branch Dropdown එක */}
                    <select 
                        name="branch" 
                        value={formData.branch} 
                        onChange={handleChange} 
                        required 
                        style={styles.input}
                    >
                        <option value="">Select a Branch</option>
                        <option value="Malabe">Malabe</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Galle">Galle</option>
                    </select>

                    <button type="submit" style={styles.button}>Register Customer</button>
                </form>
            </div>
        </div>
    );
};

// Scroll කරන්න පුළුවන් වෙන්න Container එක පොඩ්ඩක් හැදුවා Form එක දිග නිසා
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', padding: '20px 10px' },
    card: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '380px', textAlign: 'center' },
    title: { color: '#ffffff', marginBottom: '20px', fontFamily: 'sans-serif', fontSize: '24px' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    input: { padding: '11px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#334155', color: '#fff', fontSize: '15px', fontFamily: 'sans-serif' },
    row: { display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' },
    label: { color: '#94a3b8', fontFamily: 'sans-serif', fontSize: '14px' },
    button: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' },
    success: { color: '#4ade80', fontSize: '14px', marginBottom: '10px' },
    error: { color: '#f87171', fontSize: '13px', marginBottom: '10px', textAlign: 'left', lineHeight: '1.4' }
};

export default Register;