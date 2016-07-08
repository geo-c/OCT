var express = require('express');
var router = express.Router();

var list = require('../controllers/categories/list');
var categoryByApp = require('../controllers/categories/byApp');

// LIST
router.get('/categories', list.request);

//TagByApp
router.get('/categories/:category_id/apps', categoryByApp.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
