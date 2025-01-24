import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 导入 AuthContext
import '../css/pages/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // 使用上下文中的 login 方法

    const handleFocus = () => {
        document.getElementById('owl').classList.add('password');
    };

    const handleBlur = () => {
        document.getElementById('owl').classList.remove('password');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://111.231.79.183:5201/api/getAccountLoginData');
            const data = await response.json();
            const user = data.AccountLogin.find(user => user.username === username && user.password === password);

            if (user) {
                login(user.username); // 调用 login 方法
                localStorage.setItem('username', user.username); // 存储用户名
                navigate('/'); // 登录成功后重定向到首页
            } else {
                setError('用户名或密码错误');
            }
        } catch (err) {
            console.error(err);
            setError('登录时发生错误');
        }
    };

    return (
        <div className="login-Container">
            <div className="login-box">
                <div className="owl" id="owl">
                    <div className="hand"></div>
                    <div className="hand hand-r"></div>
                    <div className="arms">
                        <div className="arm"></div>
                        <div className="arm arm-r"></div>
                    </div>
                </div>
                <div className="input-box">
                    <form className="loginForm" onSubmit={handleLogin}>
                        <div>
                            <input
                                className="inputField"
                                type="text"
                                value={username}
                                placeholder="请输入账号"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                className="inputField"
                                type="password"
                                value={password}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="请输入密码"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="loginButton">登录</button>
                        {error && <p className="errorMessage">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
