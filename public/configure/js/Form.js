var Form = function () {
}

Form.prototype.status = "";
Form.prototype.url = "http://giv-oct.uni-muenster.de:8080/api/";
Form.prototype.data = [];

/*
 * Empty #content
 */
Form.prototype.empty = function () {
	$("#content").empty();
}

/*
 * Empty #inputForm
 */
Form.prototype.emptyForm = function () {
	$("#inputForm").empty();
}

/*
 * Show Fields for Login
 */
Form.prototype.login = function (callback) {
	this.status = "login";
	this.empty();
	$("#content").append('<div id=inputForm></div>');
	this.username();
	this.password();
	this.btnSend("Login", callback);
}

/*
 * Show Fields for Signup
 */
Form.prototype.signup = function (callback) {
	this.status = "signup";
	this.empty();
	$("#content").append('<div id=inputForm></div>');
	this.admin();
	this.password();
	this.btnSend("Sign up", callback);
}

/*
 * Show Fields for adding a Database
 */
Form.prototype.addDatabase = function () {
	this.status = "";
	this.empty();
	$label = $('<label for="basic-url">Database Type</label><br>');
	dropdown = '<select id="databaseType">'
    dropdown += '<option value="0">Rest-API</option>'
    dropdown += '<option value="1">Postgres</option>'
    dropdown += '</select><br><br>'
	$dropdown = $(dropdown);
	$("#content").append($label);
	$("#content").append($dropdown);

	$("#content").append('<div id=inputForm></div>');
	this.status = $('#databaseType  option:selected').text();
	this.API();
	var that = this;
	$("#databaseType").on('change', function (e) {
		that.status = $('#databaseType  option:selected').text();
		switch(that.status) {
			case("Postgres"):
				that.Postgres();
				break;
			case("Rest-API"):
				that.API();
				break;
			default:
				break;
		}
	});
}

/*
 * Show Fields for modifying a Database
 */
Form.prototype.modifyDatabase = function () {
	this.status = "";
	this.empty();
	this.catchMD();
}

/*
 * Get Main Datasets and append to page
 */
Form.prototype.catchMD = function () {
	var that = this;

	$.getJSON( "http://giv-oct.uni-muenster.de:8080/api/main_database", function (json) {
		that.data = [];
		$dropdown = $('<select id="main_database"></select><br><br>');
		for(index in json) {
			that.data[json[index].md_name] = {
				'id': json[index].md_id
			}
			$dropdown.append('<option value="'+index+'">'+json[index].md_name+'</option>');
		}
		$("#content").append($dropdown);
		that.status = $('#main_database option:selected').text();
		that.catchSD(that.data[that.status].id);

		$("#main_database").on('change', function (e) {
			that.status = $('#main_database  option:selected').text();
			that.catchSD(that.data[that.status].id);
		});
	});
}

/*
 * Get all Sub Datasets from a Main Dataset
 */
Form.prototype.catchSD = function (md) {
	var that = this;
	console.log(md);

	$.getJSON( "http://giv-oct.uni-muenster.de:8080/api/sub_database/"+md, function (json) {
		console.log(json);
	});
}

/*
 * Show Fields for a Postgres Database
 */
Form.prototype.Postgres = function () {
	this.emptyForm();
	this.db_name();
	this.db_host();
	this.db_port();
	this.db_description();

	this.user();
	this.btnSend("Send");
}

/*
 * Show Fields for a Rest-API
 */
Form.prototype.API = function () {
	this.emptyForm();
	this.url();
	this.db_name();
	this.db_description();

	this.user();
	this.btnSend("Send");
}

/*
 * Show Fields required for a Admin
 */
Form.prototype.admin = function () {
	this.username();
	this.user();
}

/*
 * Show Field for Username
 */
Form.prototype.username = function () {
	$usernameLabel = $('<label for="username-label">User Name</label>');
	$username = $('<input type="text" class="form-control" id="username" aria-describedby="basic-addon3">');
	$("#inputForm").append($usernameLabel);
	$("#inputForm").append($username);
}

/*
 * Show Fields for User
 */
Form.prototype.user = function () {
	$firstNameLabel = $('<label for="first-name-label">First Name</label>');
	$firstName = $('<input type="text" class="form-control" id="first-name" aria-describedby="basic-addon3">');
	$("#inputForm").append($firstNameLabel);
	$("#inputForm").append($firstName);
	$lastNameLabel = $('<label for="last-name-label">Last Name</label>');
	$lastName = $('<input type="text" class="form-control" id="last-name" aria-describedby="basic-addon3">');
	$("#inputForm").append($lastNameLabel);
	$("#inputForm").append($lastName);
	this.email();
}

