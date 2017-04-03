var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// LIST
exports.request = function(req, res) {

    var queryStr = 'SELECT logs.timestamp, latitude, longitude, query_extern AS dataset, app_name FROM visitors INNER JOIN logs ON visitors.id = logs.location_id INNER JOIN queries ON queries.sd_id = logs.sd_id INNER JOIN apps ON logs.app_hash = apps.app_hash ';
    var params = [];

    var flagWhere = false;

    

    switch(req.params.status) {
        case('app'):
            queryStr += 'WHERE apps.app_name = $1';
            params.push(req.params.value);
            flagWhere = true;
            break;
        case('dataset'):
            queryStr += 'WHERE queries.query_extern = $1';
            params.push(req.params.value);
            flagWhere = true;
            break;
        default:
            break;
    }

    if(req.params.timeFrom != null && req.params.timeFrom != "") {
        if(flagWhere == false) {
            queryStr += ' WHERE ';
        } else {
            queryStr += ' AND ';
        }
        flagWhere = true;
        if(req.params.timeTo != null && req.params.timeTo != "") {
            queryStr += "timestamp BETWEEN to_date('" + req.params.timeFrom + "', 'YYYY-MM-DD'::text) AND to_date('" +  req.params.timeTo + "', 'YYYY-MM-DD'::text) ";
        } else {
            queryStr += "timestamp BETWEEN to_date('" + req.params.timeFrom + "', 'YYYY-MM-DD'::text) AND now() ";
        }
    }
    
    queryStr += ';';


    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {

            res.status(200).send(result);
        }

    });
};