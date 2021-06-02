var mysql = require('mysql');

con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_chats",
    debug : false
});

module.exports = con 