import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // 🔐 LocalStorage එකේ ප්‍රොෆයිල් එකක් තියෙනවාද කියලා බලනවා
    const token = localStorage.getItem('profile');

    // යූසර් ලොග් වෙලා නැත්නම් කෙලින්ම ඌව ලොගින් පේජ් එකට හරවලා යවනවා
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // ලොග් වෙලා නම් විතරක් යන්න හදපු පේජ් එක (Dashboard එක) පෙන්වනවා
    return children;
};

export default ProtectedRoute;