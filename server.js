const express = require('express');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Welcome to the Student API!');
});

app.use(express.json());

app.use('/api/students', studentRoutes);

app.listen(process.env.PORT || PORT);
console.log('Web Server is listening at port ' + (process.env.PORT || 8080));
