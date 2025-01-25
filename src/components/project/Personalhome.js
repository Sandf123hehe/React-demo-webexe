import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // 导入 AuthContext
import "./Personalhome.css";

const Personalhome = () => {
    const { username } = useContext(AuthContext); // 使用上下文获取用户名
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const sections = [
        { title: "待分配", icon: "#icon-a-paidandaipaidan", count: 20, unfinished: 8 },
        { title: "待联系", icon: "#icon-contact_phone", count: 228, unfinished: 108 },
        { title: "待看现场", icon: "#icon-mti-xianchangjilu", count: 150, unfinished: 75 },
        { title: "待报销", icon: "#icon-jidongcheshenbaoxitong", count: 50, unfinished: 20 },
        { title: "待出报告", icon: "#icon-shuben", count: 80, unfinished: 30 },
        { title: "待收费", icon: "#icon-icon_shenghuobutieshenqing", count: 100, unfinished: 30 },
        { title: "待盖章", icon: "#icon-shenhe", count: 100, unfinished: 30 },
        { title: "待提成", icon: "#icon-a-ziyuan111", count: 100, unfinished: 30 },
        { title: "待归档", icon: "#icon-shichangjia", count: 100, unfinished: 30 }
    ];

    return (
        <div className="personalhome-container">
            <div className="personalhome-container-header">
                <div className="personalhome-greeting-container">
                    <svg className="personalhome-header-container-icon" aria-hidden="true">
                        <use xlinkHref="#icon-a-bailingnanshinanrenrenwuxiaoxiang"></use>
                    </svg>
                    <h2 className="personalhome-greeting-time">上午好</h2>
                    <h2 className="personalhome-greeting-user">{username ? username : '请登录'}</h2>
                </div>
                <div className="personalhome-container-header-center">
                    <h2>上次登录时间：2025-05-06</h2>
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
                            {/* <h3>{section.title}</h3> */}
                            <div>
                                <svg className="personalhome-header-container-icon" aria-hidden="true">
                                    <use xlinkHref={section.icon}></use>
                                </svg>
                            </div>
                            {/* 显示字段内容 */}
                            {section.count !== undefined && <div>{`${section.title}：${section.count}`}</div>}
                            {section.unfinished !== undefined && <div>{`未完成：${section.unfinished}`}</div>}
                             
                        </div>
                    ))}

                </div>
            </div>
            <div className="personalhome-container-footer">
                <div>总结：<div>总体来说，过去一年我们在提高办事效率方面取得了可喜的进展，尽管仍有一些地方需要进一步优化，但通过团队的共同努力和不断的改进措施，我们相信在接下来的一年中，办事效率将会得到更进一步的提升。我们将继续努力，争取在未来的工作中实现更加卓越的表现。</div>
          </div>
                  </div>
        </div>
    );
};

export default Personalhome;
