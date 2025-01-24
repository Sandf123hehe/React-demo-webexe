import React, { useState, useEffect } from "react";
import "./buildings.css"; // 添加样式文件

function Buildings() {
  const [searchTerm, setSearchTerm] = useState("");  // 存储搜索关键字
  const [filteredBuildings, setFilteredBuildings] = useState([]); // 存储过滤后的数据
  const [allBuildings, setAllBuildings] = useState([]); // 存储所有构筑物数据
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态框显示
  const [editBuilding, setEditBuilding] = useState(null); // 存储正在编辑的构筑物数据

  // 获取构筑物数据
  useEffect(() => {
    async function fetchBuildings() {
      try {
        const response = await fetch('http://111.231.79.183:5201/api/getStructuresData');
        if (!response.ok) {
          throw new Error('网络请求失败');
        }
        const data = await response.json();
        setAllBuildings(data.Structures);
        setFilteredBuildings(data.Structures);
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    }

    fetchBuildings();
  }, []);

  // 处理搜索输入的变化
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterBuildings(value);
  };

  // 根据搜索关键字过滤构筑物数据
  const filterBuildings = (term) => {
    if (!term) {
      setFilteredBuildings(allBuildings);
    } else {
      const filtered = allBuildings.filter((building) =>
        building.name.toLowerCase().includes(term.toLowerCase()) ||
        building.structure.toLowerCase().includes(term.toLowerCase()) ||
        building.area.toLowerCase().includes(term.toLowerCase()) ||
        building.unit.toLowerCase().includes(term.toLowerCase()) ||
        building.price.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBuildings(filtered);
    }
  };

  // 打开编辑模态框
  const handleEditClick = (building) => {
    setEditBuilding(building); // 设置正在编辑的构筑物数据
    setIsModalOpen(true); // 打开模态框
  };

  // 处理表单提交
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const updatedBuilding = {
      name: formData.get('name'),
      structure: formData.get('structure'),
      area: formData.get('area'),
      unit: formData.get('unit'),
      price: formData.get('price'),
    };

    try {
      if (editBuilding) {
        // 更新现有构筑物
        const response = await fetch(`http://111.231.79.183:5201/api/updateStructure/${editBuilding.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBuilding),
        });

        if (response.ok) {
          alert('构筑物更新成功');
          // 更新本地状态
          setAllBuildings(allBuildings.map(b => (b.id === editBuilding.id ? updatedBuilding : b)));
          setFilteredBuildings(allBuildings.map(b => (b.id === editBuilding.id ? updatedBuilding : b)));
        }
      } else {
        // 新增构筑物
        const response = await fetch('http://111.231.79.183:5201/api/addStructure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBuilding),
        });

        if (response.ok) {
          alert('构筑物新增成功');
          const newBuilding = await response.json();
          setAllBuildings([...allBuildings, newBuilding]);
          setFilteredBuildings([...filteredBuildings, newBuilding]);
        }
      }
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
    setEditBuilding(null);
  };

  return (
    <div className="buildings-container">
      <header className="buildings-header">
        <h1>构筑物管理</h1>
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="搜索构筑物（名称、结构、区域等）"
            className="search-input"
          />
          <button className="add-button" onClick={() => setIsModalOpen(true)}>新增构筑物</button>
        </div>

      </header>

      <section className="buildings-list">
        {filteredBuildings.length === 0 ? (
          <p className="no-results">没有找到相关构筑物。</p>
        ) : (
          <table className="buildings-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>结构</th>
                <th>区域</th>
                <th>单位</th>
                <th>单价</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuildings.map((building, index) => (
                <tr key={index}>
                  <td>{building.name}</td>
                  <td>{building.structure}</td>
                  <td>{building.area}</td>
                  <td>{building.unit}</td>
                  <td>{building.price}</td>
                  <td>
                    <button  className="building-edit-container"  onClick={() => handleEditClick(building)}>
                      <svg className="icon-bianji" aria-hidden="true">
                        <use xlinkHref="#icon-bianji"></use>
                      </svg>
                      {/* 编辑 */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {isModalOpen && (
        <div className="buildings-modal">
          <div className="modal-content">
            <h2>{editBuilding ? '编辑构筑物' : '新增构筑物'}</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                名称:
                <input type="text" name="name" defaultValue={editBuilding?.name || ''} required />
              </label>
              <label>
                结构:
                <input type="text" name="structure" defaultValue={editBuilding?.structure || ''} required />
              </label>
              <label>
                区域:
                <input type="text" name="area" defaultValue={editBuilding?.area || ''} required />
              </label>
              <label>
                单位:
                <input type="text" name="unit" defaultValue={editBuilding?.unit || ''} required />
              </label>
              <label>
                单价:
                <input type="text" name="price" defaultValue={editBuilding?.price || ''} required />
              </label>
              <div className="modal-actions">
                <button type="submit">保存</button>
                <button type="button" onClick={closeModal}>关闭</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Buildings;
