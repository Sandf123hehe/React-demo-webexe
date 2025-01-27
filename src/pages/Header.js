// src/pages/Header.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 导入 AuthContext
import "../css/pages/Header.css";

const Header = () => {
    const { username } = useContext(AuthContext); // 使用上下文获取用户名

    return (
        <div className="header-container">
            <div className="header-container-lside">
                {/* 显示用户名或“用户” */}
                {/* <li className="header-container-ul-li">
                    <Link to="/login">{username ? username : '登录'}</Link> 
                </li> */}
                <div>
                <img src="/favicon.ico" alt="Logo" className="header-container-icon-logo" />
                    {/* <svg className="header-container-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-xueyepinggu"></use>
                    </svg> */}
                </div>
                <div>
                    <h2 className="header-container-iconname">宝宝乐园</h2>
                </div>
            </div>

            <div className="header-container-cside">
                <div className="header-container-header">
                    <ul className="header-container-ul">
                        {/* <li className="header-container-ul-li"><Link to="/">首页</Link></li>
                        <li className="header-container-ul-li"><Link to="/about">关于</Link></li>
                        <li className="header-container-ul-li"><Link to="/billingpage">记账</Link></li> */}
                    </ul>
                </div>
            </div>

            <div className="header-container-rside">
                <div>
                    <li className="header-container-ul-li"><Link to="/home/personalhome">
                        <svg className="header-container-icon" aria-hidden="true">
                            <use xlinkHref="#icon-shouye-zhihui"></use>
                        </svg>
                    </Link>
                    </li>
                    <li className="header-container-ul-li">
                        <Link to="/sportsrecording">
                            <svg className="header-container-icon" aria-hidden="true">
                                <use xlinkHref="#icon-paobu9"></use>
                            </svg>
                        </Link>
                    </li>
                    <li className="header-container-ul-li">
                        <Link to="/billingpage">
                            <svg className="header-container-icon" aria-hidden="true">
                                <use xlinkHref="#icon-zhangbenzhangdanjizhangzhangbu"></use>
                            </svg>
                        </Link>
                    </li>

                    <li className="header-container-ul-li">
                        <Link to="/login">{username ?
                            <svg className="header-container-icon" aria-hidden="true">
                                <use xlinkHref="#icon-my_light"></use>
                            </svg> : <svg className="header-container-icon" aria-hidden="true">
                                <use xlinkHref="#icon-hollowow1"></use>
                            </svg>}
                        </Link> {/* 显示用户名或“用户” */}
                    </li>

                    <li className="header-container-ul-li">
                        <Link to="/home/publicnews">
                            <svg className="header-container-icon" aria-hidden="true">
                                <use xlinkHref="#icon-notice"></use>
                            </svg>
                        </Link>  
                    </li>
                    <li className="header-container-ul-li seting">
                        <Link to="/login">
                            <svg className="header-container-icon" aria-hidden="true">
                                <use xlinkHref="#icon-RectangleCopy10"></use>
                            </svg>
                        </Link>  
                    </li>
                    


                </div>


            </div>
        </div>
    );
};

export default Header;
