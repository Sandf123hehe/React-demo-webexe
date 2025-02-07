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
    Whetherover BIT  -- 是否已完成，波尔类型（使用 BIT 存储，值为 0 或 1）
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

//项目派单表
CREATE TABLE BillingApp.dbo.ProjectDispatchForm (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-increment unique identifier (Primary Key)
    ProjectName NVARCHAR(255),  -- 项目名称 (Project Name)
    Branch NVARCHAR(255),  -- 支行/分院 (Branch/Division)
    OrderNumber NVARCHAR(50),  -- 委托号 (Order Number)
    ProjectSource NVARCHAR(255),  -- 项目来源 (Project Source)
    ProjectSourceContact NVARCHAR(100),  -- 项目来源联系人 (Project Source Contact Person)
    ProjectSourcePhone NVARCHAR(50),  -- 项目来源联系方式 (Project Source Contact Phone)
    Client NVARCHAR(255),  -- 委托方 (Client)
    ClientContact NVARCHAR(100),  -- 委托方联系人 (Client Contact Person)
    ClientPhone NVARCHAR(50),  -- 委托方联系方式 (Client Contact Phone)
    Applicant NVARCHAR(255),  -- 申请方 (Applicant)
    ApplicantContact NVARCHAR(100),  -- 申请方联系人 (Applicant Contact Person)
    ApplicantPhone NVARCHAR(50),  -- 申请方联系方式 (Applicant Contact Phone)
    Defendant NVARCHAR(255),  -- 被执行人 (Defendant)
    DefendantContact NVARCHAR(100),  -- 被执行人联系人 (Defendant Contact Person)
    DefendantPhone NVARCHAR(50),  -- 被执行人联系方式 (Defendant Contact Phone)
    ProjectType NVARCHAR(100),  -- 项目类型 (Project Type)
    EvaluationPurpose NVARCHAR(255),  -- 评估目的 (Evaluation Purpose)
    PersonInCharge NVARCHAR(100),  -- 负责人 (Person in Charge)
    EntrustDate DATE,  -- 委托日期 (Entrustment Date)
    DispatchDate DATE  -- 派单日期 (Dispatch Date)
);
//报告编号管理表
CREATE TABLE BillingApp.dbo.ReportNumberTable (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-increment unique identifier (Primary Key)
    asset_region NVARCHAR(255),         -- 资产区域 (Asset Region)
    report_type NVARCHAR(255),          -- 报告类型 (Report Type)
    total_assessment_value DECIMAL(18,2), -- 评估总价 (Total Assessment Value)
    asset_usage NVARCHAR(255),          -- 资产用途 (Asset Usage)
    unit_assessment_price DECIMAL(18,2), -- 评估单价 (Unit Assessment Price)
    assessment_area DECIMAL(18,2),      -- 评估面积 (Assessment Area)
    report_count INT,                   -- 报告份数 (Report Count)
    issue_date DATE,                    -- 出具日期 (Issue Date)
    report_number NVARCHAR(255),        -- 报告编号 (Report Number)
    remarks NVARCHAR(500)               -- 备注 (Remarks)
);

//项目收费情况
CREATE TABLE BillingApp.dbo.AssessprojectfeesTable (
    id INT IDENTITY(1,1) PRIMARY KEY,  -- 自动递增的唯一标识符（主键）
    project_id NVARCHAR(50) NOT NULL,  -- 项目编号，最大长度 50，不能为空
    fee_amount DECIMAL(18, 2) NOT NULL,  -- 收费金额，最多 18 位数字，2 位小数，不能为空
    fee_date DATETIME NOT NULL,  -- 收费时间，日期时间格式，不能为空
    fee_type NVARCHAR(20) NOT NULL,  -- 收费类型，取值可以是“预付款”或“尾款”，不能为空
    remarks NVARCHAR(255) NULL  -- 备注，最大长度 255，可以为空
);

//评估工作日志

CREATE TABLE BillingApp.dbo.EvaluateworklogTable (
    id INT IDENTITY(1,1) PRIMARY KEY,   -- 自动递增的唯一标识符（主键）
    project_id NVARCHAR(50) NOT NULL,  -- 项目编号，最大长度 50，不能为空
    communication_record NVARCHAR(MAX),  -- 沟通记录
    contact_time DATE,  -- 联系时间
);


//机器设备价格查询
CREATE TABLE BillingApp.dbo.MachineryEquipmentPricesTable (
    id INT IDENTITY(1,1) PRIMARY KEY,   -- 自动递增的唯一标识符（主键）
    name NVARCHAR(100) NOT NULL,         -- 设备名称，字符串类型，最大长度为100
    model NVARCHAR(100) NOT NULL,        -- 规格型号，字符串类型，最大长度为100
    manufacturer NVARCHAR(100) NOT NULL, -- 品牌，字符串类型，最大长度为100
    unit NVARCHAR(50) NOT NULL,          -- 单位，字符串类型，最大长度为50
    price DECIMAL(18, 2) NOT NULL        -- 价格，数值类型，保留两位小数
);

//运动记录表
CREATE TABLE BillingApp.dbo.SportsRecordingTable (
    id INT IDENTITY(1,1) PRIMARY KEY,   -- 自动递增的唯一标识符（主键）
    sport_type VARCHAR(50), --运动类型（跑步、深蹲、跳绳、引体向上 、平板撑、羽毛球、俯卧撑、瑜伽）
    unit VARCHAR(20), --计量单位（个，组，米）
    quantity INT, --数量
    date DATE, --日期比如（2025-05-06）
    duration TIME(0), --（时间运动消耗时间，格式为：时：分：秒）
    participant VARCHAR(100), --（运动人员，李中敬、陈彦羽）
    remark NVARCHAR(500) 
);
sport_type：运动类型字段，存储例如 "跑步"、"深蹲" 等运动名称。
unit：计量单位字段，存储单位，如 "个"、"组" 或 "米"。
quantity：数量字段，存储运动的数量，比如跑步的距离，深蹲的次数等。
date：日期字段，存储运动记录的日期。
duration：时间字段，存储运动时长，格式为时：分：秒。
participant：运动人员字段，存储参与运动的人员名字。


http://111.231.79.183:5201/api/getUsedWebsitesData

