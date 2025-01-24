import React, { useState, useEffect } from 'react';
import './SiteLinks.css';

const SiteLinks = () => {
  const [activeTab, setActiveTab] = useState('房地产');
  const [links, setLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      try {
          const response = await fetch('http://111.231.79.183:5201/api/getUsedWebsitesData');
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
  
          // 直接使用 data 作为数组
          if (Array.isArray(data) && data.length > 0) {
              const categorizedLinks = data.reduce((acc, item) => {
                  const { type, name, url } = item;
                  if (!acc[type]) {
                      acc[type] = [];
                  }
                  acc[type].push({ name, url });
                  return acc;
              }, {});
  
              setLinks(categorizedLinks);
          } else {
              setError('没有可用链接');
          }
      } catch (err) {
          console.error(err);
          setError(`加载链接时发生错误: ${err.message}`);
      } finally {
          setLoading(false);
      }
  };
  

    fetchLinks();
  }, []);

  const renderLinks = () => {
    if (loading) {
      return <div>加载中...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    return links[activeTab] ? (
      links[activeTab].map((link, index) => (
        <div key={index} className="link-item">
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
        </div>
      ))
    ) : (
      <div>没有可用链接</div>
    );
  };

  return (
    <div className="site-links">
      <div className="tabs">
        <div
          className={`tab ${activeTab === '房地产' ? 'active' : ''}`}
          onClick={() => setActiveTab('房地产')}
        >
          房地产
        </div>
        <div
          className={`tab ${activeTab === '资产' ? 'active' : ''}`}
          onClick={() => setActiveTab('资产')}
        >
          资产
        </div>
        <div
          className={`tab ${activeTab === '苗木' ? 'active' : ''}`}
          onClick={() => setActiveTab('苗木')}
        >
          苗木
        </div>
        <div
          className={`tab ${activeTab === '土地' ? 'active' : ''}`}
          onClick={() => setActiveTab('土地')}
        >
          土地
        </div>
      </div>

      <div className="links">
        {renderLinks()}
      </div>
    </div>
  );
};

export default SiteLinks;
