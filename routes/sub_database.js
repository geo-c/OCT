var express = require('express');
var router = express.Router();

var list = require('../controllers/sub_database/list');


// LIST
router.get('/sub_database/:md_name', list.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
