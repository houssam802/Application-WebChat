var express = require('express');
var UserService = require('../services/service_user');
var jwt = require('jsonwebtoken');
var router = express.Router();
var sqlSelect = require('../data/sqlSelect');
const sqlinsert = require('../data/sqlinsert');



router.post('/photo', async function(req, res) {
  console.log(req.body);
  res.send('Received');
});

router.post('/inscrire', async function(req, res) {
  try {
    var utili = await UserService.create(req.body);
    sqlinsert.insert_utilisateur(utili,function(result){
      var token = jwt.sign({ user : result.JSON() }, "Secret");
      res.json(token);
      },function(err){
        if( err.search('\email\g') ){
          res.json({ message : { email : "Email déjà existe" } } );
        }
    });
  } catch (err) {
    res.json({ message : err.message });
  }
});


router.post('/auth', async function(req, res) {
  sqlSelect.verifier_user(req.body.nom,req.body.pwd, (result) => {
    var token = jwt.sign({ user : result.JSON() }, "Secret");
    res.json(token);
  }, (error) => {
    res.json({ message : error });
  });
});


router.get('/', async (req, res, next) => {
  var userFound = await UserService.retrieve(req.params.id);
  return res.status(201).json(userFound);
  /*try{
    var userFound = await UserService.retrieve(req.params.id);
    return res.status(201).json(userFound);
  } catch( err ) {
    return res.status(400).send(err);
  }*/
});

router.get('/list', async (req, res, next) => {
  sqlSelect.getUsers(function(result){
    console.log(result);
    res.json(result);
  })
});



// Update
router.put('/:id', async function(req, res, next) {
  var user = { username : "H" };
  try {
    await UserService.update(req.params.id, user);
    var newuser = await UserService.retrieve(req.params.id);
    return res.status(201).json(newuser);
  }  catch( err ) {
    return res.status(400).send(err);
  }
});

// Delete
router.delete('/:id', async function(req, res, next) {
  try {
    await UserService.delete(req.params.id);
    return res.status(201).send("User " + req.params.id + " was deleted successfully");
  }  catch( err ) {
    return res.status(400).send(err);
  }
});


module.exports = router;
