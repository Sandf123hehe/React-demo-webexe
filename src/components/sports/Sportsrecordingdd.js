import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Sportsrecording.css';

function SportsRecording() {
    const { username } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [records, setRecords] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [newRecord, setNewRecord] = useState({
        sport_type: '',
        unit: '',
        quantity: '',
        date: '',
        duration: '00:00:00',
        participant: username || '',
        remark: ''
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        const response = await axios.get('http://111.231.79.183:5201/api/getSportsRecordingTable');
        setRecords(response.data);
    };

    const openModal = (record = null) => {
        setSelectedRecord(record);
        if (record) {
            setNewRecord(record);
        } else {
            setNewRecord({
                sport_type: '',
                unit: '',
                quantity: '',
                date: '',
                duration: '00:00:00',
                participant: username || '',
                remark: ''
            });
        }
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedRecord(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedRecord) {
                // Update record
                await axios.put(`http://111.231.79.183:5201/api/updateSportsRecordingTable/${selectedRecord.id}`, newRecord);
            } else {
                // Add new record
                await axios.post('http://111.231.79.183:5201/api/addSportsRecordingTable', newRecord);
            }
            fetchRecords();
            closeModal();
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('提交失败，请检查输入数据。');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('确认删除该记录吗？')) {
            await axios.delete(`http://111.231.79.183:5201/api/deleteSportsRecordingTable/${id}`);
            fetchRecords();
        }
    };

    return (
        <div className="sportsrecord-container">
            <h1 className="sportsrecord-title">运动记录管理</h1>
            <button onClick={() => openModal()}>添加记录</button>
            <table className="sportsrecord-table">
                <thead>
                    <tr>
                        <th>运动类型</th>
                        <th>计量单位</th>
                        <th>数量</th>
                        <th>日期</th>
                        <th>时间</th>
                        <th>参与者</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.id}>
                            <td>{record.sport_type}</td>
                            <td>{record.unit}</td>
                            <td>{record.quantity}</td>
                            <td>{record.date}</td>
                            <td>{record.duration}</td>
                            <td>{record.participant}</td>
                            <td>
                                <button onClick={() => openModal(record)}>编辑</button>
                                <button onClick={() => handleDelete(record.id)}>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedRecord ? '编辑记录' : '添加记录'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" value={newRecord.sport_type} onChange={(e) => setNewRecord({ ...newRecord, sport_type: e.target.value })} placeholder="运动类型" required />
                            <input type="text" value={newRecord.unit} onChange={(e) => setNewRecord({ ...newRecord, unit: e.target.value })} placeholder="计量单位" required />
                            <input type="number" value={newRecord.quantity} onChange={(e) => setNewRecord({ ...newRecord, quantity: e.target.value })} placeholder="数量" required />
                            <input type="date" value={newRecord.date} onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })} required />
                            <input type="time" value={newRecord.duration} onChange={(e) => setNewRecord({ ...newRecord, duration: e.target.value })} required />
                            <input type="text" value={newRecord.participant} onChange={(e) => setNewRecord({ ...newRecord, participant: e.target.value })} placeholder="参与者" required />
                            <textarea value={newRecord.remark} onChange={(e) => setNewRecord({ ...newRecord, remark: e.target.value })} placeholder="备注"></textarea>
                            <button type="submit">{selectedRecord ? '更新记录' : '添加记录'}</button>
                            <button type="button" onClick={closeModal}>关闭</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SportsRecording;
