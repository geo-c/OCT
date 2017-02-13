var express = require('express');
var router = express.Router();

var stats = require('../controllers/stats/stats');

//Log in to an existing admin acount
router.get('/statistics', stats.request);


module.exports = router;