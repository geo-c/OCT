var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// GET
exports.request = function(req, res) {
    var queryStr = 'SELECT logs."timestamp"::timestamp::date as date, count(logs."timestamp"), app_name FROM public.logs INNER JOIN apps ON apps.app_hash=logs.app_hash WHERE logs."timestamp"::timestamp::date=$1 GROUP BY app_name, date ORDER BY date;';
    var params = [
        req.params.date
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
