const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Students API',
        description: 'API for managing student information'
    },
    host: 'cse341-project2-hpei.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js']; // Path to the API routes

swaggerAutogen(outputFile, endpointsFiles, doc);
