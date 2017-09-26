var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// LIST
exports.request = function(req, res) {
    var queryStr = 'SELECT COUNT(logs.category_id) AS Searches, COUNT(logs.sd_id) AS API_Calls FROM public.logs WHERE logs.app_hash = $1;';
    var params = [req.params.app_hash];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
        	res.status(404).send(_.extend(errors.database.error_2, err));
        } else {
            res.status(200).send(result);
        }
    });
};
