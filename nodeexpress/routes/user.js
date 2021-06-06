var express     = require('express');
var UserService = require('../services/service_user');
var jwt         = require('jsonwebtoken');
var router      = express.Router();
var sqlSelect   = require('../data/sqlSelect');
var sqlinsert   = require('../data/sqlinsert');
var service_jwt = require('../services/service_jwt');
var multer      = require('multer');
var telecharger = multer();

let secret = 'some_secret'; // a secret key is set here

router.post('/inscrire', telecharger.single('fileUp'), async function(req, res) {
  try {
    var utilisateur = await UserService.create(req.body);
    // Si la photo n'est pas remplie .
    if( !req.file ) {
      sqlinsert.insert_utilisateur(utilisateur, function(result){
        res.json({
          user : result.JSON(),
          accessToken : service_jwt.getAccessToken(result.JSON()),
          refreshToken : service_jwt.getRefreshToken(result.JSON()) 
        });
      },function(err){
        // TODO Ajouter unicité nom d'utilisateur .
        if( err.search('\email\g') ){
          res.json({ message : { email : "Email déjà existe" } } );
        }
      });
    } else {
      var mimeType = req.file.mimetype;
      var buffer = req.file.buffer;
      sqlinsert.insert_utilisateur(utilisateur, mimeType, buffer, function(result){
        var token = jwt.sign({ user : result.JSON() }, "Secret");
        res.json(token);
      },function(err){
        // TODO Ajouter unicité nom d'utilisateur .
        if( err.search('\email\g') ){
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


router.get('/:id', async (req, res, next) => {
  var id = req.params.id;
  sqlSelect.select_id_util(id, (response) => {
    res.send(response);
  }, (error) => {
    res.send({ message : error });
  });
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


app.post('/refresh-token', function (req, res) {
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
