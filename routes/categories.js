var express = require('express');
var router = express.Router();

var list = require('../controllers/categories/list');
var categoryByApp = require('../controllers/categories/byApp');
var byDate = require('../controllers/categories/byDate');
var withDatasets = require('../controllers/categories/withDatasets');
var withDatasetsByCategory = require('../controllers/categories/withDatasetsByCategory');

// GET all categories with logged searches
router.get('/categories', list.request);

//GET all apps that searched for category with count of calls
router.get('/categories/:category_id/apps', categoryByApp.request);

//CategoryByDate
router.get('/categories/byDate/:date', byDate.request);

router.get('/categories/withDatasets', withDatasets.request);

router.get('/categories/withDatasets/:category_id', withDatasetsByCategory.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
