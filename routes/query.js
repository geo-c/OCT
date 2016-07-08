var express = require('express');
var router = express.Router();

var queryTag = require('../controllers/query/tag');
var queryCategory = require('../controllers/query/category');


// Query
router.get('/query/tag/:tag_name', queryTag.request);

router.get('/query/category/:category_name', queryCategory.request);

module.exports = router;