const con = require('./sqlConnection');

module.exports.annuler_demmande_amie = function(id_emet,id_dest){
    var sql="DELETE FROM chats WHERE (util1=? and util2=?) or (util1=? and util2=?);"
    con.query(sql,[id_emet,id_dest,id_dest,id_emet],function(err,res){
        if(err) throw err;
    })
}