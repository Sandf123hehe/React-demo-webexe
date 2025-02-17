import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Imageupload.css";
import { Link } from 'react-router-dom';
const ImageUpload = () => {
  const { area, location: loc } = useParams();
  const [region, setRegion] = useState(area || "");
  const [location, setLocation] = useState(loc || "");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [hoveredImage, setHoveredImage] = useState(null); // 用于跟踪当前放大的图片
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // 控制模拟框的显示

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (!region || !location) {
      setMessage("请填写区域和坐落");
      return;
    }

    if (files.length === 0) {
      setMessage("请选择至少一张图片");
      return;
    }

    for (const file of files) {
      if (file.type !== "image/jpeg") {
        setMessage("只支持 .jpg 格式的图片");
        return;
      }
      if (file.size > 1000 * 1024) {
        setMessage("图片大小不能超过 300KB");
        return;
      }
    }

    const formData = new FormData();
    formData.append("region", region);
    formData.append("location", location);
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post("http://111.231.79.183:5201/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("上传失败：" + error.message);
    }
  };

  // 显示模拟框
  const showOverlay = (file) => {
    setHoveredImage(file);
    setIsOverlayVisible(true);
  };

  // 隐藏模拟框
  const hideOverlay = () => {
    setIsOverlayVisible(false);
    setHoveredImage(null);
  };

  return (
    <div className="realEstate-imageupload-container">
      {/* <h1 className="realEstate-imageupload-container-title">
        {location} {region}
      </h1> */}
      <div className="realEstate-imageupload-container-choose">
        {/* 文件选择按钮 */}
        <Link to="/home/imagecompressor">
          <svg className="header-container-icon" aria-hidden="true">
            <use xlinkHref="#icon-tianjiatupian1"></use>
          </svg>
        </Link>

        <label htmlFor="file-upload" className="imageupload-container-label">
          <svg className="imageupload-container-icon" aria-hidden="true">
            <use xlinkHref="#icon-ziyuan"></use>
          </svg>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".jpg"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {/* 上传按钮，没有图片时隐藏 */}
        {files.length > 0 && (
          <button
            className="imageupload-container-buttonupload"
            onClick={handleUpload}
            title="开始上传"
          >
            <svg className="imageupload-container-icon" aria-hidden="true">
              <use xlinkHref="#icon-yunduanshangchuan" />
            </svg>
          </button>
        )}
      </div>
      <div className="realEstate-imageupload-preview">
        {files.map((file, index) => (
          <div key={index} className="realEstate-imageupload-preview-item">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              className="realEstate-imageupload-preview-image"
            />
            {/* 按钮容器 */}
            <div className="realEstate-imageupload-preview-item-button">
              {/* 删除按钮 */}
              <button onClick={() => handleRemoveFile(index)}>
                <svg className="imageupload-container-icon" aria-hidden="true">
                  <use xlinkHref="#icon-delete1"></use>
                </svg>
              </button>
              {/* 放大按钮 */}
              <button onClick={() => showOverlay(file)}>
                <svg className="imageupload-container-icon" aria-hidden="true">
                  <use xlinkHref="#icon-sousuofangda"></use>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* 模拟框，点击放大按钮时显示 */}
      {isOverlayVisible && (
        <div className="realEstate-imageupload-overlay" onClick={hideOverlay}>
          <div className="realEstate-imageupload-overlay-content">
            <img
              src={URL.createObjectURL(hoveredImage)}
              alt="放大预览"
              className="realEstate-imageupload-zoomed-image"
            />
            {/* 关闭按钮 */}
            <button
              className="realEstate-imageupload-close-button"
              onClick={hideOverlay}
            >
              <svg className="imageupload-container-icon" aria-hidden="true">
                <use xlinkHref="#icon-guanbi"></use>
              </svg>
            </button>
          </div>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImageUpload;