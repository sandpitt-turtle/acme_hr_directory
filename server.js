require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const client = require('./db');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const initDB = async () => {
    try {
        await client.connect();

        await client.query(`
            DROP TABLE IF EXISTS employees;
            DROP TABLE IF EXISTS departments;
        `);
        console.log('Tables dropped');
        await client.query(`
            CREATE TABLE departments (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);
        console.log('Departments table created');

        await client.query(`
            CREATE TABLE employees (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE
            );
        `);

        console.log('Employees table created');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};
const init = async () => {
    await initDB();

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
};

init();
