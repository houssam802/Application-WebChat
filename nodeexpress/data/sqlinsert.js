const con = require('./sqlConnection');
const UserModel = require('../models/model.user');
var Buffer = require('buffer/').Buffer;

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


module.exports.insertFichiers = function(fileName, mimeType, buffer, resolve, error){
    var sql = 'INSERT INTO files (fileName, mimeType, file) VALUES(?, ?, ?)';
    con.query(sql, [fileName, mimeType, buffer], (err, result) => {
        if (err){
            error(err.message);
        }else{
            resolve(result[0]);
        } 
    });
}



module.exports.demande_amie=function(id_emet,id_dest){
    var sql = "INSERT INTO chats (util1,util2) VALUES (?)";
    var values = [id_emet,id_dest];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
    });
}


