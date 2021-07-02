const con = require('./sqlConnection');




module.exports.updateProfile = function(personnel, idP, mime, buffer, callback, error){
        console.log(idP);
        var sql, valeurs;
        if( arguments.length == 6 ) {
            sql = "UPDATE utilisateurs SET nom=? , email= ?, mdp= ?, mimeType= ?, photo= ? where id= ?;";
            valeurs = [personnel.nom, personnel.email, personnel.pword, mime, buffer, idP];
            con.query(sql, valeurs, function (err, result) {
                if (err){
                    console.log(err)
                    error(err.message);
                }else{
                    personnel.id=result.insertId;
                    console.log(personnel);
                    callback(personnel);
                }   
            });
        } else {
            sql = "UPDATE utilisateurs SET nom= ?, email= ?, mdp= ? where id= ?;";
            valeurs = [personnel.nom, personnel.email, personnel.pword, idP];
            con.query(sql, valeurs, function (err, result) {
                if (err){
                    console.log(err)
                    buffer(err.message);
                }else{
                    personnel.id=result.insertId;
                    console.log(personnel)
                    mime(personnel);
                }   
            });
        }
}

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



module.exports.updateJson = function(id_emet,id_dest,json){
    var sql = "UPDATE chats SET chat= ? WHERE util1=? and util2=? or util1=? and util2=?";
    var values = [[Buffer.from(JSON.stringify(json))],id_emet,id_dest,id_dest,id_emet];
        con.query(sql,values, function (err, result) {
            if (err) throw err;
        });
}





module.exports.accept_demande_amie=function(id_emet,id_dest){
    var init={
        'messages': [    
        ]
    };
    var sql = "UPDATE chats SET chat= ? WHERE util1=? and util2=?";
    con.query(sql, [[Buffer.from(JSON.stringify(init))],id_emet,id_dest], function (err, result) {
        if (err) throw err;
        console.log('demande accepter');
    });
}