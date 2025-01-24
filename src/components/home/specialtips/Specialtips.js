import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Specialtips.css'; // 引入样式

export default function Specialtips() {
    const [tips, setTips] = useState([]); // 存储提示数据
    const [loading, setLoading] = useState(true); // 加载状态
    const [searchTerm, setSearchTerm] = useState(''); // 存储搜索关键字

    // 获取提示数据
    useEffect(() => {
        const fetchTipsData = async () => {
            try {
                const response = await axios.get('http://111.231.79.183:5201/api/getSpecial_TipsData');
                setTips(response.data.Special_Tips); // 假设返回的数据结构为 { Special_Tips: [...] }
                setLoading(false); // 加载完成
            } catch (error) {
                console.error('Error fetching tips data:', error);
                setLoading(false); // 加载失败
            }
        };

        fetchTipsData();
    }, []);

    // 如果数据还在加载中，显示加载提示
    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    // 过滤提示数据
    const filteredTips = tips.filter(tip =>
        tip.tip_content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="specialtips-container">
            <h2>特殊提示</h2>
            <input
                type="text"
                placeholder="搜索提示..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <ul className="tips-list">
                {filteredTips.length > 0 ? (
                    filteredTips.map((tip, index) => (
                        <li key={index} className="tip-item">
                            <strong>类别:</strong> {tip.asset_type}<br />
                            <strong>内容:</strong> {tip.tip_content}
                        </li>
                    ))
                ) : (
                    <li className="no-results">没有找到相关提示。</li>
                )}
            </ul>
        </div>
    );
}
