import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../../../context/AuthContext';
import "./Achievements.css";
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
    <div className="achievement-modal-overlay">
      <div className="achievement-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

// AchievementForm 组件
const AchievementForm = ({ achievement, onSave, onCancel, onDelete }) => {
  const [projectCode, setProjectCode] = useState("");
  const [reportNumber, setReportNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeDate, setChargeDate] = useState("");
  const [achievementAmount, setAchievementAmount] = useState("");
  const [signedAmount, setSignedAmount] = useState("");
  const [commissionDate, setCommissionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [whetherticheng, setWhetherticheng] = useState(false); // 新增状态

  useEffect(() => {
    if (achievement) {
      setProjectCode(achievement.ProjectCode);
      setReportNumber(achievement.ReportNumber);
      setProjectName(achievement.ProjectName);
      setChargeAmount(achievement.ChargeAmount);
      setChargeDate(formatDate(achievement.ChargeDate)); // 格式化日期
      setAchievementAmount(achievement.AchievementAmount);
      setSignedAmount(achievement.SignedAmount);
      setCommissionDate(formatDate(achievement.CommissionDate)); // 格式化日期
      setNotes(achievement.Notes);
      setWhetherticheng(achievement.Whetherticheng || false); // 新增
    } else {
      setProjectCode("");
      setReportNumber("");
      setProjectName("");
      setChargeAmount("");
      setChargeDate("");
      setAchievementAmount("");
      setSignedAmount("");
      setCommissionDate("");
      setNotes("");
      setWhetherticheng(false); // 新增
    }
  }, [achievement]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName || !chargeAmount || !chargeDate) {
      alert("请填写完整的绩效记录！");
      return;
    }
    onSave({
      ProjectCode: projectCode,
      ReportNumber: reportNumber,
      ProjectName: projectName,
      ChargeAmount: parseFloat(chargeAmount),
      ChargeDate: chargeDate, // 保持格式 YYYY-MM-DD
      AchievementAmount: parseFloat(achievementAmount),
      SignedAmount: parseFloat(signedAmount),
      CommissionDate: commissionDate,
      Notes: notes,
      Whetherticheng: whetherticheng, // 新增
    });
  };

  const handleDelete = () => {
    if (achievement) {
      onDelete(achievement.ID);
    }
  };

  return (
    <form className="achievement-form" onSubmit={handleSubmit}>
      <div className="achievement-form-inputcontainer">
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
        <label>报告号：</label>
        <input
          type="text"
          value={reportNumber}
          onChange={(e) => setReportNumber(e.target.value)}
        />
      </div>
      <div>
        <label>收费时间：</label>
        <input
          type="date"
          value={chargeDate}
          onChange={(e) => setChargeDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>收费金额：</label>
        <input
          type="number"
          value={chargeAmount}
          onChange={(e) => setChargeAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label>绩效金额：</label>
        <input
          type="number"
          value={achievementAmount}
          onChange={(e) => setAchievementAmount(e.target.value)}
        />
      </div>
      <div>
        <label>签字金额：</label>
        <input
          type="number"
          value={signedAmount}
          onChange={(e) => setSignedAmount(e.target.value)}
        />
      </div>
      <div>
        <label>提成时间：</label>
        <input
          type="date"
          value={commissionDate}
          onChange={(e) => setCommissionDate(e.target.value)}
        />
      </div>
      <div>
        <label>提成状态：</label>
        <select
          value={whetherticheng ? '1' : '0'}
          onChange={(e) => setWhetherticheng(e.target.value === '1')}
        >
          <option value="0">未提成</option>
          <option value="1">已提成</option>
        </select>
      </div>
      <div>
        <label>备注：</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="achievements-form-actions">
        <button type="submit">保存</button>
        <button type="button" onClick={onCancel}>取消</button>
        {achievement && <button type="button" onClick={handleDelete}>删除</button>}
      </div>
    </form>
  );
}

// Achievements 组件
function Achievements() {
  const { username } = useContext(AuthContext); // 从 AuthContext 获取用户名
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  const fetchAchievements = async () => {
    try {
      const response = await axios.get('http://111.231.79.183:5201/api/getAchievementsData', {
        params: { PerformancePerson: username }
      });

      const achievementsData = response.data.Achievements;
      const filteredData = achievementsData.filter(item => item.PerformancePerson === username);

      const sortedAchievements = filteredData.sort((a, b) => {
        const dateA = new Date(a.ChargeDate);
        const dateB = new Date(b.ChargeDate);
        return dateB - dateA;
      });

      setAchievements(sortedAchievements);
      setFilteredAchievements(sortedAchievements);

    } catch (error) {
      console.error("获取绩效记录失败:", error);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    const filtered = achievements.filter((achievement) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesProjectName = achievement.ProjectName && achievement.ProjectName.toLowerCase().includes(lowerSearchTerm);
      const matchesChargeAmount = achievement.ChargeAmount && achievement.ChargeAmount.toString().includes(lowerSearchTerm);
      const matchesProjectCode = achievement.ProjectCode && achievement.ProjectCode.toLowerCase().includes(lowerSearchTerm);

      // 日期筛选
      const matchesMonth = selectedMonth ? achievement.ChargeDate.startsWith(selectedMonth) : true;

      return (matchesProjectName || matchesChargeAmount || matchesProjectCode) && matchesMonth;
    });

    setFilteredAchievements(filtered);
  }, [searchTerm, achievements, selectedMonth]);

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setIsFormVisible(true);
  };

  const handleDeleteAchievement = async (id) => {
    try {
      await axios.delete(`http://111.231.79.183:5201/api/deleteAchievement/${id}`);
      setAchievements(achievements.filter((ach) => ach.ID !== id));
      setIsFormVisible(false);
      setEditingAchievement(null);
    } catch (error) {
      console.error("删除绩效记录失败:", error);
    }
  };

  const handleSaveAchievement = async (newAchievement) => {
    try {
      if (editingAchievement) {
        // 更新现有记录
        await axios.put(`http://111.231.79.183:5201/api/updateAchievement/${editingAchievement.ID}`, {
          ...newAchievement,
          PerformancePerson: username
        });
      } else {
        // 添加新记录
        await axios.post(`http://111.231.79.183:5201/api/addAchievement`, {
          ...newAchievement,
          PerformancePerson: username,
        });
      }

      // 重新获取数据
      await fetchAchievements(); // 重新获取数据

      // 关闭模态框
      setIsFormVisible(false);
      setEditingAchievement(null);
    } catch (error) {
      console.error("保存绩效记录失败:", error.response ? error.response.data : error.message);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="achievements-container">
      <Link to="/home/personalhome" className="tree-link">
        <svg className="lside-container-icon" aria-hidden="true">
          <use xlinkHref="#icon-fanhui2">
          </use>
        </svg>
      </Link>
      <h2 className="icon-container">
        <svg className="icon-address" aria-hidden="true">
          <use xlinkHref="#icon-address"></use>
        </svg>
        &#32;当前位置：首页&#32;&gt;&#32;绩效
      </h2>

      <div className="achievements-searchsection">
        <input
          type="text"
          placeholder="搜索项目名称"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="achievements-searchInput"
        />
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="achievements-monthSelect"
        />
        <button
          className="achievements-addButton"
          onClick={() => setIsFormVisible(true)}
        >
          添加绩效
        </button>
      </div>

      <table className="achievements-table">
        <thead>
          <tr>
            <th>功能</th>
            <th>项目号</th>
            <th>项目名称</th>
            <th>收费金额</th>
            <th>收费时间</th>
            <th>提成状态</th>
            {/* <th>操作</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredAchievements.map((achievement) => (
            <React.Fragment key={achievement.ID}>
              <tr onClick={() => toggleRow(achievement.ID)}>
                <td>{expandedRows[achievement.ID] ? (
                  <svg className="achievement-expanded-icon" aria-hidden="true">
                    <use xlinkHref="#icon-arrow-up-bold"></use>
                  </svg>
                ) : (
                  <svg className="achievement-expanded-icon" aria-hidden="true">
                    <use xlinkHref="#icon-arrow-down-bold"></use>
                  </svg>
                )}</td>
                <td>{achievement.ProjectCode}</td>
                <td>{achievement.ProjectName}</td>
                <td>¥{achievement.ChargeAmount.toFixed(2)}</td>
                <td>{formatDate(achievement.ChargeDate)}</td>
                <td style={{ color: achievement.Whetherticheng ? 'black' : 'red' }}>
                  {achievement.Whetherticheng ? '已提成' : '未提成'}
                </td>

                {/* <td>
                  <button onClick={() => handleEditAchievement(achievement)}>编辑</button>
                  <button onClick={() => handleDeleteAchievement(achievement.ID)}>删除</button>
                </td> */}
              </tr>
              {expandedRows[achievement.ID] && (
                <tr className="achievement-detail-row">
                  <td colSpan="6">
                    <div>

                      <strong>绩效金额:</strong> ¥{achievement.AchievementAmount ? achievement.AchievementAmount.toFixed(2) : '未提供'}<br />
                      <strong>签字金额:</strong> ¥{achievement.SignedAmount ? achievement.SignedAmount.toFixed(2) : '未提供'}<br />
                      <strong>提成时间:</strong> {formatDate(achievement.CommissionDate)}<br />
                      <strong>备注:</strong> {achievement.Notes}
                      <button onClick={() => handleEditAchievement(achievement)}>编辑</button>
                      <button onClick={() => handleDeleteAchievement(achievement.ID)}>删除</button>

                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isFormVisible} onClose={() => setIsFormVisible(false)}>
        <AchievementForm
          achievement={editingAchievement}
          onSave={handleSaveAchievement}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingAchievement(null);
          }}
          onDelete={handleDeleteAchievement}
        />
      </Modal>
    </div>
  );
}

export default Achievements;
