const con = require('./sqlConnection');
const UserModel = require('../models/model.user');

module.exports.getUsers = function(callback){
    let utils=[];
    var sql = 'SELECT * FROM utilisateurs';
    con.query(sql, function (err, result) {
        if (err) throw err;
        result.forEach(element => {
            utils.push(new UserModel(element.nom,element.email,element.id).JSON());
        });
        callback(utils);
    });
}

module.exports.select_id_util = function(id_util,callback){
    var sql = 'SELECT * FROM utilisateurs where id = ?';
    con.query(sql,[id_util], function (err, result) {
        if (err) throw err; 
        callback(new UserModel(result[0].nom,result[0].email,result[0].id));
    });
}

module.exports.verifier_user = function(nom,mdp,callback, error){
    var sql = 'SELECT * FROM utilisateurs where nom = ?';
    con.query(sql,[nom], function (err, result) {
        if (err) throw err;
        if ( result.length === 0 ){  
            error({ nom : "Utilisateur Inexistant" });  
        } else {
            let pers =new UserModel(result[0].nom,result[0].email,result[0].id);
            pers.hash=result[0].mdp;
            if(pers.verify(mdp)){
                callback(pers);
            }else error({ pwd : "mot de passe incorrect !" });
        }
    });
}

module.exports.select_infos_amis = function(id_util,callback){
    var utils=[];
    var sql = 'SELECT u.* FROM utilisateurs u,chats c where u.id = util2 and c.util1=?'+
        'or u.id = util1 and c.util2=?';
    con.query(sql,[id_util,id_util], function (err, result) {
        if (err) throw err;        
        result.forEach(element => {
            utils.push(new UserModel(element.nom,element.email,element.id));
        });
        callback(utils);
    });
}