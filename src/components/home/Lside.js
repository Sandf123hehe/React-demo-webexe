import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../css/home/Lside.css";

const Lside = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // 状态来控制每个二级菜单的展开/折叠
  const [activeSubmenus, setActiveSubmenus] = useState({
    first: false,
    second: false,
    entertainment: false // 添加一个新的状态来控制娱乐菜单
  });

  // 切换侧边栏的展开/折叠状态
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // 切换二级菜单的展开/折叠状态
  const toggleSubmenu = (menu) => {
    setActiveSubmenus(prevState => ({
      ...prevState,
      [menu]: !prevState[menu]
    }));
  };

  return (
    <div className={`lside-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className={`lside-tree-sub-container ${isExpanded ? '' : 'hidden'}`}>
        <ul className="tree-sub-ul">
          <li><Link to="/home/siteLinks" className="tree-link">
            <svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-web"></use>
            </svg>常用网站</Link></li>
          <li><Link to="/home/specialtips" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-tishi"></use>
            </svg>特别提示</Link></li>
          <li><Link to="/home/publicnews" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-tongzhi4"></use>
            </svg>消息通知</Link></li>

          {/* 评估系统 */}
          <li className="tree-sub-li">
            <div className="tree-sub-li-div">
              <Link to="/home/realestate" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-banxuepinggu"></use>
            </svg>评估系统</Link>
              <button onClick={() => toggleSubmenu('second')} className="submenu-toggle-btn">
                {activeSubmenus.second ?
                  <svg className="lside-container-icon" aria-hidden="true">
                    <use xlinkHref="#icon-arrow-up-bold"></use>
                  </svg> :
                  <svg className="lside-container-icon" aria-hidden="true">
                    <use xlinkHref="#icon-arrow-down-bold"></use>
                  </svg>}
              </button>
            </div>



            {/* 二级菜单 */}
            <ul className={`submenu ${activeSubmenus.second ? 'expanded' : 'collapsed'}`}>
              <li><Link to="/home/realestate" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-changfangchuzu"></use>
            </svg>房地产查询</Link></li>
              <li><Link to="/home/buildings" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-gouzhuwu1"></use>
            </svg>构筑物查询</Link></li>
              <li><Link to="/home/equipment" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-jiqiren2"></use>
            </svg>机器设备查询</Link></li>
              <li><Link to="/home/download" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-baogao"></use>
            </svg>报告下载</Link></li>
              <li><Link to="/home/achievements" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-wodejixiao"></use>
            </svg>绩效</Link></li>
              <li><Link to="/home/travelexpense" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-weibiaoti-"></use>
            </svg>报销</Link></li>
              <li><Link to="/home/feecalculation" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-jisuanji"></use>
            </svg>收费计算</Link></li>
            </ul>
          </li>

          {/* 娱乐 */}
          <li className="tree-sub-li">
            <Link to="/home/carousel" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-yule"></use>
            </svg>娱&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;乐</Link>
            <button onClick={() => toggleSubmenu('entertainment')} className="submenu-toggle-btn">
              {activeSubmenus.entertainment ?
                <svg className="lside-container-icon" aria-hidden="true">
                  <use xlinkHref="#icon-arrow-up-bold"></use>
                </svg> :
                <svg className="lside-container-icon" aria-hidden="true">
                  <use xlinkHref="#icon-arrow-down-bold"></use>
                </svg>}
            </button>
            {/* 二级菜单 */}
            <ul className={`submenu ${activeSubmenus.entertainment ? 'expanded' : 'collapsed'}`}>
              <li><Link to="/home/music" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
                  <use xlinkHref="#icon-yinleliebiao"></use>
                </svg>音乐</Link></li>
              <li><Link to="/home/carousel" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
                  <use xlinkHref="#icon-tupian1"></use>
                </svg>图片</Link></li>
                <li><Link to="/billingpage" className="tree-link"><svg className="lside-container-icon" aria-hidden="true">
                  <use xlinkHref="#icon-jizhang"></use>
                </svg>记账</Link></li>
            </ul>
          </li>
        </ul>
      </div>

      {/* 控制侧边栏展开/折叠按钮 */}
      <div className="lside-expanded-container">
        <button onClick={toggleSidebar} className="lside-expanded-toggle-btn">
          {isExpanded ?
            <svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-arrow-left-bold"></use>
            </svg> :
            <svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-arrow-right-bold"></use>
            </svg>}
        </button>
      </div>
    </div>
  );
};

export default Lside;
