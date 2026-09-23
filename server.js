const express = require('express');

const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 8080;

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

