var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// Count of Logs by Day
exports.request = function(req, res) {

    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {
            client.query('SELECT c.category_id, c.category_name, count(logs.category_id) AS Searches, (SELECT COUNT(cr.md_id) FROM categories_relationships cr WHERE cr.category_id=c.category_id) AS Datasets FROM public.categories c INNER JOIN logs ON c.category_id=logs.category_id GROUP BY c.category_name, c.category_id ORDER BY c.category_name;', function(err, result) {
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
