var mysql = require('mysql');

con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_chats",
    debug : false
});

con.connect((err) => {
    if(err) console.log(err.message);
    console.log('connected');
})

module.exports = con 