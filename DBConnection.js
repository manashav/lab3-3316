const mysql = require('mysql');

function newConnection()
{
    let conn = mysql.createConnection({
        host:'34.122.94.188',
        user:'root',
        password:'mypassword',
        database:'Doodle'
    });
    return conn;
}


module.exports = newConnection;