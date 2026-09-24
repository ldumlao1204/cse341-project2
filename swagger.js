const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Students API',
        description: 'API for managing student information'
    },
    host: 'cse341-project2-hpei.onrender.com',
    schemes: ['https'],
    definitions: {
        Student: {
            $firstName: 'Ava',
            $lastName: 'Santos',
            $email: 'ava.santos@example.com',
            birthday: '2003-04-12',
            address: '123 Maple St, Quezon City',
            contactNumber: '+63 917 555 0101',
            section: 'A'
        }
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js']; // Path to the API routes

swaggerAutogen(outputFile, endpointsFiles, doc);
