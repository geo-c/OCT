var express = require('express');
var router = express.Router();

var list = require('../controllers/main_database/list');


// LIST
router.get('/main_database', list.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
