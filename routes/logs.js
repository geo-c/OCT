var express = require('express');
var router = express.Router();

var list = require('../controllers/logs/list');


// LIST
router.get('/apps/:app_name/logs', list.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE


module.exports = router;
