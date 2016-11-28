var Submit = function (user, categories) {
	this.user = user;
	this.categories = categories;
	this.url = "http://giv-oct.uni-muenster.de:8081/api/"
};


Submit.prototype.submit = function (status, callback) {
	var validator = new Validator();
	switch(status) {
		case("login"):
			$.getJSON( this.url + "admin/login/" + $('#username').val() + "/" + $('#password').val(), function (json) {
				console.log("normal");
				console.log(json);
				callback(json);
			}).error(function (e) {
				console.log(e);
				if(e.status == 401) {
					alert(e.responseText);
				}
				if(e.status == 404) {
					alert("Fill in username and password");
				}
			});
			break;
		case("signup"):
			var data = { 
				"username" : $("#username").val(),
				"email_address": $("#email").val(),
				"first_name": $("#first-name").val(),
				"last_name": $("#last-name").val(),
				"password": $("#password").val()
			 };
			 console.log(data);
			$.ajax({
			    type: "POST",
			    url: this.url + "admin/signup",
			    processData: false,
			    contentType: 'application/json',
			    data: JSON.stringify(data),
			    success: function(r) {
			    	callback(r);
				}
			});
			break;
		case("Postgres"):
			if(validator.check(status)) {
				$('#myModal').modal('hide')
				db_name = $("#db-name").val();
				db_host = $("#db-host").val();
				db_port = $("#db-port").val();
				db_instance = $("db-instance").val();
				db_description = $("#db-description").val();
				db_user = $("#db-user").val();
				db_password = $("#db-password").val();

				//User
				username = this.user.username;
				
				//query
				query_name = $("#query-name").val();
				query = $("#query").val();
				query_id = $("#query-id").val();
				query_description = $("#query-description").val();

				data = {
					ds_type: "REST",
					ds_description: db_description,
					ds_host: db_host,
					ds_port: db_port,
					db_instance: db_instance,
					db_user: db_user,
					db_password: db_password,
					created_by: username,
					md_name: db_name,
					md_description: ds_description,
					publisher: "",
					license: "",
					sd_name: "",
					sd_description: "",
					query_intern: query,
					query_extern: query_id,
					query_description: query_description,
					categories: this.categories
				}
				$.ajax({
				    type: "POST",
				    url: this.url + "querycheck",
				    processData: false,
				    contentType: 'application/json',
				    data: JSON.stringify(data),
				    success: function(r) {
				    	$.ajax({
						    type: "POST",
						    url: this.url + "submit",
						    processData: false,
						    contentType: 'application/json',
						    data: JSON.stringify(data),
						    success: function(r) {
						    	callback(r);
						    	$('#myModal').modal('hide');
							}, 
							error: function (e) {
								callback(e);
							}
						});
					}, 
					error: function (e) {
						console.log(e);
						callback(e);
					}
				});
			}
			break;
		case("Rest-API"):
			if(validator.check(status)) {
				$('#myModal').modal('hide')
				db_name = $("#db-name").val();
				url = $("#url").val();
				ds_description = $("#db-description").val();

				//User
				username = this.user.username;
				
				//query
				query_name = $("#query-name").val();
				query = $("#query").val();
				query_id = $("#query-id").val();
				query_description = $("#query-description").val();

				data = {
					ds_type: "REST",
					ds_description: ds_description,
					ds_host: url,
					db_instance: "",
					db_user: "",
					db_password: "",
					created_by: username,
					md_name: db_name,
					md_description: ds_description,
					publisher: "",
					license: "",
					sd_name: "",
					sd_description: "",
					query_intern: query,
					query_extern: query_id,
					query_description: query_description,
					categories: this.categories
				}
				$.ajax({
				    type: "POST",
				    url: this.url + "querycheck",
				    processData: false,
				    contentType: 'application/json',
				    data: JSON.stringify(data),
				    success: function(r) {
				    	$.ajax({
						    type: "POST",
						    url: this.url + "submit",
						    processData: false,
						    contentType: 'application/json',
						    data: JSON.stringify(data),
						    success: function(r) {
						    	callback(r);
						    	$('#myModal').modal('hide');
							}, 
							error: function (e) {
								callback(e);
							}
						});
					}, 
					error: function (e) {
						console.log(e);
						callback(e);
					}
				});
			}
			break;
		case("CouchDB"):
			if(validator.check(status)) {
				db_name = $("#db-name").val();
				db_host = $("#db-host").val();
				db_port = $("#db-port").val();
				db_instance = $("#db-instance").val();
				db_description = $("#db-description").val();

				username = this.user.username;
				
				//query
				query_name = $("#query-name").val();
				query = $("#query").val();
				query_id = $("#query-id").val();
				query_description = $("#query-description").val();

				data = {
					ds_type: "COUCHDB",
					ds_description: db_description,
					ds_host: db_host,
					ds_port: db_port,
					db_instance: db_instance,
					db_user: "",
					db_password: "",
					created_by: username,
					md_name: db_name,
					md_description: db_description,
					publisher: "",
					license: "",
					sd_name: "",
					sd_description: "",
					query_intern: query,
					query_extern: query_id,
					query_description: query_description,
					categories: this.categories
				}
				console.log(data);
				$.ajax({
				    type: "POST",
				    url: this.url + "querycheck",
				    processData: false,
				    contentType: 'application/json',
				    data: JSON.stringify(data),
				    success: function(r) {
				    	$.ajax({
						    type: "POST",
						    url: this.url + "submit",
						    processData: false,
						    contentType: 'application/json',
						    data: JSON.stringify(data),
						    success: function(r) {
						    	callback(r);
						    	$('#myModal').modal('hide');
							}, 
							error: function (e) {
								callback(e);
							}
						});
					}, 
					error: function (e) {
						callback(e);
					}
				});
			}
			break;
		case("Parliament"):
			if(validator.check(status)) {
				
				db_name = $("#db-name").val();
				db_host = $("#db-host").val();
				db_description = $("#db-description").val();

				//User
				username = this.user.username;
				
				//query
				query_name = $("#query-name").val();
				query = $("#query").val();
				query_id = $("#query-id").val();
				query_description = $("#query-description").val();

				data = {
					ds_type: "PARLIAMENT",
					ds_description: db_description,
					ds_host: db_host,
					db_instance: "",
					db_user: "",
					db_password: "",
					created_by: username,
					md_name: db_name,
					md_description: db_description,
					publisher: "",
					license: "",
					sd_name: "",
					sd_description: "",
					query_intern: query,
					query_extern: query_id,
					query_description: query_description,
					categories: this.categories
				}
				$.ajax({
				    type: "POST",
				    url: this.url + "querycheck",
				    processData: false,
				    contentType: 'application/json',
				    data: JSON.stringify(data),
				    success: function(r) {
				    	$.ajax({
						    type: "POST",
						    url: this.url + "submit",
						    processData: false,
						    contentType: 'application/json',
						    data: JSON.stringify(data),
						    success: function(r) {
						    	callback(r);
						    	$('#myModal').modal('hide');
							}, 
							error: function (e) {
								callback(e);
							}
						});
					}, 
					error: function (e) {
						callback(JSON.stringyfy(e));
					}
				});
			}
			break;
		default:
			console.log("not suported yet");
			break;
	}
}