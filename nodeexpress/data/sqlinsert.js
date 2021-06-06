const con = require('./sqlConnection');
const UserModel = require('../models/model.user');
var Buffer = require('buffer/').Buffer;

module.exports.insert_utilisateur = function(personnel, mime, buffer, callback, error){
    var sql = "INSERT INTO utilisateurs (nom, email, mdp, mimeType, photo) VALUES(?, ?, ?, ?, ?);";
    var valeurs = [personnel.nom, personnel.email, personnel.pword, mime, buffer];
    con.query(sql, valeurs, function (err, result) {
        if (err){
            error(err.message);
        }else{
            personnel.id=result.insertId;
            callback(personnel);
        }   
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



module.exports.demande_amie=function(id_emet,id_dest){
    var sql = "INSERT INTO amie (util1,util2) VALUES (?)";
    var values = [id_emet,id_dest];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
    });
}

module.exports.accept_demande_amie=function(id_emet,id_dest){
    var init={
        'messages': [    
        ]
    };
    var sql = "UPDATE amie SET chat= ? WHERE util1=? and util2=?";
    con.query(sql, [[Buffer.from(JSON.stringify(init))],id_emet,id_dest], function (err, result) {
        if (err) throw err;
        console.log('demande accepter');
    });
}

module.exports.updateJson = function(id_emet,id_dest,json){
    var sql = "UPDATE amie SET chat= ? WHERE util1=? and util2=? or util1=? and util2=?";
    var values = [Buffer.from(JSON.stringify(json)),id_emet,id_dest,id_dest,id_emet];
        con.query(sql,[values], function (err, result) {
            if (err) throw err;
        });
}
