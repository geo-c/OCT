var SparqlClient = require('sparql-client');
var util = require('util');

var Sparql_Client = function() {
	this.client = new SparqlClient("http://giv-lodumdata.uni-muenster.de:8282/parliament/sparql");
};


Sparql_Client.prototype.query = function (query, cb) {
	this.client.query(query)
	  .execute(function(error, results) {
	  	cb(results.results.bindings);
	  //process.stdout.write(util.inspect(arguments, null, 20, true)+"\n");1
	});
}


module.exports = Sparql_Client;