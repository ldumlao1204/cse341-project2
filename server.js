const express = require('express');
const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', require('./routes'));

app.get('/', (req, res) => {
    res.send('Welcome to the Student API!');
});

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => { console.log(`Database is listening and node is Running on port ${port}`) });
    }
});

