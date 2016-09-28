var express = require('express');
var router = express.Router();

var list = require('../controllers/main_database/list');
var listAll = require('../controllers/main_database/listAll');


// LIST
router.get('/main_database', list.request);

router.get('/database_all', listAll.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
