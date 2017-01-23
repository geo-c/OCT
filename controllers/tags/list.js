var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// Count of Logs by Day
exports.request = function(req, res) {

    var queryStr = 'SELECT tags.tag_id, tags.tag_name, count(logs.tag_id) AS calls FROM public.tags INNER JOIN logs ON tags.tag_id=logs.tag_id GROUP BY tags.tag_name, tags.tag_id ORDER BY tags.tag_name;';
    var params = [];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            es.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {
            res.status(200).send(result);
        }
    });

};
