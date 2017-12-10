var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// LIST
exports.request = function(req, res) {
    var queryStr = "SELECT apps.app_hash, apps.app_name, apps.app_description, apps.type, apps.url, (SELECT count FROM public.logs_count WHERE logs_count.app_hash = apps.app_hash and logs_count.type='App_Category') AS Searches, (SELECT count FROM public.logs_count WHERE logs_count.app_hash = apps.app_hash AND logs_count.type='App_Dataset') AS API_Calls FROM public.apps;";
    var params = [];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
        	res.status(404).send(_.extend(errors.database.error_2, err));
        } else {          
            res.status(200).send(result);
        }
    });
};
