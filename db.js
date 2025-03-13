require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directory'
});

//equiv exportdef front
module.exports = client;

