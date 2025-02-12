import React, { useState, useEffect, useContext } from "react";
import "./RealEstate.css"; // 引入外部样式
import { AuthContext } from '../../../context/AuthContext'; // 导入身份验证上下文

function RealEstate() {
  const { username } = useContext(AuthContext); // 使用上下文获取用户名
  const [realEstateData, setRealEstateData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState("");

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [rentMin, setRentMin] = useState("");
  const [rentMax, setRentMax] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [propertyUsage, setPropertyUsage] = useState("");

  // 定义区域列表
  const regions = [
    "渝中区", "大渡口区", "江北区", "沙坪坝区", "九龙坡区", "南岸区", "北碚区", "綦江区", "大足区", "渝北区",
    "巴南区", "黔江区", "长寿区", "高新区", "合川区", "荣昌区", "璧山区", "梁平县", "城口县", "丰都县",
    "垫江县", "武隆区", "奉节县", "云阳县", "石柱土家族自治县", "秀山土家族苗族自治县", "酉阳土家族苗族自治县",
    "彭水苗族土家族自治县", "铜梁区", "江津区", "开州区", "沙坪区", "大足区", "两江新区", "其他区"
  ];
  // 对区域列表按首字母排序
  const sortedRegions = regions.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  const [newProperty, setNewProperty] = useState({
    location: "",
    area: "",
    market_price: "",
    market_rent: "",
    house_type: "",
    property_usage: "",
    building_area: "",
    interior_area: "",
    community_name: "",
    house_structure: "",
    construction_year: "",
    floor: "",
    base_date: "",
    remarks: ""
  });

  const [editingProperty, setEditingProperty] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchRealEstate = async () => {
    try {
      const response = await fetch('http://111.231.79.183:5201/api/getRealEstateData');
      const data = await response.json();
      const formattedData = data.RealEstate.map(item => ({
        ...item,
        base_date: item.base_date ? new Date(item.base_date).toISOString().split("T")[0] : ""
      }));
      setRealEstateData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching real estate data:', error);
    }
  };

  useEffect(() => {
    fetchRealEstate();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [propertyUsage, priceMin, priceMax, rentMin, rentMax, location, area, realEstateData]);

  const handleSearch = () => {
    const filtered = realEstateData.filter((item) => {
      const priceInRange =
        (!priceMin || item.market_price >= priceMin) && (!priceMax || item.market_price <= priceMax);
      const rentInRange =
        (!rentMin || item.market_rent >= rentMin) && (!rentMax || item.market_rent <= rentMax);
      const locationMatches = !location || item.location.includes(location);
      const areaMatches = !area || item.area.includes(area);
      const usageMatches = !propertyUsage || item.property_usage === propertyUsage;
      return priceInRange && rentInRange && locationMatches && areaMatches && usageMatches;
    });
    setFilteredData(filtered);
  };

  const handleAddProperty = async () => {
    const response = await fetch('http://111.231.79.183:5201/api/addRealEstateData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProperty),
    });

    if (response.ok) {
      setMessage("房产添加成功！");
      resetNewProperty();
      setShowAddModal(false);
      await fetchRealEstate(); // 重新获取数据
    } else {
      setMessage("房产添加失败，请重试。");
    }
  };

  const handleDeleteProperty = async (id) => {
    const response = await fetch(`http://111.231.79.183:5201/api/deleteRealEstateData/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setMessage("房产删除成功！");
      await fetchRealEstate(); // 重新获取数据
    } else {
      setMessage("房产删除失败，请重试。");
    }
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowAddModal(true);
  };

  const handleUpdateProperty = async () => {
    const response = await fetch(`http://111.231.79.183:5201/api/updateRealEstateData/${editingProperty.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingProperty),
    });

    if (response.ok) {
      setMessage("房产更新成功！");
      setEditingProperty(null);
      setShowAddModal(false);
      await fetchRealEstate(); // 重新获取数据
    } else {
      setMessage("房产更新失败，请重试。");
    }
  };

  const resetNewProperty = () => {
    setNewProperty({
      location: "",
      area: "",
      market_price: "",
      market_rent: "",
      house_type: "",
      property_usage: "",
      building_area: "",
      interior_area: "",
      community_name: "",
      house_structure: "",
      construction_year: "",
      floor: "",
      base_date: "",
      remarks: ""
    });
  };

  const handlePropertyClick = (item) => {
    if (username === "李中敬") {
      handleEditProperty(item);
    }
  };

  return (
    <div className="realEstate-container">
      {message && <div className="alert">{message}</div>} {/* 提示信息 */}
      <div className="div-RealEstate">
        <ul>
          {["住宅", "商业", "车库", "工业", "办公"].map((usage) => (
            <li key={usage}>
              <button onClick={() => setPropertyUsage(usage)}>{usage}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="div-Conditional-earch">
        <label>
          坐落：
          <input
            type="text"
            placeholder="请输入坐落"
            value={location}
            className="input-location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label>
          区域：
          <input
            type="text"
            placeholder="请输入区域"
            value={area}
            className="input-area"
            onChange={(e) => setArea(e.target.value)}
          />
        </label>
        <label>
          价格：
          <input
            type="number"
            placeholder="最小价格"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
          -
          <input
            type="number"
            placeholder="最大价格"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
        </label>
        <label>
          租金：
          <input
            type="number"
            placeholder="最小租金"
            value={rentMin}
            onChange={(e) => setRentMin(e.target.value)}
          />
          -
          <input
            type="number"
            placeholder="最大租金"
            value={rentMax}
            onChange={(e) => setRentMax(e.target.value)}
          />
        </label>
        {/* 搜索 */}
        {/* <button className="RealEstate-search-container" onClick={handleSearch}>
          <svg aria-hidden="true">
            <use xlinkHref="#icon-search"></use>
          </svg>
         
        </button> */}
      </div>

      <div className="search-h">
        {/* <h3>{username ? username : '登录'}</h3> */}
        <h3 className="search-jg">{propertyUsage ? `${propertyUsage}搜索结果:` : "搜索结果:"}</h3>
      </div>
      <div className="list-search-div">
        {filteredData.length > 0 ? (
          <ul>
            {filteredData.map((item) => (
              <li key={item.id} onClick={() => handlePropertyClick(item)}> {/* 点击搜索结果 */}
                <div className="list-search">
                  <div className="list-search-left">
                    <div className="list-search-location">
                      <div  title="坐落"> 
                        <svg className="realEstate-icon" aria-hidden="true">
                          <use xlinkHref="#icon-fangwuzuola"></use>
                        </svg>
                        {item.location}
                      </div>
                    </div>
                    <div className="first-column">
                      <div className="list-search-area">
                        <strong title="建面面积">
                          <svg className="realEstate-icon" aria-hidden="true">
                            <use xlinkHref="#icon-jianzhumianji"></use>
                          </svg>{item.building_area}㎡
                        </strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong title="套内面积">
                          <svg className="realEstate-icon" aria-hidden="true">
                            <use xlinkHref="#icon-jianzhumianji"></use>
                          </svg>{item.interior_area}㎡
                        </strong>
                      </div>
                      <div className="first-column-child">
                        <div  title="小区名称">
                          <svg className="realEstate-icon" aria-hidden="true">
                            <use xlinkHref="#icon-zaixianxuanfang"></use>
                          </svg>
                          {item.community_name}</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                        <div  title="所属区域">
                          <svg className="realEstate-icon" aria-hidden="true">
                            <use xlinkHref="#icon-quyu"></use>
                          </svg>{item.area}
                        </div>&nbsp;&nbsp;
                        <div  title="建筑类型">
                        
                          <svg className="realEstate-icon" aria-hidden="true">
                            <use xlinkHref="#icon-building"></use>
                          </svg>{item.house_type}
                        
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="list-search-center">
                    <div>
                      <svg className="realEstate-icon" aria-hidden="true">
                        <use xlinkHref="#icon-nav3-2"></use>
                      </svg>{item.market_price}元/㎡
                    </div>
                    <div>
                      <svg className="realEstate-icon" aria-hidden="true">
                        <use xlinkHref="#icon-fangwuzujin"></use>
                      </svg>{item.market_rent}元/㎡.月
                    </div>
                  </div>
                  {/* 只有李中敬可以看到编辑和删除按钮 */}
                  {/* {username === "李中敬" && ( 
                    <div className="list-search-right">
                      <button className="RealEstate-edit-container" onClick={() => handleEditProperty(item)}>
                        <svg aria-hidden="true">
                          <use xlinkHref="#icon-icon-test"></use>
                        </svg>
                        
                      </button>
                      <button className="RealEstate-edit-container" onClick={() => handleDeleteProperty(item.id)}>
                        <svg aria-hidden="true">
                          <use xlinkHref="#icon-delete"></use>
                        </svg>
                       
                      </button>
                    </div>
                  )} */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>没有符合条件的房地产。</p>
        )}
      </div>

      {/* 只有李中敬可以点击的新增按钮 */}
      {username === "李中敬" && (
        <div className="button-RealEstatecontainer">
          <button onClick={() => {
            resetNewProperty();
            setShowAddModal(true);
          }}>+</button>
        </div>
      )}

      {/* 添加或编辑房产的模态框 */}
      {showAddModal && (
        <div className="realestate-modal">
          <h3>{editingProperty ? "编辑房产" : "添加新房产"}</h3>
          <div className="realestate-modal-inputcontainer">
            <label>坐落：</label>
            <input
              type="text"
              value={editingProperty ? editingProperty.location : newProperty.location}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, location: value });
                } else {
                  setNewProperty({ ...newProperty, location: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>区域：</label>
            <select
              value={editingProperty ? editingProperty.area : newProperty.area}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, area: value });
                } else {
                  setNewProperty({ ...newProperty, area: value });
                }
              }}
            >
              <option value="">请选择区域</option>
              {sortedRegions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>建筑面积：</label>
            <input
              type="number"
              value={editingProperty ? editingProperty.building_area : newProperty.building_area}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, building_area: value });
                } else {
                  setNewProperty({ ...newProperty, building_area: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>套内面积：</label>
            <input
              type="number"
              value={editingProperty ? editingProperty.interior_area : newProperty.interior_area}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, interior_area: value });
                } else {
                  setNewProperty({ ...newProperty, interior_area: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>小区名称：</label>
            <input
              type="text"
              value={editingProperty ? editingProperty.community_name : newProperty.community_name}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, community_name: value });
                } else {
                  setNewProperty({ ...newProperty, community_name: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>房屋用途：</label>
            <select
              value={editingProperty ? editingProperty.property_usage : newProperty.property_usage}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, property_usage: value });
                } else {
                  setNewProperty({ ...newProperty, property_usage: value });
                }
              }}
            >
              <option value="">请选择</option>
              {["住宅", "商业", "车库", "工业", "办公"].map((usage) => (
                <option key={usage} value={usage}>{usage}</option>
              ))}
            </select>
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>房屋类型：</label>
            <select
              value={editingProperty ? editingProperty.house_type : newProperty.house_type}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, house_type: value });
                } else {
                  setNewProperty({ ...newProperty, house_type: value });
                }
              }}
            >
              <option value="">请选择</option>
              {["洋房", "别墅", "高层", "小高层", "超高层"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>建成年代：</label>
            <select
              value={editingProperty ? editingProperty.construction_year : newProperty.construction_year}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, construction_year: value });
                } else {
                  setNewProperty({ ...newProperty, construction_year: value });
                }
              }}
            >
              <option value="">请选择</option>
              {Array.from({ length: 26 }, (_, i) => 2000 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>市场价格：</label>
            <input
              type="number"
              value={editingProperty ? editingProperty.market_price : newProperty.market_price}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, market_price: value });
                } else {
                  setNewProperty({ ...newProperty, market_price: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>租金：</label>
            <input
              type="number"
              value={editingProperty ? editingProperty.market_rent : newProperty.market_rent}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, market_rent: value });
                } else {
                  setNewProperty({ ...newProperty, market_rent: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>房屋结构：</label>
            <select
              value={editingProperty ? editingProperty.house_structure : newProperty.house_structure}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, house_structure: value });
                } else {
                  setNewProperty({ ...newProperty, house_structure: value });
                }
              }}
            >
              <option value="">请选择</option>
              {["钢筋混凝土", "砖混", "砖木", "钢"].map((structure) => (
                <option key={structure} value={structure}>{structure}</option>
              ))}
            </select>
          </div>

          <div className="realestate-modal-inputcontainer">
            <label>楼层：</label>
            <input
              type="text"
              value={editingProperty ? editingProperty.floor : newProperty.floor}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, floor: value });
                } else {
                  setNewProperty({ ...newProperty, floor: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>基准日期：</label>
            <input
              type="date"
              value={editingProperty ? editingProperty.base_date : newProperty.base_date}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, base_date: value });
                } else {
                  setNewProperty({ ...newProperty, base_date: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <label>备注：</label>
            <input
              type="text"
              value={editingProperty ? editingProperty.remarks : newProperty.remarks}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProperty) {
                  setEditingProperty({ ...editingProperty, remarks: value });
                } else {
                  setNewProperty({ ...newProperty, remarks: value });
                }
              }}
            />
          </div>
          <div className="realestate-modal-inputcontainer">
            <button onClick={editingProperty ? handleUpdateProperty : handleAddProperty}>
              {editingProperty ? "更新" : "添加"}
            </button>
            {editingProperty && ( // 仅在编辑状态下显示删除按钮
              <button onClick={() => {
                handleDeleteProperty(editingProperty.id);
                setShowAddModal(false); // 关闭模态框
                setEditingProperty(null); // 重置编辑状态
              }}>
                删除
              </button>
            )}
            <button onClick={() => {
              setShowAddModal(false);
              setEditingProperty(null); // 关闭模态框时重置编辑状态
            }}>取消</button>
          </div>

        </div>

      )
      }
    </div >
  );
}

export default RealEstate;
