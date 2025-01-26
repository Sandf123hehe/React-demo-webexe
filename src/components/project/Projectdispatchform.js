import React, { useEffect, useState } from 'react'; // 导入 React 和相关 Hooks
import axios from 'axios'; // 导入 axios 用于发送 HTTP 请求
import './Projectdispatchform.css'; // 导入 CSS 文件以应用样式
import { Link } from 'react-router-dom';
// 日期格式化函数
const formatDate = (dateString) => {
    const date = new Date(dateString); // 将日期字符串转换为 Date 对象
    return date.toISOString().split('T')[0]; // 返回格式为 YYYY-MM-DD
};

// 模态框组件
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="projectdispatchform-modal-overlay">
            <div className="projectdispatchform-modal-content">
                <button className="projectdispatchform-close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

// ProjectDispatchForm 组件
const ProjectDispatchForm = () => {
    const [dispatches, setDispatches] = useState([]); // 存储派单记录的状态
    const [formData, setFormData] = useState({}); // 存储表单数据的状态
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态框打开/关闭的状态
    const [editingId, setEditingId] = useState(null); // 存储正在编辑的派单记录的 ID

    // 获取派单记录的函数
    const fetchDispatches = async () => {
        try {
            const response = await axios.get('http://111.231.79.183:5201/api/getProjectDispatchData');
            setDispatches(response.data.ProjectDispatchForm);
        } catch (error) {
            console.error('获取派单记录失败:', error);
        }
    };

    // 组件挂载时调用 fetchDispatches 函数
    useEffect(() => {
        fetchDispatches();
    }, []);

    // 处理输入框变化的函数
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // 提交表单的函数
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://111.231.79.183:5201/api/updateProjectDispatch/${editingId}`, formData);
            } else {
                await axios.post('http://111.231.79.183:5201/api/addProjectDispatch', formData);
            }
            setFormData({});
            setEditingId(null);
            setIsModalOpen(false);
            fetchDispatches();
        } catch (error) {
            console.error('保存派单记录失败:', error);
        }
    };

    // 处理行点击的函数
    const handleRowClick = (dispatch) => {
        setFormData({
            ...dispatch,
            EntrustDate: formatDate(dispatch.EntrustDate),
            DispatchDate: formatDate(dispatch.DispatchDate),
        });
        setEditingId(dispatch.id); // 设置正在编辑的派单 ID
        setIsModalOpen(true); // 打开模态框
    };

    // 处理删除操作的函数
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://111.231.79.183:5201/api/deleteProjectDispatch/${id}`);
            fetchDispatches();
        } catch (error) {
            console.error('删除派单记录失败:', error);
        }
    };

    return (
        <div className="projectdispatchform-container">
            <Link to="/home/personalhome" className="tree-link">
                <svg className="lside-container-icon" aria-hidden="true">
                    <use xlinkHref="#icon-fanhui2">
                    </use>
                </svg>
            </Link>
            <h2>项目派单管理</h2>
            <button onClick={() => {
                setIsModalOpen(true);
                setFormData({}); // 清空表单数据以添加新记录
                setEditingId(null); // 重置编辑 ID
            }}>添加派单</button>

            <table className="projectdispatchform-table">
                <thead>
                    <tr>
                        <th>项目名称</th>
                        <th>支行/分院</th>
                        <th>委托号</th>
                        <th>项目来源</th>
                    </tr>
                </thead>
                <tbody>
                    {dispatches.map((dispatch) => (
                        <tr key={dispatch.id} onClick={() => handleRowClick(dispatch)}> {/* 点击行展开模态框 */}
                            <td>{dispatch.ProjectName}</td>
                            <td>{dispatch.Branch}</td>
                            <td>{dispatch.OrderNumber}</td>
                            <td>{dispatch.ProjectSource}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 模态框 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <h3>{editingId ? '编辑派单' : '添加派单'}</h3>
                    {/* 表单输入 */}
                    <label>项目名称：</label>
                    <input type="text" name="ProjectName" value={formData.ProjectName || ''} onChange={handleChange} required />
                    <label>支行/分院：</label>
                    <input type="text" name="Branch" value={formData.Branch || ''} onChange={handleChange} />
                    <label>委托号：</label>
                    <input type="text" name="OrderNumber" value={formData.OrderNumber || ''} onChange={handleChange} />
                    <label>项目来源：</label>
                    <input type="text" name="ProjectSource" value={formData.ProjectSource || ''} onChange={handleChange} />
                    <label>项目来源联系人：</label>
                    <input type="text" name="ProjectSourceContact" value={formData.ProjectSourceContact || ''} onChange={handleChange} />
                    <label>项目来源电话：</label>
                    <input type="text" name="ProjectSourcePhone" value={formData.ProjectSourcePhone || ''} onChange={handleChange} />
                    <label>客户：</label>
                    <input type="text" name="Client" value={formData.Client || ''} onChange={handleChange} />
                    <label>客户联系人：</label>
                    <input type="text" name="ClientContact" value={formData.ClientContact || ''} onChange={handleChange} />
                    <label>客户电话：</label>
                    <input type="text" name="ClientPhone" value={formData.ClientPhone || ''} onChange={handleChange} />
                    <label>申请人：</label>
                    <input type="text" name="Applicant" value={formData.Applicant || ''} onChange={handleChange} />
                    <label>申请人联系人：</label>
                    <input type="text" name="ApplicantContact" value={formData.ApplicantContact || ''} onChange={handleChange} />
                    <label>申请人电话：</label>
                    <input type="text" name="ApplicantPhone" value={formData.ApplicantPhone || ''} onChange={handleChange} />
                    <label>被告：</label>
                    <input type="text" name="Defendant" value={formData.Defendant || ''} onChange={handleChange} />
                    <label>被告联系人：</label>
                    <input type="text" name="DefendantContact" value={formData.DefendantContact || ''} onChange={handleChange} />
                    <label>被告电话：</label>
                    <input type="text" name="DefendantPhone" value={formData.DefendantPhone || ''} onChange={handleChange} />
                    <label>项目类型：</label>
                    <input type="text" name="ProjectType" value={formData.ProjectType || ''} onChange={handleChange} />
                    <label>评估目的：</label>
                    <input type="text" name="EvaluationPurpose" value={formData.EvaluationPurpose || ''} onChange={handleChange} />
                    <label>负责人：</label>
                    <input type="text" name="PersonInCharge" value={formData.PersonInCharge || ''} onChange={handleChange} />
                    <label>委托日期：</label>
                    <input type="date" name="EntrustDate" value={formData.EntrustDate || ''} onChange={handleChange} />
                    <label>派单日期：</label>
                    <input type="date" name="DispatchDate" value={formData.DispatchDate || ''} onChange={handleChange} />
                    <button type="submit">{editingId ? '保存' : '添加'}</button>
                    {editingId && ( // 仅在编辑模式下显示删除按钮
                        <button type="button" onClick={() => handleDelete(editingId)}>删除</button>
                    )}
                </form>
            </Modal>
        </div>
    );
};

export default ProjectDispatchForm; // 导出组件以供使用
