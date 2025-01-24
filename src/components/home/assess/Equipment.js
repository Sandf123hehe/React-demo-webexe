// pages/Equipment.js
import React, { useState } from "react";
import "./equipment.css"; // 添加样式文件

// 假设的设备数据
const equipmentData = [
  { name: "挖掘机", model: "EX2200-5", manufacturer: "小松", unit: "台", price: "800000元" },
  { name: "起重机", model: "QY70K", manufacturer: "徐工", unit: "台", price: "1000000元" },
  { name: "铲车", model: "ZL50G", manufacturer: "柳工", unit: "台", price: "350000元" },
  { name: "压路机", model: "GR215", manufacturer: "中联重科", unit: "台", price: "600000元" },
];

function Equipment() {
  const [searchTerm, setSearchTerm] = useState("");  // 存储搜索关键字
  const [filteredEquipment, setFilteredEquipment] = useState(equipmentData); // 存储过滤后的数据

  // 处理搜索输入的变化
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterEquipment(value);
  };

  // 根据搜索关键字过滤设备数据
  const filterEquipment = (term) => {
    if (!term) {
      setFilteredEquipment(equipmentData); // 如果没有搜索关键字，显示所有数据
    } else {
      const filtered = equipmentData.filter((equipment) =>
        equipment.name.toLowerCase().includes(term.toLowerCase()) ||
        equipment.model.toLowerCase().includes(term.toLowerCase()) ||
        equipment.manufacturer.toLowerCase().includes(term.toLowerCase()) ||
        equipment.unit.toLowerCase().includes(term.toLowerCase()) ||
        equipment.price.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEquipment(filtered);
    }
  };

  return (
    <div className="equipment-container">
      <header className="equipment-header">
        <h1>机器设备管理</h1>
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="搜索设备（名称、型号、厂家等）"
            className="search-input"
          />
        </div>
      </header>

      <section className="equipment-list">
        {filteredEquipment.length === 0 ? (
          <p className="no-results">没有找到相关设备。</p>
        ) : (
          <table className="equipment-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>型号</th>
                <th>厂家</th>
                <th>单位</th>
                <th>价格</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((equipment, index) => (
                <tr key={index}>
                  <td>{equipment.name}</td>
                  <td>{equipment.model}</td>
                  <td>{equipment.manufacturer}</td>
                  <td>{equipment.unit}</td>
                  <td>{equipment.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Equipment;

