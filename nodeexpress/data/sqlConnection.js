var mysql = require('mysql');

con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_chat",
    debug : false
});

module.exports = con 