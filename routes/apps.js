var express = require('express');
var router = express.Router();

var list = require('../controllers/apps/list');
var byDate = require('../controllers/apps/byDate');


// LIST
router.get('/apps', list.request);
router.get('/apps/byDate/:date', byDate.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
