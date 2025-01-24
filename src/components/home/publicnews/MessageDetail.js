import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 引入 useParams 获取路由参数
import axios from 'axios'; // 引入 axios
import { Link } from 'react-router-dom';
import './MessageDetail.css';  // 引入样式文件

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

const MessageDetail = () => {
  const { messageId } = useParams(); // 获取路由中的参数
  const [message, setMessage] = useState(null); // 初始化消息状态
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态

  useEffect(() => {
    const fetchMessageDetail = async () => {
      try {
        const response = await axios.get('http://111.231.79.183:5201/api/getMessageDetailData');
        const foundMessage = response.data.MessageDetail.find(
          (msg) => msg.id === parseInt(messageId) // 根据 messageId 找到对应的消息
        );
        setMessage(foundMessage); // 设置消息详情
      } catch (err) {
        console.error('Error fetching message detail:', err);
        setError('无法获取消息详情'); // 设置错误信息
      } finally {
        setLoading(false); // 关闭加载状态
      }
    };

    fetchMessageDetail(); // 调用函数
  }, [messageId]); // 依赖于 messageId，当其变化时重新获取数据

  if (loading) {
    return <div>加载中...</div>; // 加载状态显示
  }

  if (error) {
    return <div>{error}</div>; // 错误状态显示
  }

  if (!message) {
    return <div>消息未找到</div>; // 如果消息不存在
  }

  return (
    <div className="messageDetailContainer">
      <h4>
        <svg className="messagedetail-container-icon" aria-hidden="true">
          <use xlinkHref="#icon-dingwei"></use>
        </svg>：
        <Link to="/home/specialtips">
          <svg className="messagedetail-container-icon" aria-hidden="true">
            <use xlinkHref="#icon-RectangleCopy13"></use>
          </svg>
        </Link>
        →消息通知→详情
      </h4>
      <h2 className="messageDetail-messageTitle">{message.title}</h2>
      <p className="messageDetail-messageTime">发布时间：{formatDate(message.time)}</p> {/* 格式化时间 */}
      <div className="messageDetail-messageContent">{message.content}</div>
    </div>
  );
};

export default MessageDetail;
