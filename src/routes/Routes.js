import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import First from '../components/home/cside/First';
import Second from '../components/home/cside/Second';
import Billingpage from '../components/bookkeeping/Billingpage';
import SiteLinks from '../components/usedwebsites/SiteLinks';
import Specialtips from '../components/home/specialtips/Specialtips';
import PublicNews from '../components/home/publicnews/PublicNews';
import MessageDetail from '../components/home/publicnews/MessageDetail';
import RealEstate from '../components/home/assess/RealEstate';
import Buildings from '../components/home/assess/Buildings';
import Equipment from '../components/home/assess/Equipment';
import Download from '../components/home/assess/Download';
import Achievements from '../components/home/assess/Achievements';
import TravelExpense from '../components/home/assess/TravelExpense';
import Imageupload from '../components/home/assess/Imageupload';
import FeeCalculation from '../components/home/feecalculation/FeeCalculation';
import Carousel from '../components/home/amusement/Carousel';
import Music from '../components/home/amusement/Music';
import Personalhome from '../components/project/Personalhome';
import Asinglesitelog from '../components/project/Asinglesitelog';//单个工作日志
import AsingleTravelExpense from '../components/project/AsingleTravelExpense';//单个报销
import AsingleAchievements from '../components/project/AsingleAchievements';//单个绩效
import Projectdispatchform from '../components/project/Projectdispatchform';
import ReportNumberTable from '../components/project/ReportNumberTable';
import Assessprojectfees from '../components/project/Assessprojectfees';
import Worklog from '../components/project/Worklog';
import Sportsrecording from '../components/sports/Sportsrecording';



const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/billingpage" element={<Billingpage />} />
            <Route path="/sportsrecording" element={<Sportsrecording />} />
            <Route path="/home" element={<Home />}>
                {/* 设置 'first' 为默认子路由 */}
                {/* <Route index element={<Navigate to="/home/personalhome" />} />  */}
                {/* <Route index element={<First />} /> */}
                <Route path="first" element={<First />} />
                <Route path="second" element={<Second />} />
                {/* 常用网站 */}
                <Route path="siteLinks" element={<SiteLinks />} />
                {/* 特别提示 */}
                <Route path="specialtips" element={<Specialtips />} />
                {/* 消息通知 */}
                <Route path="publicnews" element={<PublicNews />} />
                {/* 消息通知-详细 */}
                {/* <Route path="messagedetail" element={<MessageDetail />} /> */}
                <Route path="messageDetail/:messageId" element={<MessageDetail />} />
                {/* 房地产价格查询 */}
                <Route path="realestate" element={<RealEstate />} />
                {/* 图片上传 */}
                <Route path="imageupload" element={<Imageupload />} />
                {/* 构筑物价格查询 */}
                <Route path="buildings" element={<Buildings />} />
                {/* 机器设备价格查询 */}
                <Route path="equipment" element={<Equipment />} />
                {/* 报告下载 */}
                <Route path="download" element={<Download />} />
                {/* 绩效 */}
                <Route path="achievements" element={<Achievements />} />
                {/* 车费报销 */}
                <Route path="travelexpense" element={<TravelExpense />} />
                {/* 收费计算 */}
                <Route path="feecalculation" element={<FeeCalculation />} />
                {/* 音乐 */}
                <Route path="music" element={<Music />} />
                {/* 图片 */}
                <Route path="carousel" element={<Carousel />} />
                {/* 项目个人首页 */}
                <Route path="personalhome" element={<Personalhome />} />
                <Route path="projectdispatchform" element={<Projectdispatchform />} />
                <Route path="asinglesitelog" element={<Asinglesitelog />} />
                <Route path="reportnumbertable" element={<ReportNumberTable />} />
                <Route path="asinglesitelog/:projectNumber" element={<Asinglesitelog />} />
                <Route path="asingletravelexpense/:projectNumber" element={<AsingleTravelExpense />} />
                <Route path="asingleachievements/:projectNumber" element={<AsingleAchievements />} />
                <Route path="worklog" element={<Worklog />} />
            </Route>
            {/* 默认路由 */}
            {/* <Route path="/" element={<Home />} />  */}
            {/* <Route path="/home/personalhome" element={<Home />} /> */}
            <Route path="/" element={<Navigate to="/home/personalhome" />} />
        </Routes>
    );
};

export default AppRoutes;
