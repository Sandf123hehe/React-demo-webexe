import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Asinglesitelog.css'; // 引入 CSS 文件
import { useParams, Link } from 'react-router-dom';
 
const Asinglesitelog = () => {
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { projectNumber } = useParams(); // 接受项目编号

    // 获取工作日志
    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://111.231.79.183:5201/api/getEvaluateworklogTable');
            // 过滤与 projectNumber 匹配的日志
            const filteredLogs = response.data.filter(log => log.project_id === projectNumber);
            setLogs(filteredLogs);
        } catch (error) {
            console.error('获取工作日志失败:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [projectNumber]); // 依赖于 projectNumber

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 确保项目编号在表单数据中
            const dataToSubmit = { ...formData, project_id: projectNumber };

            if (editingId) {
                await axios.put(`http://111.231.79.183:5201/api/updateEvaluateworklogTable/${editingId}`, dataToSubmit);
            } else {
                await axios.post('http://111.231.79.183:5201/api/addEvaluateworklogTable', dataToSubmit);
            }
            setFormData({});
            setEditingId(null);
            setIsModalOpen(false);
            fetchLogs(); // 更新日志
        } catch (error) {
            console.error('保存工作日志失败:', error);
        }
    };

    const handleEdit = (log) => {
        setFormData(log);
        setEditingId(log.id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://111.231.79.183:5201/api/deleteEvaluateworklogTable/${editingId}`);
            fetchLogs(); // 更新日志
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({});
        } catch (error) {
            console.error('删除工作日志失败:', error);
        }
    };

    return (
        <div className="asinglesitelog">
            <div>
          <Link to="/home/personalhome" className="asinglesitelog-tree-link">
            <svg className="asinglesitelog-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-fanhui2"></use>
            </svg>
            <span className="travel-return-tooltip">返回首页</span>
          </Link>
        </div>
            <h2>工作日志管理</h2>
            <p>项目编号: {projectNumber}</p>
            {/* 添加日志按钮 */}
            <div className="asinglesitelog-add-button-container">
                <button onClick={() => {
                    setIsModalOpen(true);
                    setFormData({}); // 清空表单数据
                    setEditingId(null);
                }}>
                    <svg className="asinglesitelog-container-icon" aria-hidden="true">
                        <use xlinkHref="#icon-tianjia"></use>
                    </svg>
                </button>
            </div>
            <div className="asinglesitelog-timeline">
                {logs.map(log => (
                    <div className="asinglesitelog-log-entry" key={log.id}>
                        <p onClick={() => handleEdit(log)} style={{ cursor: 'pointer' }}>
                            {new Date(log.contact_time).toISOString().slice(0, 10)} - {log.communication_record}
                        </p>
                    </div>
                ))}
            </div>



            {isModalOpen && (
                <div className="asinglesitelog-modal">
                    <form onSubmit={handleSubmit}>
                        <h3>{editingId ? '编辑工作日志' : '添加工作日志'}</h3>
                        {/* 项目编号不显示 */}
                        <input type="hidden" name="project_id" value={projectNumber} />
                        <label>沟通记录：</label>
                        <textarea name="communication_record" value={formData.communication_record || ''} onChange={handleChange} required />
                        <label>联系时间：</label>
                        <input type="date" name="contact_time" value={formData.contact_time ? new Date(formData.contact_time).toISOString().slice(0, 10) : ''} onChange={handleChange} required />
                        <button type="submit">{editingId ? '保存' : '添加'}</button>
                        {editingId && (
                            <button type="button" onClick={handleDelete}>删除</button>
                        )}
                        <button type="button" onClick={() => setIsModalOpen(false)}>关闭</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Asinglesitelog;
