var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// GET
exports.request = function(req, res) {
    queryStr = 'SELECT apps.app_name, COUNT(logs.app_hash) from apps INNER JOIN logs ON apps.app_hash=logs.app_hash WHERE logs.sd_id=$1 GROUP BY apps.app_name;';
    params = [req.params.sd_id];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {
            res.status(200).send(result);
        }

    });

    /*var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {
            // Database Query
            client.query('SELECT apps.app_name, COUNT(logs.app_hash) from apps INNER JOIN logs ON apps.app_hash=logs.app_hash WHERE logs.sd_id=$1 GROUP BY apps.app_name;', [
                req.params.sd_id
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
