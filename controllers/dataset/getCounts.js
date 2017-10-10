var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


exports.request = function(req, res) { 
    queryStr = 'SELECT COUNT(logs.sd_id) AS count FROM logs WHERE logs.sd_id=$1;';
    params = [req.params.sd_id];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {
            res.status(200).send(result);
        }

    });
};