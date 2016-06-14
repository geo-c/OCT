var https = require('https');

var EnviroCar_Client = function() {
};

EnviroCar_Client.prototype.query = function(searchTerm, cb) {
	url="https://envirocar.org/api/stable/" + searchTerm;
	https.get(url, function(res) {
			var body = '';
			res.on('data', function(chunk){
		        body += chunk;
		    });

		    res.on('end', function(){
		    	var enviroCarResponse;
		    	try {
		    		enviroCarResponse = JSON.parse(body);
		    	} catch (e) {
		    		console.log("Invalid Response from source 'enviroCar'");
		    	}	        
		        data = {
		        	results: []
		        };
		        if(enviroCarResponse != null) {
		        	if(enviroCarResponse.sensors != null) {
				        data.results = enviroCarResponse.sensors;	
		        	}
		        }
		        cb(data);
		    });
		}).on('error', function(e){
		      console.log("Got an error: ", e);
		});
};


module.exports = EnviroCar_Client;