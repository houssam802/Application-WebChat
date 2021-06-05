var express = require('express');
var router = express.Router();
var sqlSelect = require('../data/sqlSelect');
var JwtMiddleware = require('../middlewares/jwt').JwtMiddleware;

router.get('/list/:id', JwtMiddleware ,(req, res) => {
    sqlSelect.select_infos_amies(req.params.id, (amies) => {
        res.json(amies);
    }, (error) => {
        res.json(error);
    });
});

module.exports = router;