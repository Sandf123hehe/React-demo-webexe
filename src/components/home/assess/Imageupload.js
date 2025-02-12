import React, { useState } from "react";
import axios from "axios";
import './Imageupload.css'; // 引入 CSS 文件

const ImageUpload = () => {
  const [region, setRegion] = useState(""); // 区域
  const [location, setLocation] = useState(""); // 坐落
  const [files, setFiles] = useState([]); // 选中的图片文件
  const [message, setMessage] = useState(""); // 上传结果消息

  // 处理区域输入
  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  // 处理坐落输入
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // 处理文件选择
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // 将文件列表转换为数组
    setFiles(selectedFiles);
  };

  // 删除选中的文件
  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (!region || !location) {
      setMessage("请填写区域和坐落");
      return;
    }

    if (files.length === 0) {
      setMessage("请选择至少一张图片");
      return;
    }

    // 检查文件格式和大小
    for (const file of files) {
      if (file.type !== "image/jpeg") {
        setMessage("只支持 .jpg 格式的图片");
        return;
      }
      if (file.size > 1200 * 2024) { // 更新为 200KB
        setMessage("图片大小不能超过 200KB");
        return;
      }
    }

    // 创建 FormData 对象
    const formData = new FormData();
    formData.append("region", region);
    formData.append("location", location);
    files.forEach((file) => {
      formData.append("images", file); // 将文件添加到 FormData
    });

    try {
      // 发送 POST 请求到服务器
      const response = await axios.post("http://111.231.79.183:5201/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // 设置请求头
        },
      });
      setMessage(response.data.message); // 显示上传结果
    } catch (error) {
      setMessage("上传失败：" + error.message);
    }
  };

  return (
    <div className="realEstate-imageupload-container">
      <h1>图片上传</h1>
      <div>
        <label>区域：</label>
        <input type="text" value={region} onChange={handleRegionChange} />
      </div>
      <div>
        <label>坐落：</label>
        <input type="text" value={location} onChange={handleLocationChange} />
      </div>
      <div>
        <label>选择图片：</label>
        <input type="file" multiple accept=".jpg" onChange={handleFileChange} />
      </div>
      <div className="realEstate-imageupload-preview">
        {files.map((file, index) => (
          <div key={index} className="realEstate-imageupload-preview-item">
            <img 
              src={URL.createObjectURL(file)} 
              alt={`preview-${index}`} 
              className="realEstate-imageupload-preview-image"
            />
            <button onClick={() => handleRemoveFile(index)}>删除</button>
          </div>
        ))}
      </div>
      <button onClick={handleUpload}>上传</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImageUpload;
