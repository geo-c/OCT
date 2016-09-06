var express = require('express');
var router = express.Router();

var queryTag = require('../controllers/query/tag');
var queryCategory = require('../controllers/query/category');
var point = require('../controllers/query/point');


// Query
router.get('/query/tag/:tag_name', queryTag.request);

router.get('/query/:category_name', queryCategory.request);

router.get('/query/point/:lat/:lon/:dst', point.request);

module.exports = router;