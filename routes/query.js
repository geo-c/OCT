var express = require('express');
var router = express.Router();

var post = require('../controllers/query');


// LOGIN
router.post('/query', post.request);


module.exports = router;