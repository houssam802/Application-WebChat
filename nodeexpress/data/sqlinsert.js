const con = require('./sqlConnection');
const UserModel = require('../models/model.user');

module.exports.insert_utilisateur = function(personnel,callback,error){
    var sql = "INSERT INTO utilisateurs (nom,email,mdp) VALUES "+personnel.displayInfo();
    con.query(sql, function (err, result) {
        if (err){
            error(err.message);
        }else{
            personnel.id=result.insertId;
            callback(personnel);
        }
        
    });
} 


//var pers =new UserModel ('ni','elaich.usni@gmail.com');
//pers.pwd='housni';
//console.log(insert_utilisateur(pers));


module.exports.amies=function(id_emet,id_dest){
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