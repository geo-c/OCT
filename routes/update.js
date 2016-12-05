var express = require('express');
var router = express.Router();

var update = require('../controllers/update/update');


// SIGN UP
router.post('/update', update.request);


module.exports = router;
