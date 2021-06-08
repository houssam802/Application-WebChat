const con = require('./sqlConnection');
const UserModel = require('../models/model.user');
var Buffer = require('buffer/').Buffer;


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

module.exports.select_id_util = function(id_util,callback,error){
    var sql = 'SELECT * FROM utilisateurs where id = ?';
    con.query(sql,[id_util], function (err, result) {
        if (err) throw err;
        if ( result.length === 0 ){  
            error({ id : "Utilisateur Inexistant" });  
        }
        callback(result[0]);
    });
}

module.exports.verifier_user = function(nom, mdp, callback, error){
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

module.exports.select_infos_amies = function(id_util,callback, error){
    var utils=[];
    var sql1 = 'SELECT u.nom FROM utilisateurs u,chats c where (u.id = c.util2 and c.util1=?)'+
        'or (u.id = c.util1 and c.util2=?)';
    con.query(sql1,[id_util,id_util], function (err, result) {
        if (err) error({ message : err });        
        if ( result.length === 0 ){  
            error({ amie : "Communiquer avec vos amies ." });  
        }
        result.forEach(element => {
            utils.push({
                id: element.id,
                nom: element.nom,
                mime: element.mimeType,
                photo: element.photo 
            });
        });
        callback(utils);
    });
}


module.exports.get_chat = function(util1,util2,callback){
    var sql = 'SELECT chat FROM chats WHERE (util1=? and util2=?) or (util1=? and util2=?)';
    values=[util1,util2,util2,util1]
    con.query(sql,values, function (err, res) {
        if (err) throw err;
        callback(JSON.parse(res[0].chat.toString()))
    });

}


module.exports.get_all_chats = function(id_util,callback,error){
    var utils=[];
    var sql1 = 'SELECT u.*,c.chat FROM utilisateurs u,chats c where (u.id = c.util2 and c.util1=?)'+
        'or (u.id = c.util1 and c.util2=?)';
    con.query(sql1,[id_util,id_util], function (err, result) {
        if (err) error({ message : err });        
        if ( result.length === 0 ){  
            error({ amie : "Communiquer avec vos amies ." });  
        }
        result.forEach(element => {
            let chat=JSON.parse(element.chat.toString());
            let i=0;
            if(chat.messages.length!=0){
                chat.messages.forEach((elem)=>{
                    if(elem["lue"] == false && elem["id_personne"] != id_util ) i+=1;
                });
                utils.push({
                    id: element.id,
                    nom: element.nom,
                    mime: element.mimeType,
                    photo: element.photo,
                    msg_non_lue:i,
                    der_msg:chat.messages[chat.messages.length-1].content
                });
            }else{
                utils.push({
                    id: element.id,
                    nom: element.nom,
                    mime: element.mimeType,
                    photo: element.photo
                });
            }
        });
        callback(utils);
    });
}