var pg = require("pg");
var Postgres_Result = require('./Postgres_Result.js');

/**
 * Constructs a single DbClient object.
 *
 * Uses the singleton pattern to allow only one instance of this class. Connects to the database automatically.
 */
var Postgres_Client = function(url) {
	// Singleton pattern
	if (arguments.callee._singletonInstance) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	// Normal initialization of the constructor
	this.connectionString = url;
	this.connection = null;

	this.connect();
};

Postgres_Client.prototype.setURL = function (url) {
	this.connectionString = url;
}

/**
 * Connects to the database.
 *
 * Doesn't needs to be called after the constructor as this is done automatically.
 */
Postgres_Client.prototype.connect = function() {
	this.connection = new pg.Client(this.connectionString);
	this.connection.connect(
		function(error) {
			if (error) {
				console.error('could not connect to postgres', error);
			}
		}
	);
};

/**
 * Stops the database connection.
 */
Postgres_Client.prototype.disconnect = function() {
	if (this.connection !== null) {
		this.connection.end();
	}
};

/**
 * Sends a parametrized query to the database and executes a callback function afterwards to handle the results.
 * 
 * @param string Parametrized SQL Query
 * @param array Parameters for the SQL Query
 * @param function Callback function that is executed after the query. The callback function has one parameter of type DbResult which may contain the results of the query.
 * @see pg.query()
 */
Postgres_Client.prototype.query = function(sql, params, callback) {
	if (this.connection === null) {
		return;
	}

	var result = new Postgres_Result();
	var query = this.connection.query(sql, params);
	query.on('error', function(error) {
		console.log("Error in query execution:\r\nQuery: ", sql, "\r\nParameters: ", params, "\r\nError message: ", error);
		result = null;
	});
	query.on('row', function(row) {
		result.addRow(row);
	});
	query.on('end', function(data) {
		if (callback) {
			callback(result);
		}
	});
};

module.exports = Postgres_Client;