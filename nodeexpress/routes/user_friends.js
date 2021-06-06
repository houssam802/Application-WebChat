var express = require('express');
var router = express.Router();
var sqlSelect = require('../data/sqlSelect');
const sqlinsert = require('../data/sqlinsert');


router.get('/friends/list', async (req, res, next) => {
    sqlSelect.getUsers(function(result){
      console.log(result);
      res.json(result);
    })
});


module.exports = router;