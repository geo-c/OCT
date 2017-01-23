var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// LIST
exports.request = function(req, res) {
    var queryStr = 'SELECT apps.app_hash, apps.app_name, apps.app_description, (SELECT COUNT(logs.category_id) FROM public.logs WHERE logs.app_hash = apps.app_hash) AS Searches, (SELECT COUNT(logs.sd_id) FROM public.logs WHERE logs.app_hash = apps.app_hash) AS API_Calls FROM public.apps;';
    var params = [];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
        } else {
            res.status(200).send(result);
        }
    });
};
