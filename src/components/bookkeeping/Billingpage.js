import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./Billingpage.css";

// Modal 组件
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="billingpage-modal-overlay">
      <div className="billingpage-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

// Record 组件
const Record = ({ record, onEdit }) => {
  return (
    <div className="record-item" onClick={() => onEdit(record)}>
      <div className="record-info">
        <span className="record-category">{record.category}</span>
        <span className="record-subcategory">{record.subcategory}</span>
        <span className="record-amount">¥{record.amount.toFixed(2)}</span>
        <span className="record-person">{record.person}</span>
      </div>
    </div>
  );
};

// RecordForm 组件
const RecordForm = ({ record, onSave, onCancel, onDelete, people, categories }) => {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [person, setPerson] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (record) {
      setCategory(record.category);
      setSubcategory(record.subcategory);
      setAmount(record.amount);
      setDate(formatDate(record.date));
      setPerson(record.person);
    } else {
      setCategory("");
      setSubcategory("");
      setAmount("");
      setDate("");
      setPerson("");
    }
  }, [record]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !subcategory || !amount || !date || !person) {
      alert("请填写完整的记录！");
      return;
    }
    onSave({ category, subcategory, amount: parseFloat(amount), date, person });
  };

  const handleDelete = () => {
    if (record) {
      onDelete(record.id);
    }
  };

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <div>
        <label>类别：</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">请选择类别</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label>日期：</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>人员：</label>
        <select value={person} onChange={(e) => setPerson(e.target.value)} required>
          <option value="">请选择人员</option>
          {people.map((personName) => (
            <option key={personName} value={personName}>
              {personName}
            </option>
          ))}
        </select>
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
        <label>备注：</label>
        <input
          type="text"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">保存</button>
        <button type="button" onClick={onCancel}>取消</button>
        {record && <button type="button" onClick={handleDelete}>删除</button>}
      </div>
    </form>
  );
};

// Billingpage 组件
function Billingpage() {
  const { username } = useContext(AuthContext); // 获取用户名
  const [records, setRecords] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [dateSummary, setDateSummary] = useState({});
  const [filteredRecords, setFilteredRecords] = useState([]);
  const navigate = useNavigate();  // 用于页面跳转的 hook
  //权限不够跳转出去
  const [showAlert, setShowAlert] = useState(false);  // 控制提示显示
  useEffect(() => {
    if (username !== '陈彦羽' && username !== '李中敬') {
      setShowAlert(true);  // 显示权限不足提示
      // 延迟跳转，这样用户有时间看到提示
      setTimeout(() => {
        navigate('/');  // 跳转到首页
      }, 2000);  // 延迟2秒跳转
    }
  }, [username, navigate]);



  const people = ["李中敬", "陈彦羽"];
  const categories = ["购物", "娱乐", "交通", "餐饮", "医疗", "宠物"];

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://111.231.79.183:5201/api/getRecords");
      setRecords(response.data);
    } catch (error) {
      console.error("获取记录失败:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const calculateDateSummary = (records) => {
    const summary = records.reduce((acc, record) => {
      const date = new Date(record.date).toISOString().slice(0, 10);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});

    for (const date in summary) {
      summary[date].sort((a, b) => b.id - a.id);
    }

    return summary;
  };

  useEffect(() => {
    const initialDateSummary = calculateDateSummary(records);
    setDateSummary(initialDateSummary);
  }, [records]);

  useEffect(() => {
    const filtered = records.filter(record => {
      const recordMonth = new Date(record.date).toISOString().slice(0, 7);
      return recordMonth === selectedMonth;
    });
    setFilteredRecords(filtered);
    
    const updatedDateSummary = calculateDateSummary(filtered);
    setDateSummary(updatedDateSummary);
  }, [selectedMonth, records]);

  const personSummary = filteredRecords.reduce((summary, record) => {
    if (!summary[record.person]) {
      summary[record.person] = 0;
    }
    summary[record.person] += record.amount;
    return summary;
  }, {});

  const categorySummary = filteredRecords.reduce((summary, record) => {
    if (!summary[record.category]) {
      summary[record.category] = 0;
    }
    summary[record.category] += record.amount;
    return summary;
  }, {});

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setIsFormVisible(true);
  };

  const handleDeleteRecord = async (id) => {
    try {
      await axios.delete(`http://111.231.79.183:5201/api/deleteRecord/${id}`);
      setRecords(records.filter((record) => record.id !== id));
      setIsFormVisible(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("删除记录失败:", error);
    }
  };

  const handleSaveRecord = async (newRecord) => {
    try {
      let updatedRecords;
      if (editingRecord) {
        await axios.put(`http://111.231.79.183:5201/api/updateRecord/${editingRecord.id}`, newRecord);
        updatedRecords = records.map((record) =>
          (record.id === editingRecord.id ? { ...record, ...newRecord } : record)
        );
      } else {
        const response = await axios.post("http://111.231.79.183:5201/api/addRecord", newRecord);
        updatedRecords = [...records, { ...newRecord, id: response.data.id }];
      }

      updatedRecords.sort((a, b) => b.id - a.id);
      setRecords(updatedRecords);
      const updatedDateSummary = calculateDateSummary(updatedRecords);
      setDateSummary(updatedDateSummary);
      setIsFormVisible(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("保存记录失败:", error);
    }
  };

  return (
    <div className="billingpage-container">
      {/* 如果权限不足，显示全屏遮罩和提示信息 */}
      {showAlert && (
        <div className="billingpage-overlay">
          <div className="billingpage-alert">
            权限不足，正在跳转到首页...
          </div>
        </div>
      )}
      <div className="header-outer">
        <div className="category-summary">
          {Object.entries(categorySummary).map(([category, total]) => (
            <div key={category} className="category-item">
              <strong>{category}：</strong> ¥{total.toFixed(2)}
            </div>
          ))}
        </div>
        <div className="person-summary">
          {Object.entries(personSummary).map(([person, total]) => (
            <div key={person} className="person-item">
              <strong>{person}：</strong> ¥{total.toFixed(2)}
            </div>
          ))}
        </div>
        <div className="billingpage-header-container">
          <div className="month-select-container">
            <label htmlFor="month-select">时间:</label>
            <input
              type="month"
              id="month-select"
              className="month-input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
          <div className="button-container">
            <button onClick={() => setIsFormVisible(true)}>+</button>
          </div>
        </div>
      </div>
      <div className="date-summary">
        {Object.entries(dateSummary).length === 0 ? (
          <h3>没有记录</h3>
        ) : (
          Object.entries(dateSummary)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, records]) => {
              const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);

              return (
                <div key={date} className="date-total">
                  <h3>{date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支出: ¥{totalAmount.toFixed(2)}</h3>
                  {records
                    .sort((a, b) => b.id - a.id)
                    .map((record) => (
                      <Record
                        key={record.id}
                        record={record}
                        onEdit={handleEditRecord}
                      />
                    ))}
                </div>
              );
            })
        )}
      </div>

      {/* 模态框 */}
      <Modal isOpen={isFormVisible} onClose={() => setIsFormVisible(false)}>
        <RecordForm
          record={editingRecord}
          onSave={handleSaveRecord}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingRecord(null);
          }}
          onDelete={handleDeleteRecord}
          people={people}
          categories={categories}
        />
      </Modal>
    </div>
  );
}

export default Billingpage;
