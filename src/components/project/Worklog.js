import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Worklog.css'; // 引入 CSS 文件

const Worklog = () => {
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://111.231.79.183:5201/api/getEvaluateworklogTable');
            setLogs(response.data);
        } catch (error) {
            console.error('获取工作日志失败:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    // 合并相同项目编号的数据
    const mergeLogs = (logs) => {
        const merged = {};
        logs.forEach(log => {
            if (!merged[log.project_id]) {
                merged[log.project_id] = [];
            }
            merged[log.project_id].push({
                communication_record: log.communication_record,
                contact_time: log.contact_time,
                id: log.id // 保留 ID 以便后续编辑和删除
            });
        });
        return merged;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://111.231.79.183:5201/api/updateEvaluateworklogTable/${editingId}`, formData);
            } else {
                await axios.post('http://111.231.79.183:5201/api/addEvaluateworklogTable', formData);
            }
            setFormData({});
            setEditingId(null);
            setIsModalOpen(false);
            fetchLogs();
        } catch (error) {
            console.error('保存工作日志失败:', error);
        }
    };

    const handleEdit = (log) => {
        setFormData(log);
        setEditingId(log.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://111.231.79.183:5201/api/deleteEvaluateworklogTable/${id}`);
            fetchLogs();
        } catch (error) {
            console.error('删除工作日志失败:', error);
        }
    };

    // 使用合并后的数据渲染日志
    const mergedLogs = mergeLogs(logs);
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (projectId) => {
        setExpanded(prev => ({ ...prev, [projectId]: !prev[projectId] }));
    };

    // 根据搜索项过滤日志
    const filteredLogs = Object.keys(mergedLogs).filter(projectId => 
        projectId.includes(searchTerm)
    );

    return (
        <div className="worklog">
            <h2>工作日志管理</h2>
            <input
                type="text"
                placeholder="搜索项目编号"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => { setIsModalOpen(true); setFormData({}); setEditingId(null); }}>添加工作日志</button>

            <div className="worklog-timeline">
                {filteredLogs.map((projectId) => (
                    <div className="worklog-timeline-item" key={projectId}>
                        <div className="worklog-timeline-content">
                            <h3 onClick={() => toggleExpand(projectId)} style={{ cursor: 'pointer' }}>
                                {projectId} {expanded[projectId] ? '▼' : '▲'}
                                <button onClick={() => handleEdit({ project_id: projectId, communication_record: '', contact_time: '', id: null })}>
                                    添加子项
                                </button>
                            </h3>
                            {expanded[projectId] && (
                                <div className="worklog-details">
                                    {mergedLogs[projectId].map((log, index) => (
                                        <div key={index} className="worklog-log-entry" onClick={() => handleEdit(log)}>
                                            <p>{new Date(log.contact_time).toISOString().slice(0, 10)} - {log.communication_record}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="worklog-modal">
                    <form onSubmit={handleSubmit}>
                        <h3>{editingId ? '编辑工作日志' : '添加工作日志'}</h3>
                        <label>项目编号：</label>
                        <input type="text" name="project_id" value={formData.project_id || ''} onChange={handleChange} required />
                        <label>沟通记录：</label>
                        <textarea name="communication_record" value={formData.communication_record || ''} onChange={handleChange} required />
                        <label>联系时间：</label>
                        <input type="date" name="contact_time" value={formData.contact_time ? new Date(formData.contact_time).toISOString().slice(0, 10) : ''} onChange={handleChange} required />
                        <button type="submit">{editingId ? '保存' : '添加'}</button>
                        <button type="button" onClick={() => setIsModalOpen(false)}>关闭</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Worklog;
