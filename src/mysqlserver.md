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
        ProjectType, EvaluationPurpose, PersonInCharge, EntrustDate, DispatchDate
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
            .query(`
                INSERT INTO ProjectDispatchForm (
                    ProjectName, Branch, OrderNumber, ProjectSource,
                    ProjectSourceContact, ProjectSourcePhone, Client,
                    ClientContact, ClientPhone, Applicant,
                    ApplicantContact, ApplicantPhone, Defendant,
                    DefendantContact, DefendantPhone, ProjectType,
                    EvaluationPurpose, PersonInCharge, EntrustDate, DispatchDate
                ) VALUES (
                    @ProjectName, @Branch, @OrderNumber, @ProjectSource,
                    @ProjectSourceContact, @ProjectSourcePhone, @Client,
                    @ClientContact, @ClientPhone, @Applicant,
                    @ApplicantContact, @ApplicantPhone, @Defendant,
                    @DefendantContact, @DefendantPhone, @ProjectType,
                    @EvaluationPurpose, @PersonInCharge, @EntrustDate, @DispatchDate
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
        ProjectType, EvaluationPurpose, PersonInCharge, EntrustDate, DispatchDate
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
                DispatchDate = @DispatchDate
                WHERE id = @id;
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('派单记录未找到');
        }

        res.status(200).send('派单记录更新成功');
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
