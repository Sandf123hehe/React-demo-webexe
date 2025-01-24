// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(() => {
        // 从 localStorage 中读取用户名
        return localStorage.getItem('username') || '';
    });

    const login = (user) => {
        setUsername(user);
        localStorage.setItem('username', user); // 存储用户名
    };

    const logout = () => {
        setUsername('');
        localStorage.removeItem('username'); // 移除用户名
    };

    useEffect(() => {
        // 在组件加载时检查 localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
