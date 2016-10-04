var pg = require("pg");
var Postgres_Result = require('./Postgres_Result.js');

/**
 * Constructs a single DbClient object.
 *
 * Uses the singleton pattern to allow only one instance of this class. Connects to the database automatically.
 */
var Postgres_Client = function(host, port, instance, user, password) {

	this.url = "postgres://" + user + ":" + password + "@" + host + ":" + port + "/" + instance;

	this.client = new pg.Client(this.url);
};

/**
 * Connects to the database.
 *
 * Doesn't needs to be called after the constructor as this is done automatically.
 */


/**
 *
 */
Postgres_Client.prototype.query = function(sql, params, callback) {
	this.client.connect()
	this.client.query(sql, params, function (err, result) {
		console.log("error")
		console.log(err);
		console.log("das",result);
		if(error) {
			callback(error, null);
		} else {
			console.log(result.rows)
			callback(null, result.rows)
		}
	});
	this.client.end();
};

module.exports = Postgres_Client;