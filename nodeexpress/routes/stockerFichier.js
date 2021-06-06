const express = require('express');
const router = express.Router();
var multer= require('multer');
var telecharger = multer();
var sqlinsert = require('../data/sqlinsert');

router.post('/stockerFichier', telecharger.single("fileUp"), (req, res) => {
    var fileName = req.file.originalname;
    var mimeType = req.file.mimetype;
    var buffer = req.file.buffer;
    sqlinsert.insertFile(fileName, mimeType, buffer, (resultat) => {
        console.log(resultat);
    }, (erreur) => {
        console.log(erreur);
    })
});

module.exports = router;