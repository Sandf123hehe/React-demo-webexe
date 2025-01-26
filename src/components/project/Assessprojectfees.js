import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Assessprojectfees.css'; // 引入 CSS 文件
import { Link } from 'react-router-dom';

const AssessProjectFees = () => {
    const [fees, setFees] = useState([]);
    const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchFees = async () => {
        try {
            const response = await axios.get('http://111.231.79.183:5201/api/getAssessProjectFees');
            setFees(response.data);
        } catch (error) {
            console.error('获取费用记录失败:', error);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://111.231.79.183:5201/api/updateAssessProjectFees/${editingId}`, formData);
            } else {
                await axios.post('http://111.231.79.183:5201/api/addAssessProjectFees', formData);
            }
            setFormData({});
            setEditingId(null);
            setIsModalOpen(false);
            fetchFees();
        } catch (error) {
            console.error('保存费用记录失败:', error);
        }
    };

    const handleEdit = (fee) => {
        setFormData(fee);
        setEditingId(fee.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://111.231.79.183:5201/api/deleteAssessProjectFees/${id}`);
            fetchFees();
        } catch (error) {
            console.error('删除费用记录失败:', error);
        }
    };

    return (
        <div className="assessprojectfees">
             <Link to="/home/personalhome" className="tree-link">
                <svg className="lside-container-icon" aria-hidden="true">
                    <use xlinkHref="#icon-fanhui2">
                    </use>
                </svg>
            </Link>
            <h2>费用管理</h2>
            <button onClick={() => {
                setIsModalOpen(true);
                setFormData({});
                setEditingId(null);
            }}>添加费用记录</button>

            <table>
                <thead>
                    <tr>
                        <th>项目编号</th>
                        <th>费用金额</th>
                        <th>费用时间</th>
                        <th>费用类型</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {fees.map((fee) => (
                        <tr key={fee.id}>
                            <td>{fee.project_id}</td>
                            <td>{fee.fee_amount}</td>
                            <td>{new Date(fee.fee_date).toLocaleDateString()}</td>
                            <td>{fee.fee_type}</td>
                            <td>{fee.remarks}</td>
                            <td>
                                <button onClick={() => handleEdit(fee)}>编辑</button>
                                <button onClick={() => handleDelete(fee.id)}>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <form onSubmit={handleSubmit}>
                        <h3>{editingId ? '编辑费用记录' : '添加费用记录'}</h3>
                        <label>项目编号：</label>
                        <input type="text" name="project_id" value={formData.project_id || ''} onChange={handleChange} required />
                        <label>费用金额：</label>
                        <input type="number" name="fee_amount" value={formData.fee_amount || ''} onChange={handleChange} required />
                        <label>费用时间：</label>
                        <input type="datetime-local" name="fee_date" value={formData.fee_date ? new Date(formData.fee_date).toISOString().slice(0, 16) : ''} onChange={handleChange} required />
                        <label>费用类型：</label>
                        <select name="fee_type" value={formData.fee_type || ''} onChange={handleChange} required>
                            <option value="预付款">预付款</option>
                            <option value="尾款">尾款</option>
                        </select>
                        <label>备注：</label>
                        <input type="text" name="remarks" value={formData.remarks || ''} onChange={handleChange} />
                        <button type="submit">{editingId ? '保存' : '添加'}</button>
                        <button type="button" onClick={() => setIsModalOpen(false)}>关闭</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AssessProjectFees;
