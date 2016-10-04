var express = require('express');
var router = express.Router();

var queryCategory = require('../controllers/query/category');
var point = require('../controllers/query/point');
var getDataset = require('../controllers/query/getDataset');
var check = require('../controllers/query/check');


router.get('/query/:category_name', queryCategory.request);

router.get('/query/point/:lat/:lon/:dst', point.request);

router.get('/dataset/:query_extern', getDataset.request);

router.post('/querycheck', check.request);

module.exports = router;