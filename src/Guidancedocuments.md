/* #region start */

/*  #endregion end */
项目结构
public
src
  ├── components
  │   └── Navbar.js
  ├── pages
  │   ├── About.js    
  │   ├── Home.js 
  │   └── Header.js   
  ├── routes
  │   └── Routes.js
  ├── App.js
  └── index.js
1. 安装依赖
确保你已经安装了 react-router-dom：

npm install react-router-dom
2. 创建组件
src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
src/pages/Home.js
import React from 'react';

const Home = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the Home Page!</p>
        </div>
    );
};

export default Home;
src/pages/About.js
import React from 'react';

const About = () => {
    return (
        <div>
            <h1>About Page</h1>
            <p>This is the About Page!</p>
        </div>
    );
};

export default About;
src/pages/Header.js
import React from 'react';

const Header = () => {
    return (
        <header>
            <h1>My React Demo</h1>
        </header>
    );
};

export default Header;
3. 创建路由
src/routes/Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
};

export default AppRoutes;
4. 主应用程序
src/App.js
import React from 'react';
import Header from './pages/Header';
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';

const App = () => {
    return (
        <>
            <Header />
            <Navbar />
            <AppRoutes />
        </>
    );
};

export default App;
5. 入口文件
src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
6. 运行项目
确保一切设置正确后，使用以下命令启动项目：

npm start
总结
现在，你的应用程序使用了 React 18 和最新的 React Router API。ReactDOM.createRoot 是 React 18 中的新方法，用于创建根节点并渲染应用程序。其他的部分则保持了最新的写法和最佳实践。

如果你有其他问题或需要进一步的帮助，请告诉我！