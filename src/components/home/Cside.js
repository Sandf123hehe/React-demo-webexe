import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import "../../css/home/Cside.css";
const Cside = () => {
    return (
        <div className="Cside-container">
             <Outlet /> {/* 用于渲染子路由 */}
        </div>
    );
};

export default Cside;