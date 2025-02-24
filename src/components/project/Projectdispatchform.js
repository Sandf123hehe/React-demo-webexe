import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Projectdispatchform.css';
import { Link } from 'react-router-dom';

// 日期格式化函数
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
    const [dispatches, setDispatches] = useState([]); // 所有派单数据
    const [filteredDispatches, setFilteredDispatches] = useState([]); // 过滤后的派单数据
    const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(''); // 搜索关键字

    // 定义评估目的选项
    const evaluationPurposes = [
        "司法", "抵押", "征收", "课税", "咨询", "入账", "收购", "其他"
    ];

    // 定义项目类型选项
    const projectTypes = [
        "房地产", "资产", "土地"
    ];

    // 获取派单记录的函数
    const fetchDispatches = async () => {
        try {
            const response = await axios.get('http://111.231.79.183:5201/api/getProjectDispatchData');
            const formattedData = response.data.ProjectDispatchForm.map(dispatch => ({
                ...dispatch,
                ProjectNumber: dispatch.ProjectNumber || dispatch.Projectnumber, // 处理字段不一致
                CompleteProgress: dispatch.CompleteProgress !== undefined ?
                    dispatch.CompleteProgress : dispatch.Completeprogress // 处理字段不一致
            }));
            setDispatches(formattedData);
            setFilteredDispatches(formattedData); // 初始化过滤后的数据
        } catch (error) {
            console.error('获取派单记录失败:', error);
        }
    };

    // 组件挂载时调用 fetchDispatches 函数
    useEffect(() => {
        fetchDispatches();
    }, []);

    // 处理搜索关键字变化
    useEffect(() => {
        if (searchKeyword) {
            const filtered = dispatches.filter(dispatch =>
                Object.values(dispatch).some(value =>
                    value && value.toString().toLowerCase().includes(searchKeyword.toLowerCase())
                )
            );
            setFilteredDispatches(filtered);
        } else {
            setFilteredDispatches(dispatches); // 如果没有关键字，显示所有数据
        }
    }, [searchKeyword, dispatches]);

    // 处理输入框变化的函数
    const handleChange = (e) => {
        const { name, value } = e.target;
        // 如果是 CompleteProgress，直接将值转换为布尔类型
        const newValue = name === 'CompleteProgress' ? (value === 'true') : value;
        setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    };

    // 提交表单的函数
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                ProjectNumber: formData.ProjectNumber // 确保包含这个字段
            };
            console.log('Submitting data:', dataToSubmit); // 添加调试信息
            if (editingId) {
                await axios.put(`http://111.231.79.183:5201/api/updateProjectDispatch/${editingId}`, dataToSubmit);
            } else {
                await axios.post('http://111.231.79.183:5201/api/addProjectDispatch', dataToSubmit);
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
            ProjectNumber: dispatch.ProjectNumber || '', // 确保是字符串
            CompleteProgress: dispatch.CompleteProgress === true, // 确保是布尔值
            Principal: dispatch.Principal || '' // 新增 Principal 字段
        });
        setEditingId(dispatch.id);
        setIsModalOpen(true);
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

    // 检查日期是否超过25天
    const isOverdue = (dateString) => {
        const entrustDate = new Date(dateString);
        const currentDate = new Date();
        const timeDiff = currentDate - entrustDate; // 计算时间差
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 转换为天数
        return dayDiff > 25; // 如果超过25天，返回 true
    };

    return (
        <div className="projectdispatchform-container">
            <div className="projectdispatchform-container-headerbutton-container">
                <Link to="/home/personalhome" className="tree-link">
                    <svg className="lside-container-icon" aria-hidden="true">
                        <use xlinkHref="#icon-fanhui2"></use>
                    </svg>
                </Link>
                {/* 添加派单 */}
                <button className="projectdispatchform-container-button" onClick={() => {
                    setIsModalOpen(true);
                    setFormData({});
                    setEditingId(null);
                }}>
                    <svg className="lside-container-icon" aria-hidden="true">
                        <use xlinkHref="#icon-tianjia1"></use>
                    </svg>
                </button>
            </div>

            {/* 搜索框 */}
            <div className="projectdispatchform-search-container">
                <input
                    type="text"
                    placeholder="输入关键字搜索..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>
            <div className="projectdispatchform-tablecontainer">
                <table className="projectdispatchform-table">
                    <thead>
                        <tr>
                            <th>项目编号</th>
                            <th>项目名称</th>
                            <th>项目类型</th>
                            <th>评估目的</th>
                            <th>支行/分院</th>
                            <th>委托号</th>
                            <th>项目来源</th>
                            <th>联系人</th>
                            <th>电话</th>
                            {/* <th>委托方</th>
                            <th>联系人</th>
                            <th>电话</th>
                            <th>申请方</th>
                            <th>联系人</th>
                            <th>电话</th>
                            <th>被告</th>
                            <th>联系人</th>
                            <th>电话</th> */}
                            <th>委托日期</th>
                            <th>派单日期</th>
                            <th>备注</th>
                            <th>完成进度</th>
                            <th></th>
                        </tr>
                    </thead>
                    {/* // 在表格行中添加条件样式 */}
                    <tbody>
                        {filteredDispatches.map((dispatch) => (
                            <tr
                                key={dispatch.id}
                                className={dispatch.CompleteProgress ? 'completed-row' : ''} // 根据完成状态添加类名
                                style={{ color: isOverdue(dispatch.EntrustDate) ? 'red' : 'black' }} // 根据日期设置行颜色
                            >
                                <td>{dispatch.ProjectNumber}</td>
                                <td>{dispatch.ProjectName}</td>
                                <td>{dispatch.ProjectType}</td>
                                <td>{dispatch.EvaluationPurpose}</td>
                                <td>{dispatch.Branch}</td>
                                <td>{dispatch.OrderNumber}</td>
                                <td>{dispatch.ProjectSource}</td>
                                <td>{dispatch.ProjectSourceContact}</td>
                                <td>{dispatch.ProjectSourcePhone}</td>
                                {/* <td>{dispatch.Principal}</td>
                                <td>{dispatch.ClientContact}</td>
                                <td>{dispatch.ClientPhone}</td>
                                <td>{dispatch.Applicant}</td>
                                <td>{dispatch.ApplicantContact}</td>
                                <td>{dispatch.ApplicantPhone}</td>
                                <td>{dispatch.Defendant}</td>
                                <td>{dispatch.DefendantContact}</td>
                                <td>{dispatch.DefendantPhone}</td> */}
                                <td>{formatDate(dispatch.EntrustDate)}</td>
                                <td>{formatDate(dispatch.DispatchDate)}</td>

                                <td>{dispatch.Client}</td>
                                <td>{dispatch.CompleteProgress ? '已完成' : '未完成'}</td>
                                <td>
                                    {/* 工作日志 */}
                                    <Link to={`/home/asinglesitelog/${dispatch.ProjectNumber}`} className="tree-link" title="工作日志">
                                        <svg className="lside-container-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-kaifangqishiriqi"></use>
                                        </svg>
                                    </Link>
                                    {/* 报销 */}
                                    <Link to={`/home/asingletravelexpense/${dispatch.ProjectNumber}`} className="tree-link" title="报销">
                                        <svg className="lside-container-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-jiaoche-qiche-jiaotong-chuzuche-chuhang"></use>
                                        </svg>
                                    </Link>
                                    {/* 报告提成 */}
                                    <Link to={`/home/asingleachievements/${dispatch.ProjectNumber}`} className="tree-link" title="绩效">
                                        <svg className="lside-container-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-beixuanzhongx"></use>
                                        </svg>
                                    </Link>

                                    <button title='编辑' className="projectdispatchform-container-button" onClick={() => handleRowClick(dispatch)}>
                                        <svg className="lside-container-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-beizhu1"></use>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* 模态框 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form className="projectdispatchform-modal-form" onSubmit={handleSubmit}>
                    <h3>{editingId ? '编辑派单' : '添加派单'}</h3>
                    {/* 表单输入 */}
                    <div className="projectdispatchform-modal-div">
                        <label>项目编号：</label>
                        <input placeholder="* 项目编号" type="text" name="ProjectNumber" value={formData.ProjectNumber || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>项目名称：</label>
                        <input placeholder="* 项目名称" type="text" name="ProjectName" value={formData.ProjectName || ''} onChange={handleChange} required />
                    </div>

                    <div className="projectdispatchform-modal-div">
                        <label>项目类型：</label>

                        <select
                            name="ProjectType"
                            value={formData.ProjectType || ''}
                            onChange={handleChange}
                            required
                        >
                            <option placeholder="*请选择项目类型" value="">请选择项目类型</option>
                            {projectTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>评估目的：</label>

                        <select
                            name="EvaluationPurpose"
                            value={formData.EvaluationPurpose || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="">请选择评估目的</option>
                            {evaluationPurposes.map((purpose) => (
                                <option key={purpose} value={purpose}>{purpose}</option>
                            ))}
                        </select>
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>负责人：</label>
                        <input type="text" placeholder='必填项' name="PersonInCharge" value={formData.PersonInCharge || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>支行/分院：</label>
                        <input type="text" name="Branch" value={formData.Branch || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>委托号：</label>
                        <input type="text" name="OrderNumber" value={formData.OrderNumber || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>项目来源：</label>
                        <input type="text" placeholder="中介或合作方等..." name="ProjectSource" value={formData.ProjectSource || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>项目来源联系人：</label>
                        <input type="text" name="ProjectSourceContact" value={formData.ProjectSourceContact || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>项目来源电话：</label>
                        <input type="text" name="ProjectSourcePhone" value={formData.ProjectSourcePhone || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>委托方：</label>
                        <input
                            placeholder="***银行、***公司、***法院、个人等"
                            type="text"
                            name="Principal"
                            value={formData.Principal || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>委托方联系人：</label>
                        <input placeholder="委托方负责人" type="text" name="ClientContact" value={formData.ClientContact || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>委托方电话：</label>
                        <input type="text" placeholder="委托方负责人联系电话" name="ClientPhone" value={formData.ClientPhone || ''} onChange={handleChange} />
                    </div>
                    {/* 其他字段 */}



                    <div className="projectdispatchform-modal-div">
                        <label>申请方：</label>
                        <input type="text" name="Applicant" value={formData.Applicant || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>申请方联系人：</label>
                        <input type="text" placeholder="律师或者本人...." name="ApplicantContact" value={formData.ApplicantContact || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>申请方电话：</label>
                        <input type="text" name="ApplicantPhone" value={formData.ApplicantPhone || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>被告：</label>
                        <input type="text" name="Defendant" value={formData.Defendant || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>被告联系人：</label>
                        <input type="text" placeholder="被告本人或律师等" name="DefendantContact" value={formData.DefendantContact || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>被告电话：</label>
                        <input type="text" name="DefendantPhone" value={formData.DefendantPhone || ''} onChange={handleChange} />
                    </div>

                    <div className="projectdispatchform-modal-div">
                        <label>委托日期：</label>
                        &#42;<input type="date" name="EntrustDate" value={formData.EntrustDate || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>派单日期：</label>
                        &#42;<input type="date" name="DispatchDate" value={formData.DispatchDate || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>完成进度：</label>
                        <select
                            name="CompleteProgress"
                            value={formData.CompleteProgress === true ? 'true' : 'false'}
                            onChange={handleChange}
                        >
                            <option value="false">未完成</option>
                            <option value="true">已完成</option>
                        </select>
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <label>备注：</label>
                        <input type="text" name="Client" value={formData.Client || ''} onChange={handleChange} />
                    </div>
                    <div className="projectdispatchform-modal-div">
                        <button type="submit">{editingId ? '保存' : '添加'}</button>
                        {editingId && (
                            <button type="button" onClick={() => handleDelete(editingId)}>删除</button>
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectDispatchForm;