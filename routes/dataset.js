var express = require('express');
var router = express.Router();

var list = require('../controllers/dataset/list');
var byApp = require('../controllers/dataset/byApp');


//Get all apps
router.get('/tdataset', list.request);
router.get('/tdataset/:sd_id', byApp.request);


// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE

module.exports = router;
