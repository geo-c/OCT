var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// Count of Logs by Day
exports.request = function(req, res) {
    //queryStr = 'SELECT (SELECT COALESCE ((SELECT count(DISTINCT logs.category_id) AS Searches FROM public.logs WHERE logs."timestamp"::date = date \'' + req.params.date +'\' GROUP BY logs."timestamp"::date ORDER BY logs."timestamp"::date), 0) AS SEARCHES), (SELECT COALESCE ((SELECT count(DISTINCT logs.sd_id) FROM public.logs WHERE logs."timestamp"::date = date \'' + req.params.date +'\' GROUP BY logs."timestamp"::date ORDER BY logs."timestamp"::date), 0) AS API_Calls) ;';
    queryStr = "SELECT DISTINCT timestamp::date AS date, (SELECT count FROM logs_count WHERE logs_count.day::date=date AND logs_count.type='Usage_Category') AS Searches, (SELECT count FROM logs_count WHERE logs_count.day::date=date AND logs_count.type='Usage_Dataset') AS API_Calls FROM logs";
    params = [];

    client.query(queryStr, params, function (err, result) {
        if(err) {
        	console.log(err);
            res.status(404).send(_.extend(errors.database.error_2, err));
        } else {
            res.status(200).send(result);
        }

    });
};