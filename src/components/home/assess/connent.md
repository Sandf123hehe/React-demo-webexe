//用来链接数据库使用示例
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const app = express();
const port = 5201;

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

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
