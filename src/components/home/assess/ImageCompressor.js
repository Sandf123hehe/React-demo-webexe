import React, { useState } from "react";
import "./ImageCompressor.css";

const ImageCompressor = () => {
  const [files, setFiles] = useState([]); // 存储选中的图片文件
  const [compressedFiles, setCompressedFiles] = useState([]); // 存储压缩后的图片
  const [message, setMessage] = useState(""); // 提示信息
  const [compressionQuality, setCompressionQuality] = useState(90); // 默认压缩质量为 90%
  const [previewImage, setPreviewImage] = useState(null); // 存储预览大图
  const [originalSize, setOriginalSize] = useState(0); // 存储原始图片大小
  const [showUploadArea, setShowUploadArea] = useState(true); // 控制上传区域的显示

  // 处理文件选择
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // 将文件列表转换为数组
    if (selectedFiles.length > 30) {
      setMessage("一次最多只能上传 30 张图片");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setMessage("");
  };

  // 处理拖放上传
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 30) {
      setMessage("一次最多只能上传 30 张图片");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    setMessage("");
  };

  // 阻止默认拖放行为
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 处理压缩质量选择
  const handleQualityChange = (e) => {
    const quality = parseInt(e.target.value, 10);
    setCompressionQuality(quality);
  };

  // 压缩图片
  const compressImage = (file, maxSize, quality) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 设置 canvas 尺寸为图片尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 将图片绘制到 canvas 上
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 压缩图片
        let currentQuality = quality / 100; // 将百分比转换为小数
        let compressedBlob = null;

        const compress = () => {
          canvas.toBlob(
            (blob) => {
              if (blob.size <= maxSize) {
                // 如果图片大小符合要求
                compressedBlob = blob;
                resolve(compressedBlob);
              } else if (currentQuality > 0.1) {
                // 如果图片大小超过限制，降低质量继续压缩
                currentQuality -= 0.1;
                canvas.toBlob(
                  (blob) => compress(),
                  "image/jpeg",
                  currentQuality
                );
              } else {
                // 如果质量已经降到最低，仍然无法压缩到目标大小
                reject(new Error("无法将图片压缩到 200KB 以内"));
              }
            },
            "image/jpeg",
            currentQuality
          );
        };

        compress();
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  // 处理压缩按钮点击
  const handleCompress = async () => {
    if (files.length === 0) {
      setMessage("请先选择图片");
      return;
    }

    setMessage("正在压缩图片...");
    setShowUploadArea(false); // 隐藏上传区域

    try {
      const compressedResults = [];
      for (const file of files) {
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
          if (file.size > 100 * 1024 * 1024) {
            setMessage("会员最大支持 100M 的图片");
            return;
          }
          const compressedBlob = await compressImage(file, 200 * 1024, compressionQuality); // 压缩到 200KB
          compressedResults.push({
            name: file.name,
            url: URL.createObjectURL(compressedBlob),
            originalSize: file.size,
            compressedSize: compressedBlob.size,
          });
        } else {
          setMessage("只支持 JPG 格式的图片");
          return;
        }
      }

      setCompressedFiles(compressedResults);
      setMessage("压缩完成，点击下载");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // 下载压缩后的图片
  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed_${name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 预览大图
  const handlePreview = (url, originalSize) => {
    setPreviewImage(url);
    setOriginalSize(originalSize);
  };

  // 关闭预览
  const handleClosePreview = () => {
    setPreviewImage(null);
    setOriginalSize(0);
  };

  // 删除某一张图片
  const handleDelete = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // 重新上传
  const handleReset = () => {
    setFiles([]);
    setCompressedFiles([]);
    setMessage("");
    setCompressionQuality(90);
    setShowUploadArea(true); // 显示上传区域
  };

  // 下载全部压缩后的图片
  const handleDownloadAll = () => {
    compressedFiles.forEach(file => {
      handleDownload(file.url, file.name);
    });
  };

  return (
    <div className="compressImage-container">
      <h1>图片压缩工具</h1>
      {showUploadArea && (
        <div
          className="compressImage-upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.querySelector(".compressImage-file-input").click()}
        >
          {files.length === 0 ? (
            <p>点击或拖放上传图片</p>
          ) : (
            <p>已选择 {files.length} 张图片</p>
          )}
          <input
            type="file"
            className="compressImage-file-input"
            multiple
            accept="image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
        </div>
      )}

      {files.length > 0 && showUploadArea && (
        <div className="compressImage-preview-upload-container">
          {files.map((file, index) => (
            <div key={index} className="compressImage-preview-upload-item">
              <img
                src={URL.createObjectURL(file)}
                alt={`预览图片 ${index + 1}`}
                onClick={() => handlePreview(URL.createObjectURL(file), file.size)}
              />
              <button onClick={() => handleDelete(index)}>删除</button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && showUploadArea && (
        <>
          <div className="compressImage-quality-selector">
            <label>压缩质量：</label>
            <input
              type="range"
              min="10"
              max="100"
              value={compressionQuality}
              onChange={handleQualityChange}
            />
            <span>{compressionQuality}%</span>
          </div>
          <button className="compressImage-preview-modal-button" onClick={handleCompress}>开始压缩图片</button>
        </>
      )}

      {message && <p className="compressImage-message">{message}</p>}

      {compressedFiles.length > 0 && (
        <div className="compressImage-preview-container">
          {compressedFiles.map((file, index) => (
            <div key={index} className="compressImage-preview-item">
              <img
                src={file.url}
                alt={`压缩后的图片 ${index + 1}`}
                onClick={() => handlePreview(file.url, file.originalSize)}
              />
              <p>原始大小: {(file.originalSize / 1024).toFixed(2)} KB</p>
              <p>压缩后大小: {(file.compressedSize / 1024).toFixed(2)} KB</p>
              <button className="compressImage-preview-modal-button" onClick={() => handleDownload(file.url, file.name)}>
                下载
              </button>
            </div>
          ))}
        </div>
      )}

      {previewImage && (
        <div className="compressImage-preview-modal">
          <div className="compressImage-preview-modal-content">
            <span className="compressImage-close" onClick={handleClosePreview}>&times;</span>
            <img src={previewImage} alt="大图预览" className="compressImage-preview-large" />
            <p>原始大小: {(originalSize / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      )}

      {compressedFiles.length > 0 && (
        <div className="compressImage-actions">
          <button className="compressImage-preview-modal-button" onClick={handleReset}>重新上传</button>
          <button className="compressImage-preview-modal-button" onClick={handleDownloadAll}>全部下载</button>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;