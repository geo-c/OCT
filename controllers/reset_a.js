var errors = require('./../config/errors');
var client = require('./db.js');
var _ = require('underscore');

var transporter = require('./../config/email.js').transporter;
var _mailOptions = require('./../config/email.js').mailOptions;
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');

// LIST
exports.request = function(req, res) {
    var queryStr = "SELECT * FROM public.codes WHERE codes.code=$1 WHERE NOW() > startdate::timestamptz AND NOW() - startdate::timestamptz <= interval '24 hours';";
    var params = [
    	req.params.code
    ];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
        	res.status(404).send(_.extend(errors.database.error_2, err));
        } else {
            if(result.length > 0) {
                var queryStr = "UPDATE public.apps SET active = 'false' WHERE apps.app_hash = $1;";
                var params = [
                    reult[0].app_hash
                ];

                client.query(queryStr, params, function (err, result) {
                    if(err) {
                        //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                        res.status(404).send(_.extend(errors.database.error_2, err));
                    } else {
                        res.status(200).send("deleted")
                    }
                }); 
            }
        }
    });
};