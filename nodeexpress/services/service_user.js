// implements all the CRUD operations create, read, update and delete the UserModel
const Validator = require('fastest-validator');
const UserModel = require('../models/model.user');
const sqlSelect = require('../data/sqlSelect');

/* create an instance of the validator */
const userValidator = new Validator({
    messages : {
        nomutil : "Nom pas valable",
        email : "Email doit être une adresse électronique valide",
        pword : "Mot de passe invalide"
    }
});

/* use the same patterns as on the client to validate the request */
const passwordPattern = /^([a-z])*([A-Z])*([0-9])*([!@#\$%\^&\*])*(?=.{8,32})/;

const userSchema = {
    /*uid : { type : "string" },*/
    nomutil : {type : "string"},
    email : {type : "email"},
    pword : {type : "string", min : 8, max : 32, pattern : passwordPattern}
};

class UserService {
    static create(data) {
        var vres = userValidator.validate(data, userSchema);
        // validation failed 
		if(!(vres === true))
		{
			let errors = {}, item;

			for(const index in vres)
			{
				item = vres[index];

				errors[item.field] = item.message;
			}
			
			throw {
			    name: "ValidationError",
			    message: errors
			};
		}

		let user = new UserModel(data.username, data.email);
        user.pwd = data.pword;
        return user;
    }

    static retrieve() {
        /*if( userList[uid] != {} ) {
            return userList[uid];
        } else {
            console.log(userList);
            return new Error("User not found");
        }*/
        return userList[userList.length - 1];
    }

    static update(uid, data){
        if( userList[uid] != {} ) {
            let user = userList[uid];
            Object.assign(user, data);
        } else {
            return new Error("User not found");
        }
    }

    static delete(uid) {
        if( userList[uid] != {} ) {
            delete userList[uid];
        } else {
            return new Error("User not found");
        }
    }
}

module.exports = UserService;