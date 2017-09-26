var express = require('express');
var router = express.Router();

var update = require('../controllers/update/update');
var update_count = require('../controllers/update_count');


// SIGN UP
router.post('/update', update.request);
router.get('/update_count', update_count.request);


module.exports = router;
