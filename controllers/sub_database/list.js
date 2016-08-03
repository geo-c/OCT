var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// LIST
exports.request = function(req, res) {
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {

            // Database Query
            client.query('SELECT sd_name, sd_description FROM Sub_Datasets INNER JOIN Main_Datasets ON Sub_Datasets.md_id = Main_Datasets.md_id WHERE Main_Datasets.md_name=$1',[
                req.params.md_name
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
    });
};
