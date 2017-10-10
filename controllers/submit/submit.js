var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');

var Ajv = require('ajv');
var schema = require('./../../models/dataset');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// POST
exports.request = function(req, res) {
	console.log("SUBMIT SOME DATA");
	console.log(req.body);
	var valid = validate(req.body);
	if (!valid) {
		res.status(errors.schema.error_1.code).send(_.extend(errors.schema.error_1, {
			err: validate.errors[0].dataPath + ": " + validate.errors[0].message
		}));
		return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
	} else {

		var queryStr = "INSERT INTO Datastores (created, updated, ds_type, ds_description, ds_host, ds_port, db_instance, db_user, db_password) VALUES (now(), now(), $1, $2, $3, $4, $5, $6, $7) RETURNING ds_id;";
		var params = [
			req.body.ds_type,
    		req.body.ds_description,
    		req.body.ds_host,
    		req.body.ds_port,
    		req.body.db_instance,
    		req.body.db_user,
    		req.body.db_password
		]

	    client.query(queryStr, params, function (err, result) {
	        if(err) {
	            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
	            return console.error(errors.database.error_2.message, err);
	        } else {
	            var ds_id = result[0].ds_id;
	            var queryStr = "INSERT INTO main_datasets (created, updated, ds_id, endpoint_id, created_by, md_name, md_description, publisher, published, license) VALUES (now(), now(), $1, 1, $2, $3, $4, '','', '') RETURNING md_id;";
				var params = [
					ds_id,
    				req.body.created_by,
    				req.body.md_name,
    				req.body.md_description
				]

				client.query(queryStr, params, function (err, result) {
			        if(err) {
			            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
			            return console.error(errors.database.error_2.message, err);
			        } else {
			        	console.log("1");
			        	var md_id = result[0].md_id
			        	var queryStr = "INSERT INTO sub_datasets (created, updated,md_id, sd_name, sd_description) VALUES (now(), now(), $1, $2, $3) RETURNING sd_id;";
			        	var params = [
			        		md_id,
    						req.body.sd_name,
    						req.body.sd_description
			        	];

			        	client.query(queryStr, params, function (err, result) {
					        if(err) {
					            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
					            return console.error(errors.database.error_2.message, err);
					        } else {
					        	console.log("2");
					        	var sd_id = result[0].sd_id
					            var queryStr = "INSERT INTO queries (created, updated, sd_id, query_intern, query_extern, query_description, active) VALUES (now(), now(), $1, $2, $3, $4, 'True');";
							    var params = [
							        sd_id,
    								req.body.query_intern,
    								req.body.query_extern,
    								req.body.query_description
							    ];

							    client.query(queryStr, params, function (err, result) {
							        if(err) {
							            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
							            return console.error(errors.database.error_2.message, err);
							        } else {
							        	console.log("3");
							        	for(i in req.body.categories) {
								        	category_name = req.body.categories[i];
								            var queryStr = "SELECT category_id FROM categories WHERE category_name = $1 ";
										    var params = [
										        category_name
										    ];

										    client.query(queryStr, params, function (err, result) {
										        if(err) {
										            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
										            return console.error(errors.database.error_2.message, err);
										        } else {
										        	console.log("4");
										            var queryStr = "INSERT INTO categories_relationships (created, updated, md_id, category_id) VALUES (now(), now(), $1, $2)";
												    var params = [
												        md_id,
    													result[0].category_id
												    ];

												    client.query(queryStr, params, function (err, result) {
												        if(err) {
												            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
												            return console.error(errors.database.error_2.message, err);
												        } else {
												        	console.log("5");
												            res.status(200).send("Eingefügt");
												        }
												    });
										        }
										    });
										}
							        }
							    });
					        }
					    });
			        }

			    });

	        }
	    });

	}

	/*
	console.log(req.body);

	// Schema Validation
	var valid = validate(req.body);
	if (!valid) {
		res.status(errors.schema.error_1.code).send(_.extend(errors.schema.error_1, {
			err: validate.errors[0].dataPath + ": " + validate.errors[0].message
		}));
		return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
	} else {

	    // Create URL
	    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;
	    // Connect to Database
	    pg.connect(url, function(err, client, done) {
	        if (err) {
				res.status(errors.database.error_1.code).send(errors.database.error_1);
				return console.error(errors.database.error_1.message, err);
	        } else {
	        	console.log(req.body);
	        	query = "INSERT INTO Datastores (created, updated, ds_type, ds_description, ds_host, ds_port, db_instance, db_user, db_password) VALUES (now(), now(), $1, $2, $3, $4, $5, $6, $7) RETURNING ds_id;";
        		params = [
        			req.body.ds_type,
	        		req.body.ds_description,
	        		req.body.ds_host,
	        		req.body.ds_port,
	        		req.body.db_instance,
	        		req.body.db_user,
	        		req.body.db_password
        		]
	        	client.query(query, params, function (err, result) {
	        		if(err) {
	        			console.log(err);
	        			res.status(404).send(err);
	        		} else {
	        			var ds_id = result.rows[0].ds_id;
	        			client.query("INSERT INTO main_datasets (created, updated, ds_id, endpoint_id, created_by, md_name, md_description, publisher, published, license) VALUES (now(), now(), $1, 1, $2, $3, $4, '','', '') RETURNING md_id;", [
	        				ds_id,
	        				req.body.created_by,
	        				req.body.md_name,
	        				req.body.md_description,

	        			], function (err, result) {
	        				if(err) {
	        					console.log(err);
	        					res.status(404).send(err);
	        				} else {
	        					var md_id = result.rows[0].md_id
	        					client.query("INSERT INTO sub_datasets (created, updated,md_id, sd_name, sd_description) VALUES (now(), now(), $1, $2, $3) RETURNING sd_id;", [
	        						md_id,
	        						req.body.sd_name,
	        						req.body.sd_description
	        					], function (err, result) {
	        						if(err) {
	        							console.log(err);
	        							res.status(404).send(err);
	        						} else {
	        							var sd_id = result.rows[0].sd_id
	        							client.query("INSERT INTO queries (created, updated, sd_id, query_intern, query_extern, query_description, active) VALUES (now(), now(), $1, $2, $3, $4, 'True');", [
	        								sd_id,
	        								req.body.query_intern,
	        								req.body.query_extern,
	        								req.body.query_description
	        							], function (err, result) {
	        								if(err) {
	        									console.log(err);
	        									res.status(404).send(err);
	        								} else {
	        									for(i in req.body.categories) {
	        										category_name = req.body.categories[i];
	        										client.query("SELECT category_id FROM categories WHERE category_name = $1 ", [
	        											category_name
	        										], function (err, result) {
	        											if(err) {
	        												console.log(err);
	        												res.status(404).send(err);
	        											} else {
	        												client.query("INSERT INTO categories_relationships (created, updated, md_id, category_id) VALUES (now(), now(), $1, $2)", [
	        													md_id,
	        													result.rows[0].category_id
	        												], function (err, result) {
	        													if(err) {
	        														console.log(err);
	        														res.status(404).send(err);
	        													} else {
	        														res.status(200).send("Eingefügt");
	        													}
	        												});
	        											}
	        										});
	        									}
	        								}
	        							});
	        						}
	        					});
	        				}
	        			});
	        		}
	        	});	
	        }
	    });
	}*/


	
};
