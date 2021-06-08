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

router.get('/list/amies/:id', JwtMiddleware ,(req, res) => {
    sqlSelect.get_all_chats(req.params.id, (amies) => {
        res.json(amies);
    }, (error) => {
        res.json(error);
    });
});

router.get('/msgs/:ids', JwtMiddleware ,(req, res) => {
    const ids = req.params.ids.split('_');
    sqlSelect.get_chat(ids[0],ids[1], (msgs) => {
        res.json(msgs);
    }, (error) => {
        res.json(error);
    });
});

module.exports = router;