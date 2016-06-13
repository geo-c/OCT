var express = require('express');
var router = express.Router();

var post = require('../controllers/query');


// LOGIN
router.get('/query', post.request);


module.exports = router;