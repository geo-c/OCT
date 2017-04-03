var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');

// GET
exports.request = function(req, res) {

    queryStr = 'SELECT apps.app_name, COUNT(logs.category_id) from apps INNER JOIN logs ON apps.app_hash=logs.app_hash WHERE logs.category_id=$1 GROUP BY apps.app_name;';
    params = [req.params.category_id];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {
            res.status(200).send(result);
        }

    });

    /*
    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {
            // Database Query
            client.query('SELECT apps.app_name, COUNT(logs.category_id) from apps INNER JOIN logs ON apps.app_hash=logs.app_hash WHERE logs.category_id=$1 GROUP BY apps.app_name;', [
                req.params.category_id
            ], function(err, result) {
                done();
                if (err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {

                    // Send Result
                    res.status(200).send(result.rows);
                }
            });
        }
    });*/
};
