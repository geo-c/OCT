var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');

var bcrypt = require('bcrypt');
var secret = require('./../../config/secret');


// GET
exports.request = function(req, res) {
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;
    // Connect to Database
    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {
            // Database Query
            client.query('SELECT username, email_address, password FROM Admins WHERE username = $1;', [
                req.params.username
            ], function(err, result) {
                if (err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {

                    // Check if Admin exists
                    if (result.rows.length === 0) {
                        res.status(errors.query.error_1.code).send(errors.query.error_1);
                        console.error(errors.query.error_1.message);
                    } else {                            //verify password
                        if(bcrypt.hashSync(req.params.password, secret.key) === result.rows[0].password) {
                            res.status(201).send(result.rows[0]);
                        } else {
                            res.status(errors.authentication.error_3.code).send(errors.authentication.error_3.message)
                        }                        
                    }
                }
            });
        }
    });
    
};