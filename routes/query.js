var express = require('express');
var router = express.Router();

var queryTag = require('../controllers/query/tag');
var queryCategory = require('../controllers/query/category');


// Query
router.get('/query/tag/:tag', queryTag.request);

router.get('/query/category/:category', queryCategory.request);

module.exports = router;