/*
 * Show Field for Email Address
 */
Form.prototype.email = function () {
	$emailLabel = $('<label for="email-label">Email</label>');
	$email = $('<input type="text" id="email" class="form-control" placeholder="max.mustermann@example.com" aria-describedby="basic-addon2">');
	$("#inputForm").append($emailLabel);
	$("#inputForm").append($email);
}

/*
 * Show Field for Database Name
 */
Form.prototype.db_name = function () {
	$label = $('<label for="db-name-label">Database Name</label>');
	$db_name = $('<input type="text" class="form-control" id="db-name" aria-describedby="basic-addon3">');
	$("#inputForm").append($label);
	$("#inputForm").append($db_name);
}

/*
 * Show Field for Database Host
 */
Form.prototype.db_host = function () {
	$label = $('<label for="db-host-label">Database Host</label>');
	$db_host = $('<input type="text" class="form-control" id="db-host" aria-describedby="basic-addon3">');
	$("#inputForm").append($label);
	$("#inputForm").append($db_host);
}

/*
 * Show Field for Database Port
 */
Form.prototype.db_port = function () {
	$label = $('<label for="db-port-label">Database Port</label>');
	$db_port = $('<input type="text" class="form-control" id="db-port" aria-describedby="basic-addon3">');
	$("#inputForm").append($label);
	$("#inputForm").append($db_port);
}

/*
 * Show Field for URL
 */
Form.prototype.url = function () {
	$label = $('<label for="url-label">URL</label>');
	$url = $('<div class="input-group"><span class="input-group-addon" id="basic-addon3">http://</span><input type="text" class="form-control" id="url" aria-describedby="basic-addon3"></div>');
	$("#inputForm").append($label);
	$("#inputForm").append($url);
}

/*
 * Show Field for Database Description
 */
Form.prototype.db_description = function () {
	$label = $('<label for="db-description-label">Description</label>');
	$description = $('<input type="text" class="form-control" id="db-description" aria-describedby="basic-addon3">');
	$("#inputForm").append($label);
	$("#inputForm").append($description);
}

/*
 * Show Field for Password
 */
Form.prototype.password = function () {
	$label = $('<label for="password-label">Password</label>');
	$password = $('<input type="text" class="form-control" id="password" aria-describedby="basic-addon3">');
	$("#inputForm").append($label);
	$("#inputForm").append($password);
}

/*
 * Add a Button, Add a Click Listener
 */
Form.prototype.btnSend = function (text, callback) {
	var that = this;
	var cb = callback;
	$btnSend = $('<br><button type="button" class="btn btn-primary right">'+text+'</button>');
	$("#inputForm").append($btnSend);

	//Listen on Button Clicks
	$btnSend.click(function () {
		//Check which status is active
		switch(that.status) {
			case("login"):
				$.getJSON( "http://giv-oct.uni-muenster.de:8080/api/admin/login/" + $('#username').val(), function (json) {
					callback(json);
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
				    url: "http://giv-oct.uni-muenster.de:8080/api/admin/signup",
				    processData: false,
				    contentType: 'application/json',
				    data: JSON.stringify(data),
				    success: function(r) {
				    	callback(r);
					}
				});
				break;
			case("Postgres"):
				db_name = $("#db-name").val();
				db_host = $("#db-host").val();
				db_port = $("#db-port").val();
				db_description = $("#db-description").val();

				first_name = $("#first-name").val();
				last_name = $("#last-name").val();
				email = $("#email").val();
			
				data = {
					db_name: db_name,
					db_host: db_host,
					db_port: db_port,
					db_description: db_description,
					first_name: first_name,
					last_name: last_name,
					email: email
				}
				console.log(data);

				break;
			case("Rest-API"):
				url = $("#url").val();
				db_name = $("#db-name").val();
				db_description = $("#db-description").val();

				first_name = $("#first-name").val();
				last_name = $("#last-name").val();
				email = $("#email").val();
		
				data = {
					url: url,
					db_name: db_name,
					db_description: db_description,
					first_name: first_name,
					last_name: last_name,
					email: email
				}
				console.log(data);

				break;
			default:
				break;
		}
	})
}