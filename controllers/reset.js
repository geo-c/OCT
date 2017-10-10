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
    var queryStr = 'SELECT * FROM public.apps WHERE apps.app_hash=$1;';
    var params = [
    	req.params.app_hash
    ];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
        	res.status(404).send(_.extend(errors.database.error_2, err));
        } else {
            if(result.length > 0) {
            	app = result[0];

            	// Read Template
                fs.readFile(path.join(__dirname, '../templates/deletion.html'), function(err, data) {
                    if (err) throw err;

                    // Render HTML-content
                    var output = mustache.render(data.toString(), app);

                    var code = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
                    console.log(code);
                    var queryStr = 'INSERT INTO codes (created, code, app_hash) VALUES(now(), $1, $2);';
				    var params = [
				    	code,
				    	req.params.app_hash
				    ];

				    /*client.query(queryStr, params, function (err, result) {
				        if(err) {
				            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
				        	res.status(404).send(_.extend(errors.database.error_2, err));
				        } else {

				        }
				    });*/

                    app.generatedLink = 'http://giv-oct.uni-muenster.de:8081/api/reset/a/' + code;



                    // Create Text for Email-Previews and Email without HTML-support
                    var text =
                        'Hello ' + app.first_name + ' ' + app.last_name + '\n' +
                        'If you want to delete your application please click on the following link. It is available for 24 hours. \n\n\n' +
                        'If you did not want to delete your account just ignore this message. \n\n\n'+
                        app.generatedLink + 
                        'OCT - Institute for Geoinformatics (Heisenbergstraße 2, 48149 Münster, Germany)';

                    var to = '"' + result[0].email_address + '"';

                    // Set Mail options
                    var mailOptions = {
                        from: _mailOptions.from,
                        to: to,
                        subject: 'Delete Application',
                        text: text,
                        html: output
                    };

                    // Send Email
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                        	console.log(error);
                        	console.log(info);
                            return console.log(error);
                        } else {
                            console.log('Message sent: ' + info.response);
                        }
                    });
                });
            }
        }
    });
};