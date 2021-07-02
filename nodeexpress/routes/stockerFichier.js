const express = require('express');
const router = express.Router();
var multer= require('multer');
var telecharger = multer();
var sqlinsert = require('../data/sqlinsert');
var sqlSelect = require('../data/sqlSelect');
var JwtMiddleware = require('../middlewares/jwt').JwtMiddleware;

router.post('/stockerFichier', JwtMiddleware, telecharger.single("fileUp"), (req, res) => {
    var fileName = req.file.originalname;
    var mimeType = req.file.mimetype;
    var buffer = req.file.buffer;
    boucle = Math.round(buffer.length/1000000);
    if(boucle != 0){
        pas = Math.round(buffer.length/boucle);
        for(let i = 1, next = 0; i <= boucle; i++ ){
            sqlinsert.insertFichiers(fileName + i, mimeType, buffer.slice(next, next+=pas), (resultat) => {
            }, (error) => {
                console.log(error);
            });
        }
        return res.json({ message : "DONE" });
    } else {
        sqlinsert.insertFichiers(fileName, mimeType, buffer, (resultat) => {
        }, (error) => {
            console.log(error);
        })
        return res.json({ message : "DONE" });
    }
});

router.post('/telecharger', JwtMiddleware, (req, res) => {
    sqlSelect.getFichier(req.body.nomFichier, (result) => {
        return res.json(result);
    }, (erreur) => {
        return res.json({ message : "No where to be found !" });
    })
});

module.exports = router;