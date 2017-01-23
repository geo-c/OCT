var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// LIST
exports.request = function(req, res) {

    var queryStr = 'SELECT sd_name, sd_description FROM Sub_Datasets INNER JOIN Main_Datasets ON Sub_Datasets.md_id = Main_Datasets.md_id WHERE Main_Datasets.md_name=$1';
    var params = [
        req.params.md_name
    ];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {
            res.status(200).send(result);
        }
    });
    
};
