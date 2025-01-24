import './PublicNews.css'; // 引入样式

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// 时间格式化函数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const PublicNews = () => {
  const [messages, setMessages] = useState([]); // 存储消息数据
  const [selectedMessageId, setSelectedMessageId] = useState(null); // 存储选中消息的 ID
  const [loading, setLoading] = useState(true); // 加载状态
  const [searchQuery, setSearchQuery] = useState(''); // 搜索输入的查询内容

  // 获取消息数据
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://111.231.79.183:5201/api/getMessageDetailData');
        setMessages(response.data.MessageDetail); // 假设响应数据结构为 { MessageDetail: [...] }
        setLoading(false); // 加载完成
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false); // 加载失败
      }
    };

    fetchMessages();
  }, []);

  // 处理搜索输入变化
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 根据搜索查询筛选消息
  const filteredMessages = messages.filter((message) =>
    message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) // 如果有消息内容字段，可以进行内容匹配
  );

  // 如果数据还在加载中，显示加载提示
  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="PublicNewsContainer">
      {/* 搜索框 */}
      <div className="PublicNews-search">
        <input
          type="text"
          placeholder="搜索公告..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="PublicNews-searchInput"
        />
      </div>

      <div className="PublicNews-messageList">
        {filteredMessages.length === 0 ? (
          <div>没有找到相关的公告。</div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`PublicNews-messageItem ${selectedMessageId === message.id ? 'selected' : ''}`}
              onClick={() => setSelectedMessageId(message.id)} // 选中消息
            >
              <Link to={`/home/messageDetail/${message.id}`} className="PublicNews-messageTitle">
                {message.title}
              </Link>

              <div className="PublicNews-messageTime">发布时间：{formatDate(message.time)}</div> {/* 格式化时间 */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicNews;
