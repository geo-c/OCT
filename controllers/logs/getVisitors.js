var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// LIST
exports.request = function(req, res) {

    var queryStr = 'SELECT logs.sd_id, logs.timestamp, latitude, longitude FROM visitors LEFT JOIN logs ON visitors.id = logs.location_id';
    var params = [];

    var flagWhere = false;

    /*

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
            queryStr += 'timestamp BETWEEN ' + req.params.timeFrom + '::timestamp AND ' +  req.params.timeTo + '::timestamp ';
        } else {
            queryStr += 'timestamp BETWEEN ' + req.params.timeFrom + '::timestamp AND now()::timestamp ';
        }
    }
    */
    queryStr += ';';

    
    
    console.log(queryStr);

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {

            res.status(200).send(result);
        }

    });
};