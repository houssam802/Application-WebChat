const con = require('./sqlConnection');
const UserModel = require('../models/model.user');

module.exports.insert_utilisateur = function(personnel, mime, buffer, callback, error){
    var sql, valeurs;
    if( arguments.length == 5 ) {
        sql = "INSERT INTO utilisateurs (nom, email, mdp, mimeType, photo) VALUES(?, ?, ?, ?, ?);";
        valeurs = [personnel.nom, personnel.email, personnel.pword, mime, buffer];
        con.query(sql, valeurs, function (err, result) {
            if (err){
                error(err.message);
            }else{
                personnel.id=result.insertId;
                callback(personnel);
            }   
        });
    } else {
        sql = "INSERT INTO utilisateurs (nom, email, mdp) VALUES(?, ?, ?);";
        valeurs = [personnel.nom, personnel.email, personnel.pword];
        con.query(sql, valeurs, function (err, result) {
            if (err){
                buffer(err.message);
            }else{
                personnel.id=result.insertId;
                mime(personnel);
            }   
        });
    }
} 


module.exports.amie=function(id_emet,id_dest){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        let filename="./BDD/"+id_emet+"_"+id_dest+".json";
        var sql = "INSERT INTO chats VALUES (?)";
        var values = [id_emet,id_dest,filename];
        var init={
            messages: [    
            ]
          };
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            let data = JSON.stringify(init, null, 2);
            fs.writeFile(filename, data, (err) => {
                if (err) throw err;
                console.log('Data written to file');
            });
        });
    });
}

module.exports.insertFile = function(fileName, mimeType, buffer, resolve, error){
    var sql = 'INSERT INTO files (fileName, mimeType, file) VALUES(?, ?, ?)';
    con.query(sql, [fileName, mimeType, buffer], (err, result) => {
        if (err){
            error(err.message);
        }else{
            resolve(result[0]);
        } 
    });
}