var express = require('express');
var router = express.Router();

var list = require('../controllers/apps/list');


// LIST
router.get('/apps', list.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
