const router = require('express').Router();
const client = require('./db');

router.get('/employees', async (req, res, next) => {
    try {
        const SQL = `SELECT * FROM employees ORDER BY created_at DESC;`;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (ex) {
        next(ex);
    }
});

router.get('/departments', async (req, res, next) => {
    try {
        const SQL = `SELECT * FROM departments`;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (ex) {
        next(ex);
    }
});

router.post('/employees', async (req, res, next) => {
    try {
        const SQL = `
            INSERT INTO employees (name, department_id)
            VALUES($1, $2)
            RETURNING *;
        `;
        const response = await client.query(SQL, [req.body.name, req.body.department_id]);
        res.send(response.rows[0]);
    } catch (ex) {
        next(ex);
    }
});


router.delete('/employees/:id', async (req, res, next) => {
    try {
        const SQL = `DELETE FROM employees WHERE id = $1 RETURNING *;`;
        const response = await client.query(SQL, [req.params.id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(204).send(); 
    } catch (ex) {
        next(ex);
    }
});


router.put('/employees/:id', async (req, res, next) => {
    try {
        const { name, department_id } = req.body;
        if (!name || !department_id) {
            return res.status(400).json({ error: "Name and department_id are required" });
        }

        const SQL = `
            UPDATE employees
            SET name=$1, department_id=$2, updated_at=NOW()
            WHERE id=$3 RETURNING *;
        `;
        const response = await client.query(SQL, [name, department_id, req.params.id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.json(response.rows[0]);
    } catch (ex) {
        next(ex);
    }
});



// errorhandling
router.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});


module.exports = router;