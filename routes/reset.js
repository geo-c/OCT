var express = require('express');
var router = express.Router();

var delete_ = require('../controllers/reset');
var delete_a = require('../controllers/reset_a');


// RESET
router.get('/reset/:app_hash', delete_.request);
router.get('/reset/a/:code', delete_a.request);


module.exports = router;
