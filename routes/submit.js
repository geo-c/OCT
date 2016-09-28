var express = require('express');
var router = express.Router();

var submit = require('../controllers/submit/submit');


// SIGN UP
router.post('/submit', submit.request);


module.exports = router;
