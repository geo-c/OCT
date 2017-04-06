var errors = require('./../config/errors');
var client = require('./db.js');
var _ = require('underscore');

var jwt = require('jsonwebtoken');
var secret = require('./../config/secret');

var transporter = require('./../config/email.js').transporter;
var _mailOptions = require('./../config/email.js').mailOptions;
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');

var Ajv = require('ajv');
var schema = require('./../models/app');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// POST
exports.request = function(req, res) {

	// Schema Validation
	var valid = validate(req.body);
	if (!valid) {
		res.status(errors.schema.error_1.code).send(_.extend(errors.schema.error_1, {
			err: validate.errors[0].dataPath + ": " + validate.errors[0].message
		}));
		return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
	} else {

		// Create Access-Token
		accessToken = jwt.sign({
			app_name: req.body.app_name
		}, secret.key);
		
        // Database Query
        client.query('INSERT INTO Apps VALUES(now(), now(), $1, $2, $3, $4, $5, $6);', [
            req.body.app_name,
            accessToken,
            req.body.app_description,
            req.body.email_address,
            req.body.first_name,
            req.body.last_name
        ], function(err, result) {

            if (err) {
                res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
				return console.error(errors.database.error_2.message, err);
            } else {

                // Database Query
                client.query('SELECT * FROM Apps WHERE app_name=$1;', [
                    req.body.app_name
                ], function(err, result) {

                    if (err) {
						res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
						return console.error(errors.database.error_2.message, err);
                    } else {

                        // Check if App exists
                        if (result.length === 0) {
                            res.status(errors.query.error_1.code).send(errors.query.error_1);
                            console.error(errors.query.error_1.message);
                        } else {

							// Prepare result
							var app = result[0];

                            // Read Template
                            fs.readFile(path.join(__dirname, '../templates/registration.html'), function(err, data) {
                                if (err) throw err;

                                // Render HTML-content
                                var output = mustache.render(data.toString(), app);
                                console.log(app);
                                console.log(output);

                                // Create Text for Email-Previews and Email without HTML-support
                                var text =
                                    'Hello ' + app.first_name + ' ' + app.last_name + '\n' +
                                    'Your new Access-Token has been generated!\n\n\n' +
                                    app.hash_token + 
                                    'OCT - Institute for Geoinformatics (Heisenbergstraße 2, 48149 Münster, Germany)';

                                // Set Mail options
                                var mailOptions = {
                                    from: _mailOptions.from,
                                    to: app.email_address,
                                    subject: 'Registration successful',
                                    text: text,
                                    html: output
                                };

                                // Send Email
                                transporter.sendMail(mailOptions, function(error, info) {
                                    if (error) {
                                        return console.log(error);
                                    } else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });
                            });

                            // Send Result
                            res.status(201).send(app);
                        }
                    }
                });
            }
        });
	}
};
