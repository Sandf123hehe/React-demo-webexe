import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
const iconSpendingdetails = {
  购物: "#icon-a-gouwugouwudai",
  娱乐: "#icon-yule3",
  交通: "#icon-jiaotong1",
  餐饮: "#icon-_xican",
  医疗: "#icon-yiliaofuwu",
  宠物: "#icon-chongwuyiyiyuan1",
};

const Record = ({ record, onEdit, selectedPerson }) => {
  const iconHref = iconSpendingdetails[record.category] || "#icon-default"; // 默认图标

  return (
    <div className="record-item" onClick={() => onEdit(record)}>
      <div className="record-info">
        <span className="record-category">
          <svg className="billingpage-container-icon" aria-hidden="true">
            <use xlinkHref={iconHref} />
          </svg>
        </span>
        <span className="record-subcategory">{record.subcategory}</span>
        <span className="record-amount">¥{record.amount.toFixed(2)}</span>

        {selectedPerson !== record.person && (
          <span className="record-person">{record.person}</span>
        )}
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
      <div className="record-form-add-div">
        <label>类别：</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">请选择类别</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="record-form-add-div">
        <label>日期：</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="record-form-add-div">
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
      <div className="record-form-add-div">
        <label>金额：</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="record-form-add-div">
        <label>备注：</label>
        <input
          type="text"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">
          <svg className="billingpage-container-icon" aria-hidden="true">
            <use xlinkHref="#icon-yishenhe1" />
          </svg>
        </button>
        {record &&
          <button type="button" onClick={handleDelete}>
            <svg className="billingpage-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-shanchu7" />
            </svg>
          </button>}
        <button type="button" onClick={onCancel}>
          <svg className="billingpage-container-icon" aria-hidden="true">
            <use xlinkHref="#icon-back" />
          </svg>
        </button>
      </div>
    </form>
  );
};

