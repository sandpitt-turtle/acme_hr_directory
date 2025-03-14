require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const client = require('./db'); 

const app = express();
const apiRoutes = require('./api');

app.use(morgan('dev'));
app.use(express.json());
app.use('/api', apiRoutes); 

const init = async () => {
    try {
        await client.connect();
        console.log('Connected to database');

        let SQL = `
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS departments;

        CREATE TABLE departments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE employees (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE
        );
        `;
        await client.query(SQL);
        console.log('Tables created');

        let seedSQL = `
        INSERT INTO departments (name) VALUES 
            ('Leadership'),
            ('Combat'),
            ('Navigation'),
            ('Support'),
            ('Engineering');

        INSERT INTO employees (name, department_id) VALUES 
            ('Monkey D. Luffy', 1),  
            ('Roronoa Zoro', 2),     
            ('Sanji', 2),           
            ('Jinbe', 2),           
            ('Nami', 3),            
            ('Usopp', 4),            
            ('Tony Tony Chopper', 4),
            ('Nico Robin', 4),      
            ('Brook', 4),            
            ('Franky', 5);           
        `;
        await client.query(seedSQL);
        console.log('Data seeded');

        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

init();
