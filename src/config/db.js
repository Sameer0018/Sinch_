const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: '172.0.0.16',
    user: 'sameer',
    password: 'gonc3ojrak2fn',
    database: 'sinch',
    port: 3306,

});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = connection;
