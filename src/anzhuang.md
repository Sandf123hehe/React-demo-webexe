/* #region start */

/*  #endregion end */






npm install react-router-dom

use BillingApp;
CREATE TABLE AccountLogin (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- 自增长字段，初始值为 1，每次增加 1
    username NVARCHAR(50) NOT NULL,     -- 用户名，限制最大长度为 50 个字符
    password NVARCHAR(255) NOT NULL,    -- 密码，限制最大长度为 255 个字符
    login_time DATETIME NOT NULL DEFAULT GETDATE(),  -- 登录时间，默认为当前时间
    ip_address NVARCHAR(50),            -- 用户登录时的 IP 地址，长度为 50
    status NVARCHAR(20) DEFAULT 'active'  -- 状态，默认为 'active'
);


消息通知
CREATE TABLE MessageDetail (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- 自动递增的主键
    title NVARCHAR(255) NOT NULL,       -- 消息标题，最大长度 255
    time DATETIME NOT NULL,             -- 消息发布时间
    content NVARCHAR(MAX)               -- 消息内容，支持大量文本和换行
);


绩效表
CREATE TABLE Achievements (
    ID INT IDENTITY(1,1) PRIMARY KEY,          -- 自增长 ID
    ProjectCode VARCHAR(50)  NOT NULL,           -- 项目编号
    ReportNumber VARCHAR(50)  ,          -- 报告号
    ProjectName VARCHAR(255)  NOT NULL,          -- 项目名称
    ChargeAmount DECIMAL(18, 2)  ,       -- 收费金额
    ChargeDate DATE  ,               -- 收费时间
    AchievementAmount DECIMAL(18, 2)  ,  -- 绩效金额
    SignedAmount DECIMAL(18, 2)  ,       -- 签字金额
    CommissionDate DATE ,           -- 提成时间
    PerformancePerson VARCHAR(100) NULL         -- 绩效人 (可为空)
    Notes TEXT NULL                             -- 备注 (可为空)
    
);

 报销表
 CREATE TABLE TravelExpenseReimbursement (
    ID INT IDENTITY(1,1) PRIMARY KEY,  -- 自增长的唯一标识
    ProjectCode NVARCHAR(50) NOT NULL,  -- 项目编号，长度为50
    ProjectName NVARCHAR(100) NOT NULL,  -- 项目名称，长度为100
    Location NVARCHAR(100),  -- 地点，长度为100
    Amount DECIMAL(18, 2),  -- 金额，保留两位小数
    BusinessTripDate DATE,  -- 出差时间，日期类型
    ReimbursementDate DATE,  -- 报销时间，日期类型
    Remarks NVARCHAR(255),  -- 备注，长度为255
    ReimbursedBy NVARCHAR(100) NOT NULL  -- 报销人，长度为100
);


创建一个特别提示事项表
CREATE TABLE Special_Tips (
    id INT IDENTITY(1,1) PRIMARY KEY,         -- 自动递增的唯一标识符
    asset_type NVARCHAR(100) NOT NULL,         -- 资产类型，最大长度 100 字符
    tip_content NVARCHAR(255) NOT NULL,       -- 提示内容，最大长度 255 字符
    remark NVARCHAR(500) NULL                 -- 备注，最大长度 500 字符，允许为空
);

创建报告模板下载
CREATE TABLE BillingApp.dbo.Report_Template (
    id INT IDENTITY(1,1) PRIMARY KEY,         -- 自动递增的唯一标识符
    asset_type NVARCHAR(100) NOT NULL,         -- 资产类型，最大长度 100 字符
    valuation_purpose NVARCHAR(255) NOT NULL,  -- 估价目的，最大长度 255 字符
    valuation_range NVARCHAR(255) NOT NULL,    -- 估价范围，最大长度 255 字符
    valuation_method NVARCHAR(255) NOT NULL,   -- 估价方法，最大长度 255 字符
    remark NVARCHAR(500) NULL                 -- 备注，最大长度 500 字符，允许为空
);

CREATE TABLE BillingApp.dbo.ReportTemplate_Link (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- 自动递增的唯一标识符
    file_name NVARCHAR(255) NOT NULL,   -- 文件名
    share_view_link NVARCHAR(500),      -- 共享查看链接
    share_download_link NVARCHAR(500),  -- 共享下载链接
    internal_edit_link NVARCHAR(500)    -- 内部编辑链接
);


CREATE TABLE BillingApp.dbo.UsedWebsites (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- 自动递增的唯一标识符
    type NVARCHAR(100),                 -- 网站类型 (如：房地产、资产等)，长度可以根据实际需求调整
    name NVARCHAR(255),                 -- 网站名，长度可根据需要调整
    url NVARCHAR(500)                   -- 网站链接，长度可以根据需要调整
);
http://111.231.79.183:5201/api/getUsedWebsitesData

