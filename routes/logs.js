var express = require('express');
var router = express.Router();

var list = require('../controllers/logs/list');
var countByDay = require('../controllers/logs/countByDay');


// LIST
router.get('/apps/:app_name/logs', list.request);

// Count of Logs by Day
router.get('/logs/countByDay', countByDay.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE


module.exports = router;
