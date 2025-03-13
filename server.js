require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const client = require('./db');
// const apiRouter = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// app.use('/api', apiRouter);

const init = async () => {
    try {
       
        await client.connect();
        console.log('Database connected successfully');

       
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (ex) {
        console.error("Error initializing database:", ex);
        process.exit(1); 
    }
};


init();
