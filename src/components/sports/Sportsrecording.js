import React, { useState, useEffect, useContext } from 'react';
import './Sportsrecording.css'; // 引入样式文件
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // 导入 AuthContext
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate

function SportsRecording() {
    const { username } = useContext(AuthContext); // 使用上下文获取用户名
    const navigate = useNavigate(); // 用于页面跳转的 hook

    const [records, setRecords] = useState([]); // 存储运动记录
    const [modalVisible, setModalVisible] = useState(false); // 控制模态框显示
    const [selectedRecord, setSelectedRecord] = useState(null); // 当前选中的记录
    const [newRecord, setNewRecord] = useState({ sport_type: '', unit: '', quantity: '', date: '', duration: '', participant: username || '', remark: '' }); // 新记录的数据
    const [filterDate, setFilterDate] = useState(''); // 筛选日期
    const [selectedParticipant, setSelectedParticipant] = useState(''); // 选择的参与者
    const [filteredRecords, setFilteredRecords] = useState([]); // 筛选后的记录
    const [collapsedDates, setCollapsedDates] = useState({}); // 存储每个日期的展开状态
    const [collapsedRecords, setCollapsedRecords] = useState({}); // 存储每条记录的展开状态
    const [showAlert, setShowAlert] = useState(false); // 控制提示显示

    const participants = ['李中敬', '陈彦羽']; // 参与者列表

    const sportOptions = {
        '跑步': 'icon-paobu1',
        '深蹲': 'icon-shendun',
        '跳绳': 'icon-tiaosheng2',
        '引体向上': 'icon-yintixiangshang2',
        '平板撑': 'icon-a-Frame22',
        '羽毛球': 'icon-yumaoqiu1',
        '俯卧撑': 'icon-fuwocheng2',
        '瑜伽': 'icon-yuqie3',
        '仰卧起坐': 'icon-yangwoqizuo3'
    };

    // 权限检查
    useEffect(() => {
        if (username !== '陈彦羽' && username !== '李中敬') {
            setShowAlert(true); // 显示权限不足提示
            // 延迟跳转，这样用户有时间看到提示
            setTimeout(() => {
                navigate('/'); // 跳转到首页
            }, 2000); // 延迟2秒跳转
        }
    }, [username, navigate]);

    // 获取所有记录
    const fetchRecords = async () => {
        const response = await axios.get('http://111.231.79.183:5201/api/getSportsRecordingTable');
        const sortedRecords = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按日期排序
        setRecords(sortedRecords);
    };

    useEffect(() => {
        fetchRecords(); // 组件挂载时获取记录
    }, []);

    useEffect(() => {
        filterRecords(); // 筛选记录
    }, [filterDate, selectedParticipant, records]);

    // 格式化日期
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // 仅返回 YYYY-MM-DD
    };

    // 格式化时间
    const formatTime = (timeString) => {
        const time = new Date(timeString);
        return time.toISOString().substr(11, 8); // 返回 HH:MM:SS
    };

    // 筛选记录
    const filterRecords = () => {
        let filtered = records;
        if (filterDate) {
            filtered = filtered.filter(record => formatDate(record.date) === filterDate);
        }
        if (selectedParticipant) {
            filtered = filtered.filter(record => record.participant === selectedParticipant);
        }
        setFilteredRecords(filtered);
    };

    // 打开模态框
    const openModal = (record = null) => {
        setSelectedRecord(record);
        if (record) {
            setNewRecord({ ...record, duration: formatTime(record.duration), participant: username }); // 编辑时填充数据
        } else {
            setNewRecord({ sport_type: '', unit: '', quantity: '', date: '', duration: '00:00:00', participant: username, remark: '' }); // 添加新记录时重置
        }
        setModalVisible(true);
    };

    // 关闭模态框
    const closeModal = () => {
        setModalVisible(false);
        setSelectedRecord(null);
        setCollapsedRecords({}); // 重置展开状态
    };

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedRecord) {
            // 更新记录
            await axios.put(`http://111.231.79.183:5201/api/updateSportsRecordingTable/${selectedRecord.id}`, newRecord);
        } else {
            // 添加记录
            await axios.post('http://111.231.79.183:5201/api/addSportsRecordingTable', newRecord);
        }
        fetchRecords(); // 刷新记录
        closeModal(); // 关闭模态框
    };

    // 删除记录
    const handleDelete = async (id) => {
        await axios.delete(`http://111.231.79.183:5201/api/deleteSportsRecordingTable/${id}`);
        fetchRecords(); // 刷新记录
    };

    // 按天汇总的记录
    const groupedRecords = filteredRecords.reduce((acc, record) => {
        const date = formatDate(record.date);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(record);
        return acc;
    }, {});

    // 切换日期的展开和折叠状态
    const toggleCollapse = (date) => {
        setCollapsedDates(prev => ({ ...prev, [date]: !prev[date] }));
    };

    // 切换记录的展开和折叠状态
    const toggleRecordCollapse = (id) => {
        setCollapsedRecords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="sportsrecord-container">
            <h1 className="sportsrecord-title">运动记录管理</h1>

            {showAlert && <div className="alert">权限不足，正在跳转到首页...</div>}

            {/* 日期筛选和选择人员的下拉框 */}
            <div className="date-filter">
                <label>选择日期:</label>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                <label>选择参与者:</label>
                <select value={selectedParticipant} onChange={(e) => setSelectedParticipant(e.target.value)}>
                    <option value="">所有参与者</option>
                    {participants.map(participant => (
                        <option key={participant} value={participant}>{participant}</option>
                    ))}
                </select>
                <button className="sportsrecord-add-button" onClick={() => openModal()}>添加记录</button>
            </div>

            {Object.keys(groupedRecords).map(date => (
                <div key={date} className="date-group">
                    <h2 style={{ display: 'inline-block', cursor: 'pointer' }} onClick={() => toggleCollapse(date)}>
                        {date}
                    </h2>
                    <button onClick={() => toggleCollapse(date)} style={{ marginLeft: '10px' }}>
                        {collapsedDates[date] ? '展开' : '折叠'}
                    </button>
                    {!collapsedDates[date] && (
                        <div>
                            <table className="sportsrecord-table">
                                <thead>
                                    <tr>
                                        <th>运动类型</th>
                                        <th>计量单位</th>
                                        <th>数量</th>
                                        <th>时间</th>
                                        <th>参与者</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedRecords[date].map(record => (
                                        <React.Fragment key={record.id}>
                                            <tr onClick={() => toggleRecordCollapse(record.id)} style={{ cursor: 'pointer' }}>
                                                <td>
                                                    <svg className="header-container-icon" aria-hidden="true">
                                                        <use xlinkHref={`#${sportOptions[record.sport_type]}`}></use>
                                                    </svg>
                                                </td>
                                                <td>{record.unit}</td>
                                                <td>{record.quantity}</td>
                                                <td>{formatTime(record.duration)}</td>
                                                <td>{record.participant}</td>
                                            </tr>
                                            {collapsedRecords[record.id] && (
                                                <tr>
                                                    <td colSpan="5">
                                                        <div>
                                                            备注: {record.remark}
                                                            <button className="sportsrecord-edit-button" onClick={() => openModal(record)}>编辑</button>
                                                            <button className="sportsrecord-delete-button" onClick={() => handleDelete(record.id)}>删除</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}

            {/* 模态框 */}
            {modalVisible && (
                <div className="sportsrecord-modal-overlay">
                    <div className="sportsrecord-modal-content">
                        <h2 className="sportsrecord-modal-title">{selectedRecord ? '编辑记录' : '添加记录'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="sportsrecord-form-group">
                                <label>运动类型:</label>
                                <select value={newRecord.sport_type} onChange={(e) => setNewRecord({ ...newRecord, sport_type: e.target.value })} required>
                                    <option value="">请选择运动类型</option>
                                    {Object.keys(sportOptions).map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="sportsrecord-form-group">
                                <label>计量单位:</label>
                                <input type="text" value={newRecord.unit} onChange={(e) => setNewRecord({ ...newRecord, unit: e.target.value })} required />
                            </div>
                            <div className="sportsrecord-form-group">
                                <label>数量:</label>
                                <input type="number" value={newRecord.quantity} onChange={(e) => setNewRecord({ ...newRecord, quantity: e.target.value })} required />
                            </div>
                            <div className="sportsrecord-form-group">
                                <label>日期:</label>
                                <input type="date" value={newRecord.date} onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })} required />
                            </div>
                            <div className="sportsrecord-form-group">
                                <label>时间:</label>
                                <input type="time" value={newRecord.duration} onChange={(e) => setNewRecord({ ...newRecord, duration: e.target.value })} required />
                            </div>
                            <div className="sportsrecord-form-group">
                                <label>参与者:</label>
                                <input type="text" value={newRecord.participant} onChange={(e) => setNewRecord({ ...newRecord, participant: e.target.value })} required />
                            </div>
                            <div className="sportsrecord-form-group">
                                <label>备注:</label>
                                <input type="text" value={newRecord.remark} onChange={(e) => setNewRecord({ ...newRecord, remark: e.target.value })} />
                            </div>
                            <div className="sportsrecord-modal-buttons">
                                <button type="submit">{selectedRecord ? '更新记录' : '添加记录'}</button>
                                <button type="button" onClick={closeModal}>关闭</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SportsRecording;
