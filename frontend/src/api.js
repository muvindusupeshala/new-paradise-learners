import axios from 'axios';

// 🌐 Backend සර්වර් එකේ Base URL එක සෙට් කිරීම
const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

// 🔐 Token එක auto ඇඩ් වෙන කෑල්ල
API.interceptors.request.use((req) => {
    const profile = localStorage.getItem('profile');
    if (profile) {
        const token = JSON.parse(profile).token;
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// 📡 Auth API Calls
export const registerCustomer = (customerData) => API.post('/auth/register', customerData);
export const loginUser = (userData) => API.post('/auth/login', userData);

export default API;