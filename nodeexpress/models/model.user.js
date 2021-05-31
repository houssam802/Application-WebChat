var crypto =require('crypto');

class UserModel {
   #id
   #nom
   #email
   #salt = '10ae14f3fdea2eaecbc29df91bacead2'
   #hash
   constructor(nom, email, id = null) {
      this.#id = id;
      this.#nom = nom;
      this.#email = email;
   }

   set id(id){
      this.#id=id;
   }
   
   set pwd(mdp){
      // Hashing user's salt and password with 1000 iterations, 
      this.#hash = crypto.pbkdf2Sync(mdp, this.#salt, 1000, 64, `sha512`).toString(`hex`); 
   }

   set hash(hash){
      this.#hash=hash;
   }

   get nom() {
       return this.#nom;
   }

   get email() {
      return this.#email;
   }

   get pword() {
      return this.#hash;
   }
    
   verify(mdp){
      var hash = crypto.pbkdf2Sync(mdp,this.#salt, 1000, 64, `sha512`).toString(`hex`); 
      return this.#hash === hash; 
   }

   displayInfo(){
      return this.#nom + "," + this.#email + "," + this.#hash;
   }

   JSON(){
      return {
         id : this.#id,
         nom : this.#nom
      }
   }

}
  


module.exports = UserModel;