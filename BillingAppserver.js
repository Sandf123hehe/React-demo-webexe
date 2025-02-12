const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const app = express();
const port = 5201;
//下载
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

//图片上传
//const express = require("express");
const multer = require("multer");
//const fs = require("fs");
//const path = require("path");


app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// SQL Server 配置
const firstconfig = {
    user: 'sa',
    password: 'Alan944926',
    server: '111.231.79.183',
    database: 'BillingApp',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// 根路径处理
app.get('/', (req, res) => {
    res.send('API is running...');
});

// 获取 Records 表数据
app.get('/api/getRecords', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let RecordsResult = await firstpool.request().query('SELECT * FROM Records');
        res.json(RecordsResult.recordset);
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 获取 Music 表数据
app.get('/api/getMusicData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let musicResult = await firstpool.request().query('SELECT * FROM Music');
        res.json({ music: musicResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 获取 RealEstate 表数据
app.get('/api/getRealEstateData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let realEstateResult = await firstpool.request().query('SELECT * FROM RealEstate');
        res.json({ RealEstate: realEstateResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 获取 AccountLogin 表数据
app.get('/api/getAccountLoginData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let accountLoginResult = await firstpool.request().query('SELECT * FROM AccountLogin');
        res.json({ AccountLogin: accountLoginResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 获取 TravelExpenseReimbursement 报销表数据
app.get('/api/getTravelExpenseReimbursementData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let travelExpenseReimbursementResult = await firstpool.request().query('SELECT * FROM TravelExpenseReimbursement');
        res.json({ TravelExpenseReimbursement: travelExpenseReimbursementResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// 添加差旅报销记录
// 添加差旅报销记录
app.post('/api/addTravelExpense', async (req, res) => {
    const { ProjectCode, ProjectName, Location, Amount, BusinessTripDate, ReimbursementDate, Remarks, ReimbursedBy, Whetherover } = req.body;
    try {
        let pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .input('ProjectCode', sql.NVarChar, ProjectCode)
            .input('ProjectName', sql.NVarChar, ProjectName)
            .input('Location', sql.NVarChar, Location)
            .input('Amount', sql.Decimal(18, 2), Amount)
            .input('BusinessTripDate', sql.Date, BusinessTripDate)
            .input('ReimbursementDate', sql.Date, ReimbursementDate)
            .input('Remarks', sql.NVarChar, Remarks)
            .input('ReimbursedBy', sql.NVarChar, ReimbursedBy)
            .input('Whetherover', sql.Bit, Whetherover) // 新增
            .query('INSERT INTO TravelExpenseReimbursement (ProjectCode, ProjectName, Location, Amount, BusinessTripDate, ReimbursementDate, Remarks, ReimbursedBy, Whetherover) OUTPUT INSERTED.ID VALUES (@ProjectCode, @ProjectName, @Location, @Amount, @BusinessTripDate, @ReimbursementDate, @Remarks, @ReimbursedBy, @Whetherover)');
        
        res.json({ ID: result.recordset[0].ID });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 更新差旅报销记录
app.put('/api/updateTravelExpense/:id', async (req, res) => {
    const { id } = req.params;
    const { ProjectCode, ProjectName, Location, Amount, BusinessTripDate, ReimbursementDate, Remarks, ReimbursedBy, Whetherover } = req.body;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('ID', sql.Int, id)
            .input('ProjectCode', sql.NVarChar, ProjectCode)
            .input('ProjectName', sql.NVarChar, ProjectName)
            .input('Location', sql.NVarChar, Location)
            .input('Amount', sql.Decimal(18, 2), Amount)
            .input('BusinessTripDate', sql.Date, BusinessTripDate)
            .input('ReimbursementDate', sql.Date, ReimbursementDate)
            .input('Remarks', sql.NVarChar, Remarks)
            .input('ReimbursedBy', sql.NVarChar, ReimbursedBy)
            .input('Whetherover', sql.Bit, Whetherover) // 新增
            .query('UPDATE TravelExpenseReimbursement SET ProjectCode = @ProjectCode, ProjectName = @ProjectName, Location = @Location, Amount = @Amount, BusinessTripDate = @BusinessTripDate, ReimbursementDate = @ReimbursementDate, Remarks = @Remarks, ReimbursedBy = @ReimbursedBy, Whetherover = @Whetherover WHERE ID = @ID');
        
        res.sendStatus(204); // No content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// 更新差旅报销记录
app.put('/api/updateTravelExpense/:id', async (req, res) => {
    const { id } = req.params;
    const { ProjectCode, ProjectName, Location, Amount, BusinessTripDate, ReimbursementDate, Remarks, ReimbursedBy, Whetherover } = req.body;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('ID', sql.Int, id)
            .input('ProjectCode', sql.NVarChar, ProjectCode)
            .input('ProjectName', sql.NVarChar, ProjectName)
            .input('Location', sql.NVarChar, Location)
            .input('Amount', sql.Decimal(18, 2), Amount)
            .input('BusinessTripDate', sql.Date, BusinessTripDate)
            .input('ReimbursementDate', sql.Date, ReimbursementDate)
            .input('Remarks', sql.NVarChar, Remarks)
            .input('ReimbursedBy', sql.NVarChar, ReimbursedBy)
            .input('Whetherover', sql.Bit, Whetherover) // 新增
            .query('UPDATE TravelExpenseReimbursement SET ProjectCode = @ProjectCode, ProjectName = @ProjectName, Location = @Location, Amount = @Amount, BusinessTripDate = @BusinessTripDate, ReimbursementDate = @ReimbursementDate, Remarks = @Remarks, ReimbursedBy = @ReimbursedBy, Whetherover = @Whetherover WHERE ID = @ID');
        
        res.sendStatus(204); // No content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 删除差旅报销记录
app.delete('/api/deleteTravelExpense/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('ID', sql.Int, id)
            .query('DELETE FROM TravelExpenseReimbursement WHERE ID = @ID');
        
        res.sendStatus(204); // No content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});







// 获取  绩效表表数据
app.get('/api/getAchievementsData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let achievementsResult = await firstpool.request().query('SELECT * FROM Achievements');
        res.json({ Achievements: achievementsResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 添加绩效记录
app.post('/api/addAchievement', async (req, res) => {
    const { ProjectCode, ReportNumber, ProjectName, ChargeAmount, ChargeDate, AchievementAmount, SignedAmount, CommissionDate, Notes, PerformancePerson, Whetherticheng } = req.body;
    try {
        let pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .input('ProjectCode', sql.VarChar, ProjectCode)
            .input('ReportNumber', sql.VarChar, ReportNumber)
            .input('ProjectName', sql.VarChar, ProjectName)
            .input('ChargeAmount', sql.Decimal(18, 2), ChargeAmount)
            .input('ChargeDate', sql.Date, ChargeDate)
            .input('AchievementAmount', sql.Decimal(18, 2), AchievementAmount)
            .input('SignedAmount', sql.Decimal(18, 2), SignedAmount)
            .input('CommissionDate', sql.Date, CommissionDate)
            .input('Notes', sql.Text, Notes)
            .input('PerformancePerson', sql.VarChar, PerformancePerson) // 添加 PerformancePerson
            .input('Whetherticheng', sql.Bit, Whetherticheng) // 新增
            .query('INSERT INTO Achievements (ProjectCode, ReportNumber, ProjectName, ChargeAmount, ChargeDate, AchievementAmount, SignedAmount, CommissionDate, Notes, PerformancePerson, Whetherticheng) OUTPUT INSERTED.ID VALUES (@ProjectCode, @ReportNumber, @ProjectName, @ChargeAmount, @ChargeDate, @AchievementAmount, @SignedAmount, @CommissionDate, @Notes, @PerformancePerson, @Whetherticheng)');
        
        res.json({ ID: result.recordset[0].ID });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 更新绩效记录
app.put('/api/updateAchievement/:id', async (req, res) => {
    const { id } = req.params;
    const { ProjectCode, ReportNumber, ProjectName, ChargeAmount, ChargeDate, AchievementAmount, SignedAmount, CommissionDate, Notes, PerformancePerson, Whetherticheng } = req.body;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('ID', sql.Int, id)
            .input('ProjectCode', sql.VarChar, ProjectCode)
            .input('ReportNumber', sql.VarChar, ReportNumber)
            .input('ProjectName', sql.VarChar, ProjectName)
            .input('ChargeAmount', sql.Decimal(18, 2), ChargeAmount)
            .input('ChargeDate', sql.Date, ChargeDate)
            .input('AchievementAmount', sql.Decimal(18, 2), AchievementAmount)
            .input('SignedAmount', sql.Decimal(18, 2), SignedAmount)
            .input('CommissionDate', sql.Date, CommissionDate)
            .input('Notes', sql.Text, Notes)
            .input('PerformancePerson', sql.VarChar, PerformancePerson) // 添加 PerformancePerson
            .input('Whetherticheng', sql.Bit, Whetherticheng) // 新增
            .query('UPDATE Achievements SET ProjectCode = @ProjectCode, ReportNumber = @ReportNumber, ProjectName = @ProjectName, ChargeAmount = @ChargeAmount, ChargeDate = @ChargeDate, AchievementAmount = @AchievementAmount, SignedAmount = @SignedAmount, CommissionDate = @CommissionDate, Notes = @Notes, PerformancePerson = @PerformancePerson, Whetherticheng = @Whetherticheng WHERE ID = @ID');
        
        res.sendStatus(204); // No content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 删除绩效记录
app.delete('/api/deleteAchievement/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('ID', sql.Int, id)
            .query('DELETE FROM Achievements WHERE ID = @ID');
        
        res.sendStatus(204); // No content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// 获取 Special_Tips 特别事项提醒表数据
app.get('/api/getSpecial_TipsData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let special_TipsResult = await firstpool.request().query('SELECT * FROM Special_Tips');
        res.json({ Special_Tips: special_TipsResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// 获取 MessageDetail 表数据
app.get('/api/getMessageDetailData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let messageDetailResult = await firstpool.request().query('SELECT * FROM MessageDetail');
        res.json({ MessageDetail: messageDetailResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 获取 Structures 构筑物表数据
app.get('/api/getStructuresData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let structuresResult = await firstpool.request().query('SELECT * FROM Structures');
        res.json({ Structures: structuresResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
app.post('/api/addStructure', async (req, res) => {
    const { name, structure, area, unit, price } = req.body;  // 从请求体中获取数据
    try {
        let firstpool = await sql.connect(firstconfig);
        const query = `
            INSERT INTO Structures (name, structure, area, unit, price) 
            VALUES (@name, @structure, @area, @unit, @price)
        `;
        
        // 使用请求参数绑定来防止 SQL 注入
        await firstpool.request()
            .input('name', sql.NVarChar, name)
            .input('structure', sql.NVarChar, structure)
            .input('area', sql.NVarChar, area)
            .input('unit', sql.NVarChar, unit)
            .input('price', sql.NVarChar, price)
            .query(query);

        res.status(201).json({ message: '构筑物新增成功' });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
app.put('/api/updateStructure/:id', async (req, res) => {
    const { id } = req.params;  // 从 URL 获取 ID
    const { name, structure, area, unit, price } = req.body;  // 从请求体中获取数据

    try {
        let firstpool = await sql.connect(firstconfig);
        const query = `
            UPDATE Structures 
            SET name = @name, structure = @structure, area = @area, unit = @unit, price = @price 
            WHERE id = @id
        `;
        
        // 使用请求参数绑定来防止 SQL 注入
        const result = await firstpool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('structure', sql.NVarChar, structure)
            .input('area', sql.NVarChar, area)
            .input('unit', sql.NVarChar, unit)
            .input('price', sql.NVarChar, price)
            .query(query);

        if (result.rowsAffected > 0) {
            res.status(200).json({ message: '构筑物更新成功' });
        } else {
            res.status(404).json({ message: '构筑物未找到' });
        }

        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
app.delete('/api/deleteStructure/:id', async (req, res) => {
    const { id } = req.params;  // 从 URL 获取 ID

    try {
        let firstpool = await sql.connect(firstconfig);
        const query = 'DELETE FROM Structures WHERE id = @id';
        
        // 使用请求参数绑定来防止 SQL 注入
        const result = await firstpool.request()
            .input('id', sql.Int, id)
            .query(query);

        if (result.rowsAffected > 0) {
            res.status(200).json({ message: '构筑物删除成功' });
        } else {
            res.status(404).json({ message: '构筑物未找到' });
        }

        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});







// 添加新记录
app.post('/api/addRecord', async (req, res) => {
    const { category, subcategory, amount, date, person } = req.body;
    try {
        let firstpool = await sql.connect(firstconfig);
        await firstpool.request()
            .input('category', sql.NVarChar, category)
            .input('subcategory', sql.NVarChar, subcategory)
            .input('amount', sql.Float, amount)
            .input('date', sql.Date, date)
            .input('person', sql.NVarChar, person)
            .query('INSERT INTO Records (Category, Subcategory, Amount, Date, Person) VALUES (@category, @subcategory, @amount, @date, @person)');
        res.status(201).send('Record added successfully');
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 更新记录
app.put('/api/updateRecord/:id', async (req, res) => {
    const { id } = req.params;
    const { category, subcategory, amount, date, person } = req.body;
    try {
        let firstpool = await sql.connect(firstconfig);
        await firstpool.request()
            .input('id', sql.Int, id)
            .input('category', sql.NVarChar, category)
            .input('subcategory', sql.NVarChar, subcategory)
            .input('amount', sql.Float, amount)
            .input('date', sql.Date, date)
            .input('person', sql.NVarChar, person)
            .query('UPDATE Records SET Category = @category, Subcategory = @subcategory, Amount = @amount, Date = @date, Person = @person WHERE Id = @id');
        res.send('Record updated successfully');
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 删除记录
app.delete('/api/deleteRecord/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let firstpool = await sql.connect(firstconfig);
        await firstpool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Records WHERE Id = @id');
        res.send('Record deleted successfully');
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 添加新房产
app.post('/api/addRealEstateData', async (req, res) => {
    const { location, area, building_area, interior_area, community_name, property_usage, house_structure, market_price, market_rent, base_date, remarks, house_type, construction_year, floor } = req.body;
    try {
        let firstpool = await sql.connect(firstconfig);
        let result = await firstpool.request()
            .input('location', sql.NVarChar, location)
            .input('area', sql.NVarChar, area)
            .input('building_area', sql.Decimal(10, 2), building_area)
            .input('interior_area', sql.Decimal(10, 2), interior_area)
            .input('community_name', sql.NVarChar, community_name)
            .input('property_usage', sql.NVarChar, property_usage)
            .input('house_structure', sql.NVarChar, house_structure)
            .input('market_price', sql.Decimal(10, 2), market_price)
            .input('market_rent', sql.Decimal(10, 2), market_rent)
            .input('base_date', sql.Date, base_date) // 新增
            .input('remarks', sql.NVarChar, remarks) // 新增
            .input('house_type', sql.NVarChar, house_type)
            .input('construction_year', sql.Int, construction_year)
            .input('floor', sql.NVarChar, floor)
            .query('INSERT INTO RealEstate (location, area, building_area, interior_area, community_name, property_usage, house_structure, market_price, market_rent, base_date, remarks, house_type, construction_year, floor) OUTPUT INSERTED.* VALUES (@location, @area, @building_area, @interior_area, @community_name, @property_usage, @house_structure, @market_price, @market_rent, @base_date, @remarks, @house_type, @construction_year, @floor)');
        
        res.json(result.recordset[0]);
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// 更新房产
app.put('/api/updateRealEstateData/:id', async (req, res) => {
    const { id } = req.params;
    const { location, area, building_area, interior_area, community_name, property_usage, house_structure, market_price, market_rent, base_date, remarks, house_type, construction_year, floor } = req.body;
    try {
        let firstpool = await sql.connect(firstconfig);
        await firstpool.request()
            .input('id', sql.Int, id)
            .input('location', sql.NVarChar, location)
            .input('area', sql.NVarChar, area)
            .input('building_area', sql.Decimal(10, 2), building_area)
            .input('interior_area', sql.Decimal(10, 2), interior_area)
            .input('community_name', sql.NVarChar, community_name)
            .input('property_usage', sql.NVarChar, property_usage)
            .input('house_structure', sql.NVarChar, house_structure)
            .input('market_price', sql.Decimal(10, 2), market_price)
            .input('market_rent', sql.Decimal(10, 2), market_rent)
            .input('base_date', sql.Date, base_date) // 新增
            .input('remarks', sql.NVarChar, remarks) // 新增
            .input('house_type', sql.NVarChar, house_type)
            .input('construction_year', sql.Int, construction_year)
            .input('floor', sql.NVarChar, floor)
            .query('UPDATE RealEstate SET location = @location, area = @area, building_area = @building_area, interior_area = @interior_area, community_name = @community_name, property_usage = @property_usage, house_structure = @house_structure, market_price = @market_price, market_rent = @market_rent, base_date = @base_date, remarks = @remarks, house_type = @house_type, construction_year = @construction_year, floor = @floor WHERE id = @id');
        
        res.send('RealEstate updated successfully');
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// 删除房产
app.delete('/api/deleteRealEstateData/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let firstpool = await sql.connect(firstconfig);
        await firstpool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM RealEstate WHERE id = @id');
        res.send('RealEstate deleted successfully');
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



//下载报告

//获取下载表数据
// 获取 Template 表数据
app.get('/api/getTemplateData', async (req, res) => {
    try {
        let firstpool = await sql.connect(firstconfig);
        let templateResult = await firstpool.request().query('SELECT * FROM Report_Template');
        res.json({ Template: templateResult.recordset });
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 下载文件的路由
app.get('/download/:templateId/:file', (req, res) => {
    const templateId = req.params.templateId;
    const fileName = req.params.file; // 获取文件名
    //注意这里的文件位置
    const directoryPath = path.join(__dirname, './public/downloads/Templates', templateId);

    // 确保目录存在
    if (!fs.existsSync(directoryPath)) {
        return res.status(404).send('Directory not found 未找到资源');
    }

    const filePath = path.join(directoryPath, fileName); // 组合文件路径

    // 确保文件存在
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found 未找到文件');
    }

    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
        }
    });
});

// 获取指定模板文件夹中的文件列表
app.get('/api/getTemplateFiles/:number', (req, res) => {
    const templateNumber = req.params.number;
    //注意这里的文件位置
    const directoryPath = path.join(__dirname, './public/downloads/Templates', templateNumber);

    // 确保目录存在
    if (!fs.existsSync(directoryPath)) {
        return res.status(404).send('Directory not found 未找到资源');
    }

    // 读取目录中的文件
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }
        // 返回文件名列表
        res.json({ files });
    });
});

 

//根据文件名来获取链接
 
app.get('/api/getReportTemplate_Link/:fileName', async (req, res) => {
    const { fileName } = req.params;
    console.log('Received fileName:', fileName); // 打印接收到的文件名
    try {
        let firstpool = await sql.connect(firstconfig);
        const query = `
            SELECT share_view_link, share_download_link, internal_edit_link 
            FROM ReportTemplate_Link 
            WHERE file_name = @fileName`; // 使用参数化查询以避免 SQL 注入
        
        const request = firstpool.request()
            .input('fileName', sql.NVarChar(255), fileName);

        const result = await request.query(query);
        if (result.recordset.length > 0) {
            res.json(result.recordset); // 如果有多个结果，返回所有结果
        } else {
            res.status(404).send('Link not found');
        }
        firstpool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 获取 UsedWebsites 常用网站数据
app.get('/api/getUsedWebsitesData', async (req, res) => {
    let firstpool;
    try {
        firstpool = await sql.connect(firstconfig);
        let usedWebsitesResult = await firstpool.request().query('SELECT * FROM UsedWebsites');
        res.json(usedWebsitesResult.recordset); // 直接返回 recordset
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    } finally {
        if (firstpool) {
            firstpool.close(); // 确保连接关闭
        }
    }
});


//项目派单表
// 获取所有派单记录
app.get('/api/getProjectDispatchData', async (req, res) => {
    try {
        let pool = await sql.connect(firstconfig);
        const result = await pool.request().query('SELECT * FROM ProjectDispatchForm');
        res.status(200).json({ ProjectDispatchForm: result.recordset });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 添加派单记录
app.post('/api/addProjectDispatch', async (req, res) => {
    const {
        ProjectName, Branch, OrderNumber, ProjectSource,
        ProjectSourceContact, ProjectSourcePhone, Client,
        ClientContact, ClientPhone, Applicant, ApplicantContact,
        ApplicantPhone, Defendant, DefendantContact, DefendantPhone,
        ProjectType, EvaluationPurpose, PersonInCharge, EntrustDate, DispatchDate,
        ProjectNumber, CompleteProgress, Principal // 新增 Principal 字段
    } = req.body;

    try {
        let pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .input('ProjectName', sql.NVarChar, ProjectName)
            .input('Branch', sql.NVarChar, Branch)
            .input('OrderNumber', sql.NVarChar, OrderNumber)
            .input('ProjectSource', sql.NVarChar, ProjectSource)
            .input('ProjectSourceContact', sql.NVarChar, ProjectSourceContact)
            .input('ProjectSourcePhone', sql.NVarChar, ProjectSourcePhone)
            .input('Client', sql.NVarChar, Client)
            .input('ClientContact', sql.NVarChar, ClientContact)
            .input('ClientPhone', sql.NVarChar, ClientPhone)
            .input('Applicant', sql.NVarChar, Applicant)
            .input('ApplicantContact', sql.NVarChar, ApplicantContact)
            .input('ApplicantPhone', sql.NVarChar, ApplicantPhone)
            .input('Defendant', sql.NVarChar, Defendant)
            .input('DefendantContact', sql.NVarChar, DefendantContact)
            .input('DefendantPhone', sql.NVarChar, DefendantPhone)
            .input('ProjectType', sql.NVarChar, ProjectType)
            .input('EvaluationPurpose', sql.NVarChar, EvaluationPurpose)
            .input('PersonInCharge', sql.NVarChar, PersonInCharge)
            .input('EntrustDate', sql.Date, EntrustDate)
            .input('DispatchDate', sql.Date, DispatchDate)
            .input('ProjectNumber', sql.NVarChar, ProjectNumber)
            .input('CompleteProgress', sql.Bit, CompleteProgress)
            .input('Principal', sql.NVarChar, Principal) // 新增 Principal 字段
            .query(`
                INSERT INTO ProjectDispatchForm (
                    ProjectName, Branch, OrderNumber, ProjectSource,
                    ProjectSourceContact, ProjectSourcePhone, Client,
                    ClientContact, ClientPhone, Applicant,
                    ApplicantContact, ApplicantPhone, Defendant,
                    DefendantContact, DefendantPhone, ProjectType,
                    EvaluationPurpose, PersonInCharge, EntrustDate, DispatchDate,
                    ProjectNumber, CompleteProgress, Principal
                ) VALUES (
                    @ProjectName, @Branch, @OrderNumber, @ProjectSource,
                    @ProjectSourceContact, @ProjectSourcePhone, @Client,
                    @ClientContact, @ClientPhone, @Applicant,
                    @ApplicantContact, @ApplicantPhone, @Defendant,
                    @DefendantContact, @DefendantPhone, @ProjectType,
                    @EvaluationPurpose, @PersonInCharge, @EntrustDate, @DispatchDate,
                    @ProjectNumber, @CompleteProgress, @Principal
                );
            `);
        res.status(201).json({ ID: result.rowsAffected[0] });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 更新派单记录
app.put('/api/updateProjectDispatch/:id', async (req, res) => {
    const { id } = req.params;
    const {
        ProjectName, Branch, OrderNumber, ProjectSource,
        ProjectSourceContact, ProjectSourcePhone, Client,
        ClientContact, ClientPhone, Applicant, ApplicantContact,
        ApplicantPhone, Defendant, DefendantContact, DefendantPhone,
        ProjectType, EvaluationPurpose, PersonInCharge, EntrustDate, DispatchDate,
        ProjectNumber, CompleteProgress, Principal // 新增 Principal 字段
    } = req.body;

    try {
        let pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('ProjectName', sql.NVarChar, ProjectName)
            .input('Branch', sql.NVarChar, Branch)
            .input('OrderNumber', sql.NVarChar, OrderNumber)
            .input('ProjectSource', sql.NVarChar, ProjectSource)
            .input('ProjectSourceContact', sql.NVarChar, ProjectSourceContact)
            .input('ProjectSourcePhone', sql.NVarChar, ProjectSourcePhone)
            .input('Client', sql.NVarChar, Client)
            .input('ClientContact', sql.NVarChar, ClientContact)
            .input('ClientPhone', sql.NVarChar, ClientPhone)
            .input('Applicant', sql.NVarChar, Applicant)
            .input('ApplicantContact', sql.NVarChar, ApplicantContact)
            .input('ApplicantPhone', sql.NVarChar, ApplicantPhone)
            .input('Defendant', sql.NVarChar, Defendant)
            .input('DefendantContact', sql.NVarChar, DefendantContact)
            .input('DefendantPhone', sql.NVarChar, DefendantPhone)
            .input('ProjectType', sql.NVarChar, ProjectType)
            .input('EvaluationPurpose', sql.NVarChar, EvaluationPurpose)
            .input('PersonInCharge', sql.NVarChar, PersonInCharge)
            .input('EntrustDate', sql.Date, EntrustDate)
            .input('DispatchDate', sql.Date, DispatchDate)
            .input('ProjectNumber', sql.NVarChar, ProjectNumber)
            .input('CompleteProgress', sql.Bit, CompleteProgress)
            .input('Principal', sql.NVarChar, Principal) // 新增 Principal 字段
            .query(`
                UPDATE ProjectDispatchForm SET
                ProjectName = @ProjectName,
                Branch = @Branch,
                OrderNumber = @OrderNumber,
                ProjectSource = @ProjectSource,
                ProjectSourceContact = @ProjectSourceContact,
                ProjectSourcePhone = @ProjectSourcePhone,
                Client = @Client,
                ClientContact = @ClientContact,
                ClientPhone = @ClientPhone,
                Applicant = @Applicant,
                ApplicantContact = @ApplicantContact,
                ApplicantPhone = @ApplicantPhone,
                Defendant = @Defendant,
                DefendantContact = @DefendantContact,
                DefendantPhone = @DefendantPhone,
                ProjectType = @ProjectType,
                EvaluationPurpose = @EvaluationPurpose,
                PersonInCharge = @PersonInCharge,
                EntrustDate = @EntrustDate,
                DispatchDate = @DispatchDate,
                ProjectNumber = @ProjectNumber,
                CompleteProgress = @CompleteProgress,
                Principal = @Principal
                WHERE id = @id;
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('派单记录未找到');
        }

        res.status(200).json({ message: '派单记录更新成功' });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 删除派单记录
app.delete('/api/deleteProjectDispatch/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM ProjectDispatchForm WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('派单记录未找到');
        }

        res.status(200).json({ message: '派单记录删除成功' });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});




//报告编号
// 获取所有报告
app.get('/api/getReportNumbers', async (req, res) => {
    try {
        let pool = await sql.connect(firstconfig);
        let result = await pool.request().query('SELECT * FROM ReportNumberTable');
        res.json(result.recordset);
    } catch (error) {
        console.error('获取报告失败:', error);
        res.status(500).send('服务器错误');
    }
});

// 添加新报告
app.post('/api/addReportNumbers', async (req, res) => {
    const { asset_region, report_type, total_assessment_value, asset_usage, unit_assessment_price, assessment_area, report_count, issue_date, report_number, remarks } = req.body;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('asset_region', sql.NVarChar, asset_region)
            .input('report_type', sql.NVarChar, report_type)
            .input('total_assessment_value', sql.Decimal(18, 2), total_assessment_value)
            .input('asset_usage', sql.NVarChar, asset_usage)
            .input('unit_assessment_price', sql.Decimal(18, 2), unit_assessment_price)
            .input('assessment_area', sql.Decimal(18, 2), assessment_area)
            .input('report_count', sql.Int, report_count)
            .input('issue_date', sql.Date, issue_date)
            .input('report_number', sql.NVarChar, report_number)
            .input('remarks', sql.NVarChar, remarks)
            .query('INSERT INTO ReportNumberTable (asset_region, report_type, total_assessment_value, asset_usage, unit_assessment_price, assessment_area, report_count, issue_date, report_number, remarks) VALUES (@asset_region, @report_type, @total_assessment_value, @asset_usage, @unit_assessment_price, @assessment_area, @report_count, @issue_date, @report_number, @remarks)');
        res.status(201).send('报告添加成功');
    } catch (error) {
        console.error('添加报告失败:', error);
        res.status(500).send('服务器错误');
    }
});

// 更新报告
// 更新报告
app.put('/api/updateReportNumbers/:id', async (req, res) => {
    const { id } = req.params;
    const { asset_region, report_type, total_assessment_value, asset_usage, unit_assessment_price, assessment_area, report_count, issue_date, report_number, remarks } = req.body;
    try {
        //console.log('Issue Date:', issue_date); // 检查 issue_date 的值
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('asset_region', sql.NVarChar, asset_region)
            .input('report_type', sql.NVarChar, report_type)
            .input('total_assessment_value', sql.Decimal(18, 2), total_assessment_value)
            .input('asset_usage', sql.NVarChar, asset_usage)
            .input('unit_assessment_price', sql.Decimal(18, 2), unit_assessment_price)
            .input('assessment_area', sql.Decimal(18, 2), assessment_area)
            .input('report_count', sql.Int, report_count)
            .input('issue_date', sql.Date, issue_date) // 确保传递的是有效的日期
            .input('report_number', sql.NVarChar, report_number)
            .input('remarks', sql.NVarChar, remarks)
            .query('UPDATE ReportNumberTable SET asset_region = @asset_region, report_type = @report_type, total_assessment_value = @total_assessment_value, asset_usage = @asset_usage, unit_assessment_price = @unit_assessment_price, assessment_area = @assessment_area, report_count = @report_count, issue_date = @issue_date, report_number = @report_number, remarks = @remarks WHERE id = @id');
        res.send('报告更新成功');
    } catch (error) {
        console.error('更新报告失败:', error);
        res.status(500).send('服务器错误');
    }
});


// 删除报告
app.delete('/api/deleteReportNumbers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM ReportNumberTable WHERE id = @id');
        res.send('报告删除成功');
    } catch (error) {
        console.error('删除报告失败:', error);
        res.status(500).send('服务器错误');
    }
});



//评估收费统计
// 获取所有费用记录
app.get('/api/getAssessProjectFees', async (req, res) => {
    try {
        let pool = await sql.connect(firstconfig);
        const result = await pool.request().query('SELECT * FROM AssessprojectfeesTable');
        res.json(result.recordset);
    } catch (error) {
        console.error('获取费用记录失败:', error);
        res.status(500).send('服务器错误');
    }
});

// 添加费用记录
app.post('/api/addAssessProjectFees', async (req, res) => {
    const { project_id, fee_amount, fee_date, fee_type, remarks } = req.body;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('project_id', sql.NVarChar, project_id)
            .input('fee_amount', sql.Decimal(18, 2), fee_amount)
            .input('fee_date', sql.DateTime, fee_date)
            .input('fee_type', sql.NVarChar, fee_type)
            .input('remarks', sql.NVarChar, remarks)
            .query('INSERT INTO AssessprojectfeesTable (project_id, fee_amount, fee_date, fee_type, remarks) VALUES (@project_id, @fee_amount, @fee_date, @fee_type, @remarks)');
        res.status(201).send('费用记录添加成功');
    } catch (error) {
        console.error('添加费用记录失败:', error);
        res.status(500).send('服务器错误');
    }
});

// 更新费用记录
app.put('/api/updateAssessProjectFees/:id', async (req, res) => {
    const { id } = req.params;
    const { project_id, fee_amount, fee_date, fee_type, remarks } = req.body;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('project_id', sql.NVarChar, project_id)
            .input('fee_amount', sql.Decimal(18, 2), fee_amount)
            .input('fee_date', sql.DateTime, fee_date)
            .input('fee_type', sql.NVarChar, fee_type)
            .input('remarks', sql.NVarChar, remarks)
            .query('UPDATE AssessprojectfeesTable SET project_id = @project_id, fee_amount = @fee_amount, fee_date = @fee_date, fee_type = @fee_type, remarks = @remarks WHERE id = @id');
        res.send('费用记录更新成功');
    } catch (error) {
        console.error('更新费用记录失败:', error);
        res.status(500).send('服务器错误');
    }
});

// 删除费用记录
app.delete('/api/deleteAssessProjectFees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM AssessprojectfeesTable WHERE id = @id');
        res.send('费用记录删除成功');
    } catch (error) {
        console.error('删除费用记录失败:', error);
        res.status(500).send('服务器错误');
    }
});


//工作日志
// 获取所有工作日志
app.get('/api/getEvaluateworklogTable', async (req, res) => {
    const { project_id } = req.query; // 从查询参数获取项目编号
    try {
        const pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .query(`SELECT * FROM EvaluateworklogTable ${project_id ? `WHERE project_id = @project_id` : ''}`);
        
        if (project_id) {
            pool.request().input('project_id', sql.NVarChar, project_id);
        }
        
        res.json(result.recordset);
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 添加工作日志
app.post('/api/addEvaluateworklogTable', async (req, res) => {
    const { project_id, communication_record, contact_time } = req.body;
    try {
        const pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .input('project_id', sql.NVarChar, project_id)
            .input('communication_record', sql.NVarChar, communication_record)
            .input('contact_time', sql.Date, contact_time)
            .query('INSERT INTO EvaluateworklogTable (project_id, communication_record, contact_time) VALUES (@project_id, @communication_record, @contact_time)');
        
        res.status(201).json({ ID: result.rowsAffected[0] });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 更新工作日志
app.put('/api/updateEvaluateworklogTable/:id', async (req, res) => {
    const { id } = req.params;
    const { project_id, communication_record, contact_time } = req.body;
    try {
        const pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('project_id', sql.NVarChar, project_id)
            .input('communication_record', sql.NVarChar, communication_record)
            .input('contact_time', sql.Date, contact_time)
            .query('UPDATE EvaluateworklogTable SET project_id = @project_id, communication_record = @communication_record, contact_time = @contact_time WHERE id = @id');
        
        res.send('工作日志更新成功');
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 删除工作日志
app.delete('/api/deleteEvaluateworklogTable/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM EvaluateworklogTable WHERE id = @id');
        
        res.status(204).send(); // No Content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



//机器设备
// 获取所有设备
app.get('/api/getMachineryEquipmentPricesTable', async (req, res) => {
    try {
        const pool = await sql.connect(firstconfig);
        const result = await pool.request().query('SELECT * FROM MachineryEquipmentPricesTable');
        res.json(result.recordset);
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 添加设备
app.post('/api/addMachineryEquipmentPricesTable', async (req, res) => {
    const { name, model, manufacturer, unit, price } = req.body;
    try {
        const pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('model', sql.NVarChar, model)
            .input('manufacturer', sql.NVarChar, manufacturer)
            .input('unit', sql.NVarChar, unit)
            .input('price', sql.Decimal(18, 2), price)
            .query('INSERT INTO MachineryEquipmentPricesTable (name, model, manufacturer, unit, price) OUTPUT INSERTED.id VALUES (@name, @model, @manufacturer, @unit, @price)');
        
        res.status(201).json({ ID: result.recordset[0].id });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 更新设备
app.put('/api/updateMachineryEquipmentPricesTable/:id', async (req, res) => {
    const { id } = req.params;
    const { name, model, manufacturer, unit, price } = req.body;
    try {
        const pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('model', sql.NVarChar, model)
            .input('manufacturer', sql.NVarChar, manufacturer)
            .input('unit', sql.NVarChar, unit)
            .input('price', sql.Decimal(18, 2), price)
            .query('UPDATE MachineryEquipmentPricesTable SET name = @name, model = @model, manufacturer = @manufacturer, unit = @unit, price = @price WHERE id = @id');
        
        res.sendStatus(204); // No Content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 删除设备
app.delete('/api/deleteMachineryEquipmentPricesTable/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM MachineryEquipmentPricesTable WHERE id = @id');
        
        res.sendStatus(204); // No Content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



//运动记录
// 获取所有记录
app.get('/api/getSportsRecordingTable', async (req, res) => {
    try {
        const pool = await sql.connect(firstconfig);
        const result = await pool.request().query('SELECT * FROM SportsRecordingTable');
        res.json(result.recordset);
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 添加运动记录
app.post('/api/addSportsRecordingTable', async (req, res) => {
    const { sport_type, unit, quantity, date, duration, participant, remark } = req.body;

    // 验证时间格式
    const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(time);
    if (!isValidTime(duration)) {
        return res.status(400).send('Invalid time format for duration');
    }

    try {
        const pool = await sql.connect(firstconfig);
        const result = await pool.request()
            .input('sport_type', sql.VarChar, sport_type)
            .input('unit', sql.VarChar, unit)
            .input('quantity', sql.Int, quantity)
            .input('date', sql.Date, date)
            .input('duration', sql.NVarChar(8), duration) // 修改为 NVARCHAR(8)
            .input('participant', sql.VarChar, participant)
            .input('remark', sql.NVarChar, remark)
            .query('INSERT INTO SportsRecordingTable (sport_type, unit, quantity, date, duration, participant, remark) VALUES (@sport_type, @unit, @quantity, @date, @duration, @participant, @remark)');
        
        res.status(201).json({ ID: result.rowsAffected[0] });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 更新运动记录
app.put('/api/updateSportsRecordingTable/:id', async (req, res) => {
    const { id } = req.params;
    const { sport_type, unit, quantity, date, duration, participant, remark } = req.body;

    // 验证时间格式
    const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(time);
    if (!isValidTime(duration)) {
        return res.status(400).send('Invalid time format for duration');
    }

    try {
        const pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('sport_type', sql.VarChar, sport_type)
            .input('unit', sql.VarChar, unit)
            .input('quantity', sql.Int, quantity)
            .input('date', sql.Date, date)
            .input('duration', sql.NVarChar(8), duration) // 修改为 NVARCHAR(8)
            .input('participant', sql.VarChar, participant)
            .input('remark', sql.NVarChar, remark)
            .query('UPDATE SportsRecordingTable SET sport_type = @sport_type, unit = @unit, quantity = @quantity, date = @date, duration = @duration, participant = @participant, remark = @remark WHERE id = @id');
        
        res.status(204).send(); // No Content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 删除运动记录
app.delete('/api/deleteSportsRecordingTable/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(firstconfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM SportsRecordingTable WHERE id = @id');
        
        res.status(204).send(); // No Content
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


//房屋图片上传
// 配置 multer 中间件
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const { region, location } = req.body;
      const uploadPath = path.join(__dirname, "images", "Community", region, location);
  
      // 如果文件夹不存在，则创建
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
  
      cb(null, uploadPath); // 设置文件存储路径
    },
    filename: (req, file, cb) => {
      // 使用原始文件名
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });
  
  // 处理文件上传
  app.post("/upload", upload.array("images"), (req, res) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "未上传任何文件" });
      }
  
      res.status(200).json({ message: "文件上传成功" });
    } catch (error) {
      console.error("上传失败：", error);
      res.status(500).json({ message: "服务器错误" });
    }
  });
  

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
