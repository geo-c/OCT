var express = require('express');
var router = express.Router();

var list = require('../controllers/tags/list');
var tagByApp = require('../controllers/tags/byApp');

// LIST
router.get('/tags', list.request);

//TagByApp
router.get('/tags/:tag_id/apps', tagByApp.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
