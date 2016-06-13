var express = require('express');
var router = express.Router();

var post = require('../controllers/signup');


// SIGN UP
router.post('/signup', post.request);


module.exports = router;
