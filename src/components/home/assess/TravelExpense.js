import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext'; 
import './TravelExpense.css';
import { Link } from 'react-router-dom';
// 日期格式化函数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // 返回格式为 YYYY-MM-DD
};

// 模态框组件
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="travelExpense-modal-overlay">
      <div className="travelExpense-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

// TravelExpenseForm 组件
const TravelExpenseForm = ({ expense, onSave, onCancel, onDelete }) => {
  const [projectCode, setProjectCode] = useState('');
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [amount, setAmount] = useState('');
  const [businessTripDate, setBusinessTripDate] = useState('');
  const [reimbursementDate, setReimbursementDate] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (expense) {
      setProjectCode(expense.ProjectCode);
      setProjectName(expense.ProjectName);
      setLocation(expense.Location);
      setAmount(expense.Amount);
      setBusinessTripDate(formatDate(expense.BusinessTripDate));
      setReimbursementDate(formatDate(expense.ReimbursementDate));
      setRemarks(expense.Remarks);
    } else {
      setProjectCode('');
      setProjectName('');
      setLocation('');
      setAmount('');
      setBusinessTripDate('');
      setReimbursementDate('');
      setRemarks('');
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName || !amount || !businessTripDate) {
      alert("请填写完整的报销记录！");
      return;
    }
    onSave({
      ProjectCode: projectCode,
      ProjectName: projectName,
      Location: location,
      Amount: parseFloat(amount),
      BusinessTripDate: businessTripDate,
      ReimbursementDate: reimbursementDate,
      Remarks: remarks,
    });
  };

  const handleDelete = () => {
    if (expense) {
      onDelete(expense.ID);
    }
  };

  return (
    <form className="travel-expense-form" onSubmit={handleSubmit}>
      <div>
        <label>地点：</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label>项目编号：</label>
        <input
          type="text"
          value={projectCode}
          onChange={(e) => setProjectCode(e.target.value)}
        />
      </div>
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
        <label>金额：</label>
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
        <label>备注：</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit">保存</button>
        <button type="button" onClick={onCancel}>取消</button>
        {expense && <button type="button" onClick={handleDelete}>删除</button>}
      </div>
    </form>
  );
};

// TravelExpense 组件
const TravelExpense = () => {
  const { username } = useContext(AuthContext); // 获取用户名
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [expandedRows, setExpandedRows] = useState({}); // 用于管理展开的行

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://111.231.79.183:5201/api/getTravelExpenseReimbursementData', {
        params: { ReimbursedBy: username }
      });

      const filteredExpenses = response.data.TravelExpenseReimbursement.filter(expense =>
        expense.ReimbursedBy === username
      );

      setExpenses(filteredExpenses);
      setFilteredExpenses(filteredExpenses);
    } catch (error) {
      console.error('获取报销记录失败:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const filtered = expenses.filter((expense) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        expense.ProjectName.toLowerCase().includes(searchTermLower) ||
        expense.ProjectCode.toLowerCase().includes(searchTermLower) ||
        expense.Location.toLowerCase().includes(searchTermLower)
      );
    });

    // 过滤按选定的月份
    const monthFiltered = filtered.filter((expense) => {
      if (!selectedMonth) return true; // 如果没有选择月份，则不过滤
      const expenseDate = new Date(expense.BusinessTripDate);
      return (
        expenseDate.getFullYear() === new Date(selectedMonth).getFullYear() &&
        expenseDate.getMonth() === new Date(selectedMonth).getMonth()
      );
    });

    setFilteredExpenses(monthFiltered);
  }, [searchTerm, expenses, selectedMonth]);

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
    <div className="travel-expense-container">
      <Link to="/home/personalhome" className="tree-link">
                <svg className="lside-container-icon" aria-hidden="true">
                    <use xlinkHref="#icon-fanhui2">
                    </use>
                </svg>
            </Link>
      <h2>&#32;当前位置：首页&#32;&gt;&#32;报销</h2>
      <div className="travel-expense-searchsection">
        <input
          type="text"
          placeholder="搜索项目名称"
          value={searchTerm}
          className="travel-expense-searchInput"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <button className="travel-expense-addButton" onClick={() => setIsFormVisible(true)}>添加报销</button>
      </div>

      <table className="travel-expense-table">
        <thead>
          <tr>
            <th>功能</th>
            <th>项目编号</th>
            <th>项目名称</th>
            <th>金额</th>
            <th>出差时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <React.Fragment key={expense.ID}>
              <tr onClick={() => toggleExpand(expense.ID)} style={{ cursor: 'pointer' }}>
                <td>
                  <svg className="travel-expanded-icon" aria-hidden="true">
                    <use xlinkHref={expandedRows[expense.ID] ? "#icon-arrow-up-bold" : "#icon-arrow-down-bold"}></use>
                  </svg>
                </td>
                <td>{expense.ProjectCode}</td>
                <td>{expense.ProjectName}</td>
                <td>¥{expense.Amount.toFixed(2)}</td>
                <td>{formatDate(expense.BusinessTripDate)}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); handleEditExpense(expense); }}>编辑</button>
                </td>
              </tr>
              {expandedRows[expense.ID] && (
                <tr>
                  <td colSpan="6">
                    <div>地点: {expense.Location}</div>
                    <div>备注: {expense.Remarks}</div>
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

export default TravelExpense;
