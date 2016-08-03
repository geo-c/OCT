var express = require('express');
var router = express.Router();

var list = require('../controllers/categories/list');
var categoryByApp = require('../controllers/categories/byApp');
var byDate = require('../controllers/categories/byDate');

// LIST
router.get('/categories', list.request);

//CategoryByApp
router.get('/categories/:category_id/apps', categoryByApp.request);

//CategoryByDate
router.get('/categories/byDate/:date', byDate.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
