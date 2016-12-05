var express = require('express');
var router = express.Router();

var list = require('../controllers/main_database/list');
var listAll = require('../controllers/main_database/listAll');
var listAllUser = require('../controllers/main_database/listAllUser');


// LIST
router.get('/main_database', list.request);

router.get('/database_all', listAll.request);

router.get('/database_all/:username', listAllUser.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;