var SparqlClient = require('sparql-client');
var util = require('util');

var Sparql_Client = function(host, port) {
	this.host = host;
	this.port = port;
	endpoint = this.host;
	if(this.port != null && this.port != "") {
		endpoint += ":" + this.port;
	}
	this.client = new SparqlClient(endpoint);
	
};


Sparql_Client.prototype.query = function (query, cb) {
	try {
		this.client.query(query)
		  .execute(function(error, results) {
		  	if(error) {
		  		cb(error, null);
		  	} else {
		  		cb(null, results.results.bindings);
		  	}
		});
	} catch(e) {
		cb(e, null);
	}
	
}


module.exports = Sparql_Client;