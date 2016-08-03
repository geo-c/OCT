var express = require('express');
var router = express.Router();

var signup = require('../controllers/admin/signup');
var login = require('../controllers/admin/login');


// SIGN UP
router.post('/admin/signup', signup.request);

router.get('/admin/login/:username', login.request);


module.exports = router;
