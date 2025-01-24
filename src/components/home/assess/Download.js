import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import './Download.css'; // 更新样式导入路径

const NewPage = () => {
    const [templates, setTemplates] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});
    const [templateFiles, setTemplateFiles] = useState({});
    const [reportLinks, setReportLinks] = useState({});

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get('http://111.231.79.183:5201/api/getTemplateData');
                setTemplates(response.data.Template);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTemplates();
    }, []);

    const toggleRow = async (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

        if (!expandedRows[id]) {
            try {
                const response = await axios.get(`http://111.231.79.183:5201/api/getTemplateFiles/${id}`);
                setTemplateFiles((prev) => ({
                    ...prev,
                    [id]: response.data.files,
                }));
            } catch (error) {
                console.error('Error fetching template files:', error);
            }
        }
    };

    const handleFileChange = async (templateId, fileName) => {
        const isSelected = selectedFiles[templateId]?.[fileName] || false;   
        setSelectedFiles((prev) => ({
            ...prev,
            [templateId]: {
                ...prev[templateId],
                [fileName]: !isSelected,
            },
        }));
    
        if (!isSelected) {
            try {
                //const response = await axios.get(`http://111.231.79.183:5201/api/getReportTemplate_Link/${encodeURIComponent(fileName)}`);

                 const response = await axios.get(`http://111.231.79.183:5201/api/getReportTemplate_Link/${fileName}`);
               
                console.log('Fetched links:', response.data); // 调试信息
                setReportLinks((prev) => ({
                    ...prev,
                    [fileName]: response.data[0], // 假设只取第一个结果
                }));
            } catch (error) {
                console.error('Error fetching report links:', error);
            }
        } else {
            setReportLinks((prev) => {
                const newLinks = { ...prev };
                delete newLinks[fileName];
                return newLinks;
            });
        }
    };
    
    const downloadTemplateFiles = async (templateId) => {
        const zip = new JSZip();
        const folder = zip.folder("报告模板");

        const files = Object.keys(selectedFiles[templateId] || {}).filter(file => selectedFiles[templateId][file]);

        if (files.length === 0) {
            alert("请先选择要下载的文件。");
            return;
        }

        for (const file of files) {
            try {
                const fileResponse = await axios.get(`http://111.231.79.183:5201/download/${templateId}/${file}`, { responseType: 'blob' });
                folder.file(file, fileResponse.data);
            } catch (error) {
                console.error(`Error downloading file ${file}:`, error);
            }
        }

        const content = await zip.generateAsync({ type: "blob" });
        FileSaver.saveAs(content, `${templateId}_报告模板.zip`);
    };

    return (
        <div className="download-table-container">
            <table className="download-table">
                <thead>
                    <tr>
                        <th>功能</th>
                        <th>编号</th>
                        <th>资产类型</th>
                        <th>估价目的</th>
                        <th>估价范围</th>
                        <th>估价方法</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.length > 0 ? (
                        templates.map(template => (
                            <React.Fragment key={template.id}>
                                <tr onClick={() => toggleRow(template.id)}>
                                    <td>
                                        <div style={{ cursor: 'pointer', color: 'blue' }}>
                                            {expandedRows[template.id] ? (
                                                <svg className="expanded-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-fanhui"></use>
                                                </svg>
                                            ) : (
                                                <svg className="expanded-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-jinru"></use>
                                                </svg>
                                            )}
                                        </div>
                                    </td>
                                    <td>{template.id}</td>
                                    <td>{template.asset_type}</td>
                                    <td>{template.valuation_purpose}</td>
                                    <td>{template.valuation_range}</td>
                                    <td>{template.valuation_method}</td>
                                    <td>{template.remark || '无'}</td>
                                    <td>
                                        <button
                                            onClick={() => downloadTemplateFiles(template.id)}
                                            className="download-button"
                                        >
                                            下载
                                        </button>
                                    </td>
                                </tr>
                                {expandedRows[template.id] && (
                                    <tr>
                                        <td colSpan="8">
                                            <div className="file-list">
                                                {templateFiles[template.id] && templateFiles[template.id].length > 0 ? (
                                                    templateFiles[template.id].map((file) => (
                                                        <div key={file}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFiles[template.id]?.[file] || false}
                                                                onChange={() => handleFileChange(template.id, file)}
                                                            />
                                                            {file} {/* 只显示文件名 */}
                                                            {/* 显示链接 */}
                                                            {reportLinks[file] ? ( // 使用 file 作为键来查找链接
                                                                <div>
                                                                    <a href={reportLinks[file].share_view_link} target="_blank" rel="noopener noreferrer">查看</a>
                                                                    <a href={reportLinks[file].share_download_link} target="_blank" rel="noopener noreferrer">下载</a>
                                                                    <a href={reportLinks[file].internal_edit_link} target="_blank" rel="noopener noreferrer">编辑</a>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {/* 链接未找到 */}
                                                                    </div> // 提示信息
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>没有文件可供选择</div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="download-no-data">没有可用数据</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <p className="download-table-p">欢迎下载您需要的模板！</p>
            <p className="download-table-p">如果您有任何问题或建议，请随时通过以下方式联系我们：</p>
            <p className="download-table-p">电子邮件: 471883209@qq.com</p>
            <p className="download-table-p">感谢您的访问</p>
            <p className="download-table-p">我们期待为您提供更好的服务！</p>
        </div>
    );
};

export default NewPage;
