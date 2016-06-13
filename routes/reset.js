var express = require('express');
var router = express.Router();

var post = require('../controllers/reset');


// RESET
router.post('/reset', post.request);


module.exports = router;
