// src/components/Footer.js
import React from 'react';
import "../css/pages/Footer.css"; // 引入 CSS 样式文件 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <a href="https://beian.miit.gov.cn/" target="_blank">渝ICP备2025048664号-1</a>
            </div>
        </footer>
    );
};

export default Footer;
