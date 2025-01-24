//src/App.js
import React from 'react';
import Header from './pages/Header';
import AppRoutes from './routes/Routes';
import './App.css';  // 引入 CSS

const App = () => {
    return (
        <div className="App">
            <Header className="App-Header"/>
            <AppRoutes className="App-AppRoutes"/>
        </div>
    );
};

export default App;
