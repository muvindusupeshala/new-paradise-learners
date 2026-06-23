import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (role, email) => {
    const userProfile = {
      result: {
        fullName: role === 'admin' ? 'System Administrator' : 'Paradise Student',
        username: email.split('@')[0],
        branch: 'Nugegoda',
        role: role
      }
    };
    localStorage.setItem('profile', JSON.stringify(userProfile));
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(false);

    if (isLogin) {
      if (formData.email === "admin@paradise.com" && formData.password === "admin123") {
        handleLoginSuccess("admin", formData.email);
      } else if (formData.email === "student@paradise.com" && formData.password === "student123") {
        handleLoginSuccess("customer", formData.email);
      } else {
        setError(true);
      }
    } else {
      alert("Registration submitted successfully!");
      setIsLogin(true);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>

        {/* 1. HEADER */}
        <div style={styles.header}>
          <span style={{ fontSize: '32px' }}>🎓</span>
          <h1 style={styles.mainTitle}>New Paradise Learners</h1>
          <p style={styles.subTitle}>Student Login</p>
        </div>

        {/* ⚠️ INVALID CREDENTIALS ALERT */}
        {error && (
          <div style={styles.errorAlert}>
            <span style={{ marginRight: '8px', fontSize: '16px' }}>⚠️</span> Invalid credentials
          </div>
        )}

        {/* 2. FORM BODY */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                required
                style={styles.plainInput}
                placeholder="Your Full Name"
              />
            </div>
          )}

          {/* 📧 EMAIL ADDRESS INPUT (NO ICONS AT ALL) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.plainInput}
              placeholder="youremail@example.com"
            />
          </div>

          {/* 🔒 PASSWORD INPUT (NO ICONS AT ALL) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.plainInput}
              placeholder="••••••"
            />
          </div>

          {/* 🔴 RED LOGIN BUTTON */}
          <button type="submit" style={styles.submitBtn}>
            {isLogin ? "Login" : "Register"}
          </button>

          {/* FOOTER LINKS */}
          <div style={styles.footerText}>
            <span style={{ color: '#64748b' }}>New to our system?</span>
            <div style={{ marginTop: '5px' }}>
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setIsLogin(false)} style={styles.linkBtn}>Register here</button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setIsLogin(true)} style={styles.linkBtn}>Login here</button>
                </>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#e0f2fe',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    padding: '20px',
    boxSizing: 'border-box'
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '440px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    border: '3px solid #3b82f6',
    padding: '28px',
    boxSizing: 'border-box'
  },
  header: {
    textAlign: 'center',
    marginBottom: '22px'
  },
  mainTitle: {
    color: '#1d4ed8',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '8px 0 0 0',
    letterSpacing: '-0.5px'
  },
  subTitle: {
    color: '#dc2626',
    fontSize: '15px',
    fontWeight: 'bold',
    margin: '6px 0 0 0'
  },
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #f87171',
    color: '#991b1b',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    color: '#1e3a8a',
    fontSize: '15px',
    fontWeight: 'bold',
    textAlign: 'left'
  },
  plainInput: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '16px',
    borderRadius: '25px',
    border: '2px solid #3b82f6',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: '#000000',
    boxSizing: 'border-box'
  },
  submitBtn: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '25px',
    padding: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    marginTop: '12px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '14px'
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0
  }
};

export default Login;