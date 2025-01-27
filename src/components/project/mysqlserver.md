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

// 获取所有 
app.get('/api/getSportsRecordingTable', async (req, res) => {
 
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 添加 
app.post('/api/addSportsRecordingTable', async (req, res) => {
 
        res.status(201).json({ ID: result.rowsAffected[0] });
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 更新 
app.put('/api/updateSportsRecordingTable/:id', async (req, res) => {
    const { id } = req.params;
   
             
        pool.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 删除 
app.delete('/api/deleteSportsRecordingTable/:id', async (req, res) => {
     

        res.status(204).send(); // No Content
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
