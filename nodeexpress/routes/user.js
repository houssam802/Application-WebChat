
var express     = require('express');
var UserService = require('../services/service_user');
var jwt         = require('jsonwebtoken');
var router      = express.Router();
var sqlSelect   = require('../data/sqlSelect');
var sqlinsert   = require('../data/sqlinsert');
var sqldelete   = require('../data/sqldelete');
var sqlupdate = require('../data/sqlupdate');
var service_jwt = require('../services/service_jwt');
var multer      = require('multer');
var telecharger = multer();

router.post('/inscrire', telecharger.single('fileUp'), async function(req, res) {
  try {
    var utilisateur = await UserService.create(req.body);
    // Si la photo n'est pas remplie .
    if( !req.file ) {
      sqlinsert.insert_utilisateur(utilisateur, function(result){
        res.json({
          user : { nom: req.body.nomutil, pwd: req.body.pword },
          accessToken : service_jwt.getAccessToken(result.JSON()),
          refreshToken : service_jwt.getRefreshToken(result.JSON())
        });
      },function(err){
        if( err.search("nom") != -1 ){
          res.json({ message : { nom : "Nom déjà existe" } } );
        }
        if( err.search("email") != -1 ){
          res.json({ message : { email : "Email déjà existe" } } );
        }
      });
    } else {
      var mimeType = req.file.mimetype;
      var buffer = req.file.buffer;
      sqlinsert.insert_utilisateur(utilisateur, mimeType, buffer, function(result){
        res.json({
          user : { nom: req.body.nomutil, pwd: req.body.pword },
          accessToken : service_jwt.getAccessToken(result.JSON()),
          refreshToken : service_jwt.getRefreshToken(result.JSON())
        });
      },function(err){
        if( err.search("nom") != 1 ){
          res.json({ message : { nom : "Nom déjà existe" } } );
        }
        if( err.search("email") != -1 ){
          res.json({ message : { email : "Email déjà existe" } } );
        }
      });
    }
  } catch (err) {
    res.json({ message : err.message });
  }
});


router.post('/auth', async function(req, res) {
  sqlSelect.verifier_user(req.body.nom,req.body.pwd, (result) => {
    res.json({
      user : result.JSON(),
      accessToken : service_jwt.getAccessToken(result.JSON()),
      refreshToken : service_jwt.getRefreshToken(result.JSON()) 
    });
  }, (error) => {
    res.json({ message : error });
  });
});



router.post('/search', async function(req, res) {
  sqlSelect.select_infos_users_plus_demande(req.body.id,req.body.nom, (result) => {
    res.json(result);
  }, (error) => {
    res.json({ message : error });
  });
});


router.put('/demande_amie',async function(req, res) {
  sqlinsert.demande_amie(req.body.id_emet,req.body.id_dest);
});

router.delete('/annule_demande_amie/:ids',async function(req,res){
  const ids = req.params.ids.split('_');
  sqldelete.annuler_demmande_amie(ids[0],ids[1]);
});

router.put('/accepter_demande_amie',async function(req, res) {
  sqlupdate.accept_demande_amie(req.body.id_emet,req.body.id_dest);
});

router.get('/:id', async (req, res, next) => {
  var id = req.params.id;
  sqlSelect.select_id_util(id, (response) => {
    res.send(response);
  }, (error) => {
    res.send({ message : error });
  });
});


// Update
router.put('/:id', telecharger.single('fileUp1'), async function(req, res, next) {
  try {
    var utilisateur = await UserService.create(req.body);
    // Si la photo n'est pas remplie .
    if( !req.file ) {
      sqlupdate.updateProfile(utilisateur, req.body.id, function(result){
        res.json({
          user : { nom: req.body.nomutil, pwd: req.body.pword }
        });
      },function(err){
        if( err.search("nom") != -1 ){
          res.json({ message : { nom : "Nom déjà existe" } } );
        }
        if( err.search("email") != -1 ){
          res.json({ message : { email : "Email déjà existe" } } );
        }
      });
    } else {
      var mimeType = req.file.mimetype;
      var buffer = req.file.buffer;
      sqlupdate.updateProfile(utilisateur, req.body.id, mimeType, buffer, function(result){
        res.json({
          user : { nom: req.body.nomutil, pwd: req.body.pword }
        });
      },function(err){
        if( err.search("nom") != 1 ){
          res.json({ message : { nom : "Nom déjà existe" } } );
        }
        if( err.search("email") != -1 ){
          res.json({ message : { email : "Email déjà existe" } } );
        }
      });
    }
  } catch (err) {
    res.json({ message : err.message });
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



router.post('/refresh-token', function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(403).send('Access is forbidden');
  }

  try {
    const nouveauAccessToken = service_jwt.refreshtoken(refreshToken);
    res.send(nouveauAccessToken);
  } catch (err) {
    const message = (err && err.message) || err;
    res.status(403).send(message);
  }
});

module.exports = router;
