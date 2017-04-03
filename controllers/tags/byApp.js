var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// LIST
exports.request = function(req, res) {

    var queryStr = 'SELECT apps.app_name, COUNT(logs.tag_id) from apps INNER JOIN logs ON apps.app_hash=logs.app_hash WHERE logs.tag_id=$1 GROUP BY apps.app_name;';
    var params = [
        req.params.tag_id
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
