import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReportNumberTable.css'; // 导入 CSS 文件
import { Link } from 'react-router-dom';
// 日期格式化函数
const formatDate = (dateString) => {
    const date = new Date(dateString); // 将日期字符串转换为 Date 对象
    return date.toISOString().split('T')[0]; // 返回格式为 YYYY-MM-DD
};

const ReportNumberTable = () => {
    const [reports, setReports] = useState([]);
    const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://111.231.79.183:5201/api/getReportNumbers');
            const formattedReports = response.data.map(report => ({
                ...report,
                issue_date: formatDate(report.issue_date) // 格式化日期
            }));
            setReports(formattedReports);
        } catch (error) {
            console.error('获取报告失败:', error);
        }
    };
    

    useEffect(() => {
        fetchReports();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 格式化日期
            if (formData.issue_date) {
                formData.issue_date = formatDate(formData.issue_date);
            }
            console.log(formData); // 检查提交的数据

            if (editingId) {
                await axios.put(`http://111.231.79.183:5201/api/updateReportNumbers/${editingId}`, formData);
            } else {
                await axios.post('http://111.231.79.183:5201/api/addReportNumbers', formData);
            }
            setFormData({});
            setEditingId(null);
            setIsModalOpen(false);
            fetchReports();
        } catch (error) {
            console.error('保存报告失败:', error);
        }
    };

    const handleEdit = (report) => {
        setFormData(report);
        setEditingId(report.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://111.231.79.183:5201/api/deleteReportNumbers/${id}`);
            fetchReports();
        } catch (error) {
            console.error('删除报告失败:', error);
        }
    };

    return (
        <div className="report-number-table">
             <Link to="/home/personalhome" className="tree-link">
                <svg className="lside-container-icon" aria-hidden="true">
                    <use xlinkHref="#icon-fanhui2">
                    </use>
                </svg>
            </Link>
            <h2>报告管理</h2>
            <button onClick={() => {
                setIsModalOpen(true);
                setFormData({});
                setEditingId(null);
            }}>添加报告</button>

            <table>
                <thead>
                    <tr>
                        <th>资产区域</th>
                        <th>报告类型</th>
                        <th>总评估价</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id} onClick={() => handleEdit(report)}>
                            <td>{report.asset_region}</td>
                            <td>{report.report_type}</td>
                            <td>{report.total_assessment_value}</td>
                            <td>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <form onSubmit={handleSubmit}>
                        <h3>{editingId ? '编辑报告' : '添加报告'}</h3>
                        <label>资产区域：</label>
                        <input type="text" name="asset_region" value={formData.asset_region || ''} onChange={handleChange} required />
                        <label>报告类型：</label>
                        <input type="text" name="report_type" value={formData.report_type || ''} onChange={handleChange} />
                        <label>总评估价：</label>
                        <input type="number" name="total_assessment_value" value={formData.total_assessment_value || ''} onChange={handleChange} />
                        <label>资产用途：</label>
                        <input type="text" name="asset_usage" value={formData.asset_usage || ''} onChange={handleChange} />
                        <label>评估单价：</label>
                        <input type="number" name="unit_assessment_price" value={formData.unit_assessment_price || ''} onChange={handleChange} />
                        <label>评估面积：</label>
                        <input type="number" name="assessment_area" value={formData.assessment_area || ''} onChange={handleChange} />
                        <label>报告份数：</label>
                        <input type="number" name="report_count" value={formData.report_count || ''} onChange={handleChange} />
                        <label>出具日期：</label>
                        <input type="date" name="issue_date" value={formData.issue_date || ''} onChange={handleChange} />
                        <label>报告编号：</label>
                        <input type="text" name="report_number" value={formData.report_number || ''} onChange={handleChange} />
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

export default ReportNumberTable;
