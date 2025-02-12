import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // 导入 AuthContext
import "./Personalhome.css";
import { Link } from 'react-router-dom';

const Personalhome = () => {
    const { username } = useContext(AuthContext); // 使用上下文获取用户名
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const lastcurrentDate = new Date().toLocaleString();  // 获取当前时间，并格式化为字符串

 // 根据当前时间获取问候语
 const getGreeting = () => {
    const hour = new Date().getHours(); // 获取当前小时数
    if (hour >= 6 && hour < 12) {
        return "上午好";
    } else if (hour >= 12 && hour < 14) {
        return "中午好";
    } else if (hour >= 14 && hour < 19) {
        return "下午好";
    } else {
        return "晚上好";
    }
};

const greeting = getGreeting(); // 获取当前问候语

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    //调用api
    // 使用 useEffect 来调用 API
    const [projectDispatchCount, setProjectDispatchCount] = useState(0); // 用来存储 API 返回的 项目总个数
    useEffect(() => {
        const fetchProjectDispatchData = async () => {
            try {
                // 调用 API
                const response = await fetch('http://111.231.79.183:5201/api/getProjectDispatchData');
                const data = await response.json();

                // 计算返回的数据条数
                const projectdispatchformnumberofitems = data.ProjectDispatchForm.length; // 获取数据条数

                // 更新状态
                setProjectDispatchCount(projectdispatchformnumberofitems);
            } catch (error) {
                console.error('Error fetching project dispatch data:', error);
            }
        };

        fetchProjectDispatchData(); // 调用 API
    }, []); // 空依赖数组表示只在组件挂载时调用一次


    const [reportNumberCount, setReportNumberCount] = useState(0); // 用来存储报告总数

    useEffect(() => {
        const fetchReportNumbers = async () => {
            try {
                // 调用 API 获取报告数据
                const response = await fetch('http://111.231.79.183:5201/api/getReportNumbers');
                const data = await response.json();

                // 计算返回的数据条数
                const totalReports = data.length; // 获取数据条数

                // 更新状态
                setReportNumberCount(totalReports); // 更新状态为数据总数
            } catch (error) {
                console.error('获取报告失败:', error);
            }
        };

        fetchReportNumbers(); // 发起 API 请求
    }, []); // 空依赖数组表示只在组件挂载时调用一次

    const [travelExpenseData, setTravelExpenseData] = useState([]); // 用来存储报销数据
    const [travelExpenseCount, setTravelExpenseCount] = useState(0); // 用来存储待报销记录的总数
    const [notReimbursedData, setNotReimbursedData] = useState([]); // 用来存储符合条件的数据

    useEffect(() => {
        const fetchTravelExpenseData = async () => {
            try {
                // 调用 API 获取旅行报销数据
                const response = await fetch('http://111.231.79.183:5201/api/getTravelExpenseReimbursementData');
                const data = await response.json();

                // 假设返回的数据是 { TravelExpenseReimbursement: [...] }
                const expenseData = data.TravelExpenseReimbursement;

                // 过滤出由当前用户报销的数据
                const filteredDataByUser = expenseData.filter(expense =>
                    expense.ReimbursedBy === username
                );

                // 更新报销数据和总数
                setTravelExpenseData(filteredDataByUser);
                setTravelExpenseCount(filteredDataByUser.length); // 只计算由当前用户报销的记录

                // 过滤出未报销且由当前用户报销的数据
                const filteredData = filteredDataByUser.filter(expense =>
                    expense.Whetherover === false
                );

                // 更新符合条件的数据
                setNotReimbursedData(filteredData);

            } catch (error) {
                console.error('获取报销数据失败:', error);
            }
        };

        fetchTravelExpenseData(); // 发起 API 请求
    }, [username]); // 依赖项加入 username，当用户名发生变化时会重新触发 空依赖数组表示只在组件挂载时调用一次

    const [assessprojectfeescount, setAssessProjectFeesCount] = useState(0); // 用于存储记录条数

    useEffect(() => {
        // 调用 API 获取数据
        const fetchData = async () => {
            try {
                // 使用原生 fetch
                const response = await fetch('http://111.231.79.183:5201/api/getAssessProjectFees');
                const data = await response.json(); // 获取并解析 JSON 数据

                const totalCount = data.length; // 获取数据的总条数
                setAssessProjectFeesCount(totalCount); // 更新记录总数
            } catch (error) {
                console.error('获取数据失败:', error);
            }
        };

        fetchData();
    }, []);


    const [achievementsdatacount, setAchievementsDataCount] = useState(0); // 存储所有记录的总数
    const [notticheng, setNotticheng] = useState(0); // 存储符合条件的记录数

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://111.231.79.183:5201/api/getAchievementsData');
                const data = await response.json();

                // 过滤出 PerformancePerson 为 username 的所有记录
                const userAchievements = data.Achievements
                    ? data.Achievements.filter(item => item.PerformancePerson === username)
                    : [];

                // 获取所有符合 PerformancePerson 为 username 的记录数
                const totalCount = userAchievements.length;
                setAchievementsDataCount(totalCount);

                // 过滤出 Whetherticheng 为 false 或 null 且 PerformancePerson 为 username 的记录
                const notTichengCount = userAchievements.filter(item => item.Whetherticheng === false || item.Whetherticheng === null).length;
                setNotticheng(notTichengCount); // 更新符合条件的记录数

            } catch (error) {
                console.error('获取数据失败:', error);
            }
        };

        fetchData();
    }, [username]);  // 依赖 username，username 变化时重新执行 effect // 只在组件挂载时运行一次

    // 在每个 section 添加对应的路由链接
    const sections = [
        { title: "项目个数", icon: "#icon-a-paidandaipaidan", count: projectDispatchCount, unfinished: 0, link: "/home/projectdispatchform" },
        { title: "日志", icon: "#icon-contact_phone", count: 0, unfinished: 0, link: "/home/worklog" },
        { title: "待看现场", icon: "#icon-mti-xianchangjilu", count: 0, unfinished: 0, link: "/home/onsite" },
        { title: "报销", icon: "#icon-jidongcheshenbaoxitong", count: travelExpenseCount, unfinished: notReimbursedData.length, link: "/home/travelexpense" },
        { title: "报告", icon: "#icon-shuben", count: reportNumberCount, unfinished: 0, link: "/home/reportnumbertable" },
        { title: "收费", icon: "#icon-icon_shenghuobutieshenqing", count: assessprojectfeescount, unfinished: 0, link: "/home/assessprojectfees" },
        { title: "待盖章", icon: "#icon-shenhe", count: 0, unfinished: 0, link: "/home/stamp" },
        { title: "提成", icon: "#icon-a-ziyuan111", count: achievementsdatacount, unfinished: notticheng, link: "/home/achievements" },
        { title: "待归档", icon: "#icon-shichangjia", count: 0, unfinished: 0, link: "/home/archive" }
    ];

    return (
        <div className="personalhome-container">
            <div className="personalhome-container-header">
                <div className="personalhome-greeting-container">
                    <svg className="personalhome-header-container-icon" aria-hidden="true">
                        <use xlinkHref="#icon-a-bailingnanshinanrenrenwuxiaoxiang"></use>
                    </svg>
                    <h2 className="personalhome-greeting-time">{greeting}</h2> {/* 动态显示问候语 */}
                    <h2 className="personalhome-greeting-user">{username ? username : '请登录'}</h2>
                </div>
                <div className="personalhome-container-header-center">
                    <h2>上次登录时间：{lastcurrentDate}</h2>
                </div>
            </div>
            <div className="personalhome-container-body">
                <div className="personalhome-container-body-content">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className={`personalhome-section ${hoveredIndex === index ? 'personalhome-hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >

                            <div>

                                <Link to={section.link} className="tree-link">

                                    <svg className="personalhome-header-container-icon" aria-hidden="true">
                                        <use xlinkHref={section.icon}></use>
                                    </svg>
                                </Link>
                            </div>
                            {/* 显示字段内容 */}
                            {section.count !== undefined && <div>{`${section.title}：${section.count}`}</div>}
                            {section.unfinished !== undefined && (
                                <div style={{ color: section.unfinished !== 0 ? 'red' : 'black' }}>
                                    {`未完成：${section.unfinished}`}
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
            <div className="personalhome-container-footer">
                <div>总结：
                    <div>总体来说，过去一年我们在提高办事效率方面取得了可喜的进展，尽管仍有一些地方需要进一步优化，但通过团队的共同努力和不断的改进措施，我们相信在接下来的一年中，办事效率将会得到更进一步的提升。我们将继续努力，争取在未来的工作中实现更加卓越的表现。</div>
                </div>
            </div>
        </div>
    );
};

export default Personalhome;
