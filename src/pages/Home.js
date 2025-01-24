import React from 'react';
import Cside from '../components/home/Cside';
import Lside from '../components/home/Lside';
import Rside from '../components/home/Rside';
import Footer from './Footer';
import "../css/pages/Home.css";

const Home = () => {
    return (
        <div className="home-container">

            <div className="home-container-bodycontainer">
                <div className="home-container-lcontainer">
                    <Lside />

                </div>
                <div className="home-container-ccontainer">
                    <Cside />
                </div>
                <div className="home-container-rcontainer">
                    <Rside />
                </div>
            </div>

            <div className="home-container-footercontainer">
                <Footer />
            </div>


        </div>
    );
};

export default Home;
