var express = require('express');
var router = express.Router();

var add = require('../controllers/spatial/add');


//Add spatial Information
router.get('/spatial/add/:md_id', add.request);


module.exports = router;
