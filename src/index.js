import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';  // 改为 HashRouter
import { AuthProvider } from './context/AuthContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
    <React.StrictMode>
        <HashRouter>  {/* 使用 HashRouter */}
            <App />
        </HashRouter>
    </React.StrictMode>
    </AuthProvider>,
);