// 新增 DetailsModal 组件
const DetailsModal = ({
  isOpen,
  onClose,
  personSummary,
  selectedMonth,
  setSelectedMonth,
  onSelectPerson,
  people,
  setDateRange,
  selectedPerson // 接收 selectedPerson
}) => {
  if (!isOpen) return null;

  const handlePersonChange = (e) => {
    const selectedValue = e.target.value;
    onSelectPerson(selectedValue); // 更新 Billingpage 中的 selectedPerson
  };

  const handleStartDateChange = (e) => {
    setDateRange((prev) => ({ ...prev, startDate: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    setDateRange((prev) => ({ ...prev, endDate: e.target.value }));
  };

  // 计算所有人员的总和
  const totalAmount = Object.values(personSummary).reduce((sum, total) => sum + total, 0).toFixed(2);

  // 使用传递的 selectedPerson
  const currentSelectedPerson = Object.keys(personSummary).find(person => person === selectedPerson) || "";

  return (
    <div className="billingpage-modal-overlay">
      <div className="billingpage-modal-content">
        <div className="billingpage-modal-overlayclose-buttoncontainer">
          <button className="billingpage-modal-overlayclose-button" onClick={onClose}>×</button>
        </div>

        <div className="person-summary">
          <div className="person-summary-peopleselect">
            <label className="person-summary-peopleselect-label" htmlFor="person-select">
              <svg className="billingpage-container-icon-DetailsModal" aria-hidden="true">
                <use xlinkHref="#icon-yonghu" />
              </svg>:
            </label>
            <select className="person-summary-peopleselect-option" id="person-select" onChange={handlePersonChange}>
              <option value="">所有人</option>
              {people.map((personName) => (
                <option key={personName} value={personName}>
                  {personName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="month-select-container">
          <div className="month-select-container-time">
            <label className="person-summary-peopleselect-label" htmlFor="start-date">
              <svg className="billingpage-container-icon-DetailsModal" aria-hidden="true">
                <use xlinkHref="#icon-ribao" />
              </svg>：
            </label>
            <input className="billingpage-modal-month-select"
              type="date"
              id="start-date"
              onChange={handleStartDateChange}
            />
          </div>
          <div className="month-select-container-time">
            <label className="person-summary-peopleselect-label" htmlFor="end-date">
              <svg className="billingpage-container-icon-DetailsModal" aria-hidden="true">
                <use xlinkHref="#icon-jieshuriqi1" />
              </svg>：
            </label>
            <input className="billingpage-modal-month-select"
              type="date"
              id="end-date"
              onChange={handleEndDateChange}
            />
          </div>
          {/* 显示所有人的总和 */}
          <div className="total-summary">
            <strong><svg className="billingpage-container-icon-DetailsModal" aria-hidden="true">
              <use xlinkHref="#icon-geshu" />
            </svg>：</strong> ¥{totalAmount}
          </div>
          {/* 根据选择的人员显示金额总和 */}
          {currentSelectedPerson ? (
            <div className="person-item">
              <strong>
                <svg className="billingpage-container-icon-DetailsModal" aria-hidden="true">
                  <use xlinkHref="#icon-shichangjia2" />
                </svg>
                ：</strong> ¥{personSummary[currentSelectedPerson]?.toFixed(2) || '0.00'}
            </div>
          ) : (
            Object.entries(personSummary).map(([person, total]) => (
              <div key={person} className="person-item">
                <strong>{person}：</strong> ¥{total.toFixed(2)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Billingpage 组件
function Billingpage() {
  const { username } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [dateSummary, setDateSummary] = useState({});
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(username); // 默认选中当前用户

  useEffect(() => {
    if (!['陈彦羽', '李中敬', '李娟', '李从尧', '吴世清'].includes(username)) {
      setShowAlert(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [username, navigate]);

  const people = ["李中敬", "陈彦羽", "李娟", "李从尧", "吴世清"];
  const categories = ["购物", "娱乐", "交通", "餐饮", "医疗", "宠物"];
  const categoryIcons = {
    购物: "#icon-a-gouwugouwudai",
    娱乐: "#icon-yule3",
    交通: "#icon-jiaotong1",
    餐饮: "#icon-_xican",
    医疗: "#icon-yiliaofuwu",
    宠物: "#icon-chongwuyiyuan1",
  };

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  const filteredPersonRecords = selectedPerson
    ? filteredRecords.filter(record => record.person === selectedPerson)
    : filteredRecords;

  // 处理日期范围过滤
  useEffect(() => {
    const filtered = records.filter(record => {
      const recordDate = new Date(record.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);

      return (
        (!dateRange.startDate || recordDate >= startDate) &&
        (!dateRange.endDate || recordDate <= endDate)
      );
    });
    setFilteredRecords(filtered);
  }, [dateRange, records]);

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
  };

  return (
    <div className="billingpage-container">
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
            <div key={category} className="category-item" onClick={() => handleCategoryClick(category)}>
              <svg className="billingpage-container-icon" aria-hidden="true">
                <use xlinkHref={categoryIcons[category]} />
              </svg>
              <span className="category-total">¥{total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="date-summary">
        {filteredPersonRecords.length === 0 ? (
          <h3>没有记录</h3>
        ) : (
          Object.entries(calculateDateSummary(filteredPersonRecords))
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, records]) => {
              const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);

              return (
                <div key={date} className="date-total">
                  <div className="daydetailssummary-container">
                    <h3>{date}</h3>
                    <h4>¥:{totalAmount.toFixed(2)}</h4>
                  </div>

                  {records
                    .sort((a, b) => b.id - a.id)
                    .map((record) => (
                      <Record
                        key={record.id}
                        record={record}
                        onEdit={handleEditRecord}
                        selectedPerson={selectedPerson} // 传递 selectedPerson
                      />
                    ))}
                </div>
              );
            })
        )}

      </div>

      <div className="billingpage-container-footercontainer">
        <div className="button-container">
          <li className="billingpage-footercontainer-li">
            <Link to="/home/realestate" className="billingpage-link">
              <svg className="billingpage-container-icon" aria-hidden="true">
                <use xlinkHref="#icon-zhuzhai" />
              </svg>
            </Link>
          </li>
          <button className="billingpage-addbutton" onClick={() => setIsFormVisible(true)}>
            <svg className="billingpage-container-icon-addbutton" aria-hidden="true">
              <use xlinkHref="#icon-biaoqing" />
            </svg>
          </button>
          <button className="billingpage-addbutton" onClick={() => setIsDetailsModalOpen(true)}>
            <svg className="billingpage-container-icon-saixuanbutton" aria-hidden="true">
              <use xlinkHref="#icon-saixuan" />
            </svg>
          </button>
        </div>
      </div>

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

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        personSummary={personSummary}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onSelectPerson={handleSelectPerson} // 传递选择人员的函数
        people={people} // 传递人员列表
        setDateRange={setDateRange} // 传递设置日期范围的函数
        selectedPerson={selectedPerson} // 传递当前选择的人员
      />

    </div>
  );
}

export default Billingpage;
