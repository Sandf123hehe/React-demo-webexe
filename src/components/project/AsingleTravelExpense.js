// 单个项目报销AsingleTravelExpense.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './AsingleTravelExpense.css';
import { useParams, Link } from 'react-router-dom';

// 日期格式化函数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // 返回格式为 YYYY-MM-DD
};

// 模态框组件
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="asingletravelexpense-modal-overlay">
      <div className="asingletravelexpense-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

// TravelExpenseForm 组件
const TravelExpenseForm = ({ expense, onSave, onCancel, onDelete }) => {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [amount, setAmount] = useState('');
  const [businessTripDate, setBusinessTripDate] = useState('');
  const [reimbursementDate, setReimbursementDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [whetherOver, setWhetherOver] = useState(false); // 新增状态
  const { projectNumber } = useParams(); // 接受项目编号

  useEffect(() => {
    if (expense) {
      setProjectName(expense.ProjectName);
      setLocation(expense.Location);
      setAmount(expense.Amount);
      setBusinessTripDate(formatDate(expense.BusinessTripDate));
      setReimbursementDate(formatDate(expense.ReimbursementDate));
      setRemarks(expense.Remarks);
      setWhetherOver(expense.Whetherover); // 新增
    } else {
      // 清空表单
      setProjectName('');
      setLocation('');
      setAmount('');
      setBusinessTripDate('');
      setReimbursementDate('');
      setRemarks('');
      setWhetherOver(false); // 新增
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName || !amount || !businessTripDate) {
      alert("请填写完整的报销记录！");
      return;
    }
    onSave({
      ProjectCode: projectNumber, // 使用项目编号
      ProjectName: projectName,
      Location: location,
      Amount: parseFloat(amount),
      BusinessTripDate: businessTripDate,
      ReimbursementDate: reimbursementDate,
      Remarks: remarks,
      Whetherover: whetherOver, // 新增
    });
  };

  const handleDelete = () => {
    if (expense) {
      onDelete(expense.ID);
    }
  };

  return (
    <form className="asingletravelexpense-expense-form" onSubmit={handleSubmit}>
      <div>
        <label>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      {/* 移除项目编号输入框 */}
      {/* <div>
        <label>项目编号：</label>
        <input
          type="text"
          value={projectCode}
          onChange={(e) => setProjectCode(e.target.value)}
        />
      </div> */}
      <div>
        <label>项目名称：</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>金&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额：</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>出差时间：</label>
        <input
          type="date"
          value={businessTripDate}
          onChange={(e) => setBusinessTripDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>报销时间：</label>
        <input
          type="date"
          value={reimbursementDate}
          onChange={(e) => setReimbursementDate(e.target.value)}
        />
      </div>
      <div>
        <label>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>
      <div>
        <label>报销状态：</label>
        <select
          value={whetherOver ? '1' : '0'}
          onChange={(e) => setWhetherOver(e.target.value === '1')}
        >
          <option value="0">未报销</option>
          <option value="1">已报销</option>
        </select>
      </div>
      <div className="asingletravelexpense-form-actions">
        <button type="submit" className="asingletravelexpense-btn-save" title="保存">
          <svg className="lside-container-icon-travelexpense" aria-hidden="true">
            <use xlinkHref="#icon-yishenhe1"></use>
          </svg>
        </button>
        <button type="button" className="asingletravelexpense-btn-cancel" onClick={onCancel} title="取消">
          <svg className="lside-container-icon-travelexpense" aria-hidden="true">
            <use xlinkHref="#icon-back"></use>
          </svg>
        </button>
        {expense && <button type="button" className="asingletravelexpense-btn-delete" title="删除" onClick={handleDelete}>
          <svg className="lside-container-icon-travelexpense" aria-hidden="true">
            <use xlinkHref="#icon-shanchu7"></use>
          </svg>
        </button>}
      </div>
    </form>
  );
};

// TravelExpense 组件
const AsingleTravelExpense = () => {
  const { username } = useContext(AuthContext); // 获取用户名
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expandedRows, setExpandedRows] = useState({}); // 用于管理展开的行
  const { projectNumber } = useParams(); // 接受项目编号

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://111.231.79.183:5201/api/getTravelExpenseReimbursementData', {
        params: { ReimbursedBy: username }
      });

      // 过滤出与当前项目编号匹配的报销记录
      const filteredExpenses = response.data.TravelExpenseReimbursement.filter(expense =>
        expense.ProjectCode === projectNumber
      );

      // 根据 BusinessTripDate 从近到远排序
      const sortedExpenses = filteredExpenses.sort((a, b) => {
        return new Date(b.BusinessTripDate) - new Date(a.BusinessTripDate);  // 降序排序
      });

      setExpenses(sortedExpenses);
      setFilteredExpenses(sortedExpenses);
    } catch (error) {
      console.error('获取报销记录失败:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [projectNumber]); // 依赖 projectNumber，当项目编号变化时重新获取数据

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsFormVisible(true);
  };

  const handleSaveExpense = async (newExpense) => {
    try {
      const expenseToSave = { ...newExpense, ReimbursedBy: username };

      let updatedExpenses;
      if (editingExpense) {
        await axios.put(`http://111.231.79.183:5201/api/updateTravelExpense/${editingExpense.ID}`, expenseToSave);
        updatedExpenses = expenses.map((exp) =>
          (exp.ID === editingExpense.ID ? { ...exp, ...expenseToSave } : exp)
        );
      } else {
        const response = await axios.post('http://111.231.79.183:5201/api/addTravelExpense', expenseToSave);
        updatedExpenses = [...expenses, { ...expenseToSave, ID: response.data.ID }];
      }

      setExpenses(updatedExpenses);
      setIsFormVisible(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('保存报销记录失败:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://111.231.79.183:5201/api/deleteTravelExpense/${id}`);
      setExpenses(expenses.filter((exp) => exp.ID !== id));
      setIsFormVisible(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('删除报销记录失败:', error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // 切换当前行的展开状态
    }));
  };

  return (
    <div className="asingletravelexpense-expense-container">
      <div className="asingletravelexpense-return-container">
        <div>
          <Link to="/home/personalhome" className="asingletravelexpense-tree-link">
            <svg className="lside-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-fanhui2"></use>
            </svg>
            <span className="asingletravelexpense-return-tooltip">返回首页</span>
          </Link>
        </div>
      </div>

      <div className="asingletravelexpense-expense-searchsection">
        <button className="asingletravelexpense-expense-addButton" onClick={() => { setEditingExpense(null); setIsFormVisible(true); }}>添加</button>
      </div>

      <table className="asingletravelexpense-expense-table">
        <thead>
          <tr>
            <th>功能</th>
            {/* 移除项目编号表头 */}
            {/* <th>项目编号</th> */}
            <th>项目名称</th>
            <th>金额</th>
            <th>出差时间</th>
            <th>地点</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <React.Fragment key={expense.ID}>
              <tr
                onClick={() => toggleExpand(expense.ID)}
                style={{ cursor: 'pointer', color: expense.Whetherover ? 'black' : 'red' }} // 设置行的颜色
              >
                <td>
                  <svg className="asingletravelexpense-expanded-icon" aria-hidden="true">
                    <use xlinkHref={expandedRows[expense.ID] ? "#icon-jiantou_liebiaoshouqi" : "#icon-jiantou_liebiaoxiangyou"}></use>
                  </svg>
                </td>
                {/* 显示项目编号 */}
                {/* <td>{expense.ProjectCode}</td> */}
                <td>{expense.ProjectName}</td>
                <td>¥{expense.Amount.toFixed(2)}</td>
                <td>{formatDate(expense.BusinessTripDate)}</td>
                <td>{expense.Location}</td>
                <td>
                  {expense.Whetherover ? '已报销' : '未报销'}
                </td>
              </tr>
              {expandedRows[expense.ID] && (
                <tr>
                  <td colSpan="8">
                    <div className="asingletravelexpense-td-editbuttondiv-Remarks">备注: {expense.Remarks}
                      <button className="asingletravelexpense-td-editbutton" title="编辑" onClick={(e) => { e.stopPropagation(); handleEditExpense(expense); }}>
                        <svg className="lside-container-icon" aria-hidden="true">
                          <use xlinkHref="#icon-xiugaidingdan" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* 模态框 */}
      <Modal isOpen={isFormVisible} onClose={() => setIsFormVisible(false)}>
        <TravelExpenseForm
          expense={editingExpense}
          onSave={handleSaveExpense}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingExpense(null);
          }}
          onDelete={handleDeleteExpense}
        />
      </Modal>
    </div>
  );
};

export default AsingleTravelExpense;
