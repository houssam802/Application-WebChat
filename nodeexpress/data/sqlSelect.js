const con = require('./sqlConnection');
const UserModel = require('../models/model.user');
var Buffer = require('buffer/').Buffer;


module.exports.getUsers = function(callback, error){
    let utils=[];
    var sql = 'SELECT * FROM utilisateurs';
    con.query(sql, function (err, result) {
        if (err)  error(err);
        if(result) {
            result.forEach(element => {
                utils.push(new UserModel(element.nom,element.email,element.id).JSON());
            });
            callback(utils);
        }
    });
}

module.exports.select_id_util = function(id_util,callback,error){
    var sql = 'SELECT * FROM utilisateurs where id = ?';
    con.query(sql,[id_util], function (err, result) {
        if(err) error(err);
        if( result ){
            if ( result.length === 0 ){  
                error({ id : "Utilisateur Inexistant" });  
            } else {
                callback(result[0]);
            }
        }
    });
}

module.exports.verifier_user = function(nom, mdp, callback, error){
    var sql = 'SELECT * FROM utilisateurs where nom = ?';
    con.query(sql,[nom], function (err, result) {
        if (err){
            error(err);
        } else {
            if ( result.length === 0 ){  
                error({ nom : "Utilisateur Inexistant" });  
            } else {
                let pers =new UserModel(result[0].nom,result[0].email,result[0].id);
                pers.hash=result[0].mdp;
                if(pers.verify(mdp)){
                    callback(pers);
                }else error({ pwd : "mot de passe incorrect !" });
            }
        }
    });
}


module.exports.get_chat = function(util1,util2,callback, error){
    var sql = 'SELECT chat FROM chats WHERE (util1=? and util2=?) or (util1=? and util2=?)';
    values=[util1,util2,util2,util1]
    con.query(sql,values, function (err, res) {
        if (err) {
            error(err);
        } else {
            callback(JSON.parse(res[0].chat.toString()));
        }
    });

}



module.exports.get_all_chats = function(id_util,callback,error){
    var utils=[];
    var sql1 = 'SELECT u.*,c.chat FROM utilisateurs u,chats c where (u.id = c.util2 and c.util1=?)'+
        'or (u.id = c.util1 and c.util2=?)';
    con.query(sql1,[id_util,id_util], function (err, result) {
        if (err){
            error({ message : err }); 
        } else {       
            if ( result.length !== 0 ){
                result.forEach(element => {
                if(element.chat.toString()!=""){
                    let chat=JSON.parse(element.chat.toString());
                    let i=0;
                    if(chat.messages.length!=0){
                        chat.messages.forEach((elem)=>{
                            if(elem["lue"] == false && elem["id_personne"] != id_util ) i+=1;
                        });
                        utils.push({
                            id: element.id,
                            nom: element.nom,
                            email:element.email,
                            mime: element.mimeType,
                            photo: element.photo,
                            msg_non_lue:i,
                            der_msg:chat.messages[chat.messages.length-1].content
                        });
                    }else{
                        utils.push({
                            id: element.id,
                            nom: element.nom,
                            email:element.email,
                            mime: element.mimeType,
                            photo: element.photo
                        });
                    }
                }
                });
            }
            callback(utils);
        }
    });
}


module.exports.getFichier = function( nomFichier, resolve, reject){
    var sqlQuery = 'SELECT mimeType, file FROM files where fileName like ?';
    con.query(sqlQuery, [nomFichier+'%'], function(err, result) {
        if(err){
            reject(err);
        } else {
            if(result.length == 0){
                reject('Rien trouver !');
            } else {
                var arrayBuffer = [];
                result.forEach( (partie) => {
                    arrayBuffer.push(partie.file);
                })
                var bufferTotal = Buffer.concat(arrayBuffer);
                var json = { mimeType : result[0].mimeType, file : bufferTotal }
                resolve(json);
            }
        }
    });
}




function select_infos_users(id_util,nom,callback, error){
    var utils=[];
    var str="%"+nom+"%";
    var sql1 = 'SELECT DISTINCT u.* FROM utilisateurs u,chats c where u.id != ? and '+
        '(u.nom not in (SELECT DISTINCT u.nom FROM utilisateurs u,chats c where (u.id = c.util2 and c.util1=?)'+
        'or (u.id = c.util1 and c.util2=?))) and u.nom like ?';
    con.query(sql1,[id_util,id_util,id_util,str], function (err, result) {
        if (err) {
             error({ message : err });
        } else {        
            if ( result.length === 0 ){  
                callback([])
            }else{
                result.forEach(element => {
                    utils.push({
                        id: element.id,
                        nom: element.nom,
                        email:element.email,
                        mime: element.mimeType,
                        photo: element.photo,
                        demandes_envoyer : false 
                    });
                });
                callback(utils);
            }
        }
    });
}

module.exports.select_infos_users_plus_demande = function(id_util,nom,callback, error){
      select_infos_users(id_util,nom,function(res){
        var str="%"+nom+"%";
        var sql1 ='SELECT u.* FROM utilisateurs u,chats c where (u.id = c.util2 and c.util1=?)'+
        ' and (u.nom like ? and c.chat like "") ';
        con.query(sql1,[id_util,str], function (err, result) {
            if (err){
                error({ message : err }); 
            } else {
                if ( result.length === 0 ){  
                    callback(res)
                }else{
                    result.forEach(element => {
                        res.push({
                            id: element.id,
                            nom: element.nom,
                            email:element.email,
                            mime: element.mimeType,
                            photo: element.photo,
                            demandes_envoyer : true
                        });
                    });
                    callback(res);
               }
            }       
        });

      },function(err){})
}

module.exports.get_demandes_amie = function(id_util,callback){
    var utils=[];
    var sql1 ='SELECT u.* FROM utilisateurs u,chats c where (u.id = c.util1 and c.util2=?) and (c.chat ="" ) ';
        con.query(sql1,[id_util,id_util], function (err, result) {
            if (err){
                error({ message : err }); 
            } else {
                if ( result.length === 0 ){  
                    callback([])
                }else{
                    result.forEach(element => {
                        utils.push({
                            id: element.id,
                            nom: element.nom,
                            email:element.email,
                            mime: element.mimeType,
                            photo: element.photo
                        });
                    });
                    callback(utils);
               }
            }    
        })
}
