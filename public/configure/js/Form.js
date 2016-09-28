var Form = function () {
}

Form.prototype.status = "";
Form.prototype.url = "http://giv-oct.uni-muenster.de:8080/api/";
Form.prototype.data = [];
Form.prototype.user = {};
Form.prototype.categories = [];

/*
 * Empty #content
 */
Form.prototype.empty = function () {
	$("#form").empty();
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
	$("#form").append('<div id=inputForm></div>');
	$('#inputForm').append(this.username());
	$('#inputForm').append(this.password());
	this.btnSend("Login", callback);
}

/*
 * Show Fields for Signup
 */
Form.prototype.signup = function (callback) {
	this.status = "signup";
	this.empty();
	$("#form").append('<div id=inputForm></div>');
	$('#inputForm').append(this.username());
	$('#inputForm').append(this.first_name());
	$('#inputForm').append(this.last_name());
	$('#inputForm').append(this.email());
	$('#inputForm').append(this.password());
	this.btnSend("Sign up", callback);
}

Form.prototype.addingButton = function () {
	this.empty();
	$space = $('<br>')
	$button = $('<button type="button" class="btn btn-success btn-lg" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-plus"></span>Add a Query</button>');
	$("#form").append($space);
	$("#form").append($button);
	$("#form").append($space);

	this.addDatabase();
}

/*
 * Show Fields for adding a Database
 */
Form.prototype.addDatabase = function () {
	this.status = "";
	this.emptyForm();
	$(".modal-body").append('<div id=inputForm></div>');
	$label = $('<label for="basic-url">Add a Query</label><br>');
	dropdown = '<div class="dropdown">'
  	dropdown += '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
    dropdown += 'Rest-API'
    dropdown += '<span class="caret"></span>'
  	dropdown += '</button>'
  	dropdown += '<ul class="dropdown-menu" aria-labelledby="dropdownMenu">'
    dropdown += '<li><a href="#">Rest-API</a></li>'
    dropdown += '<li><a href="#">Postgres</a></li>'
    dropdown += '<li><a href="#">CouchDB</a></li>'
    dropdown += '<li><a href="#">Parliament</a></li>'
  	dropdown += '</ul>'
	dropdown += '</div>'
	dropdown += '<div id="inputContent"></div>'
	$dropdown = $(dropdown);
	$("#inputForm").append($label);
	$("#inputForm").append($dropdown);

	
	this.status = "Rest-API";
	this.API();
	var that = this;

	$('ul.dropdown-menu li a').click(function (e) {
	    var $div = $(this).parent().parent().parent(); 
	    var $btn = $div.find('button');
	    $btn.html($(this).text() + ' <span class="caret"></span>');
	    $div.removeClass('open');
	    e.preventDefault();
	    that.status = $btn.text().replace(/\s/g, '');
	    switch(that.status) {
			case("Postgres"):
				that.Postgres();
				break;
			case("Rest-API"):
				that.API();
				break;
			case("CouchDB"):
				that.CouchDB();
				break;
			case("Parliament"):
				that.Parliament();
				break;
			default:
				break;
		}

	    return false;
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
		$("#form").append($dropdown);
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
	$("#inputContent").empty();
	$row = $('<div class="row"></div>');
	$db = this.PanelDatabase();
	//$user = this.PanelUser();
	$query = this.PanelQuery();
	$category = this.PanelCategory();
	$row.append($db);
	//$row.append($user);
	$row.append($query);
	$row.append($category);
	$("#inputContent").append($row);
	//Database
	$('#panelDatabase').append(this.db_name());
	$('#panelDatabase').append(this.db_host());
	$('#panelDatabase').append(this.db_port());
	$('#panelDatabase').append(this.db_instance());
	$('#panelDatabase').append(this.db_user());
	$('#panelDatabase').append(this.db_password());
	$('#panelDatabase').append(this.db_description());
	//Query
	$('#panelQuery').append(this.queryName());
	$('#panelQuery').append(this.queryIntern());
	$('#panelQuery').append(this.queryExtern());
	$('#panelQuery').append(this.queryDescription());
	//Category

	var that = this;
	$.getJSON( "http://giv-oct.uni-muenster.de:8080/api/categories/withDatasets/", function (json) {
		dropdown = '<div class="dropdown">'
	  	dropdown += '<button class="btn btn-success dropdown-toggle" type="button" id="categoryDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
	    dropdown += 'Add Category'
	    dropdown += '<span class="caret"></span>'
	  	dropdown += '</button>'
	  	dropdown += '<ul class="dropdown-menu category" aria-labelledby="dropdownMenu">'
		for(i in json) {
			dropdown += '<li id="list-'+json[i].category_name.replace(/ /g, '').replace(/,/g, '')+'"><a href="#">'+json[i].category_name+'</a></li>'
		}
		dropdown += '</ul>'
		dropdown += '</div>'
		$('#panelCategory').append($(dropdown));

		$('ul.dropdown-menu.category li a').click(function (e) {
		    var $div = $(this).parent().parent().parent(); 
	    	$div.removeClass('open');
	    	e.preventDefault();
	    	category = $(this).text();
	    	that.categories.push(category);
	    	$("#panelCategory").append('<div><span class="label label-default">'+category+'</span><a id="'+category+'" href="#"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true" style="color:red;"></span></a></div>');
	    	$(this).parent().hide();
	    	$("#"+category).click(function (e) {
	    		_category = $(this).attr('id');
	    		$("#list-"+_category.replace(/ /g, '').replace(/,/g, '')).show();
	    		var index = that.categories.indexOf(_category);
				that.categories.splice(index, 1);
	    		$(this).parent().empty();
	    		$(this).parent().remove();
	    	});
		});
	});
	
	this.btnSend("Send", function (e) {
		alert(e);
	});
}

/*
 * Show Fields for a Rest-API
 */
Form.prototype.API = function () {
	$("#inputContent").empty();
	$row = $('<div class="row"></div>');
	$db = this.PanelDatabase();
	//$user = this.PanelUser();
	$query = this.PanelQuery();
	$category = this.PanelCategory();
	$row.append($db);
	//$row.append($user);
	$row.append($query);
	$row.append($category);
	$("#inputContent").append($row);
	//Database
	$('#panelDatabase').append(this.db_name());
	$('#panelDatabase').append(this.url());
	$('#panelDatabase').append(this.db_description());
	//Query
	$('#panelQuery').append(this.queryName());
	$('#panelQuery').append(this.queryIntern());
	$('#panelQuery').append(this.queryExtern());
	$('#panelQuery').append(this.queryDescription());
	//Category

	var that = this;
	$.getJSON( "http://giv-oct.uni-muenster.de:8080/api/categories/withDatasets/", function (json) {
		dropdown = '<div class="dropdown">'
	  	dropdown += '<button class="btn btn-success dropdown-toggle" type="button" id="categoryDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
	    dropdown += 'Add Category'
	    dropdown += '<span class="caret"></span>'
	  	dropdown += '</button>'
	  	dropdown += '<ul class="dropdown-menu category" aria-labelledby="dropdownMenu">'
		for(i in json) {
			dropdown += '<li id="list-'+json[i].category_name.replace(/ /g, '').replace(/,/g, '')+'"><a href="#">'+json[i].category_name+'</a></li>'
		}
		dropdown += '</ul>'
		dropdown += '</div>'
		$('#panelCategory').append($(dropdown));

		$('ul.dropdown-menu.category li a').click(function (e) {
		    var $div = $(this).parent().parent().parent(); 
	    	$div.removeClass('open');
	    	e.preventDefault();
	    	category = $(this).text();
	    	that.categories.push(category);
	    	$("#panelCategory").append('<div><span class="label label-default">'+category+'</span><a id="'+category+'" href="#"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true" style="color:red;"></span></a></div>');
	    	$(this).parent().hide();
	    	$("#"+category).click(function (e) {
	    		_category = $(this).attr('id');
	    		$("#list-"+_category.replace(/ /g, '').replace(/,/g, '')).show();
	    		var index = that.categories.indexOf(_category);
				that.categories.splice(index, 1);
	    		$(this).parent().empty();
	    		$(this).parent().remove();
	    	});
		});
	});
	
	this.btnSend("Send", function (e) {
		alert(e);
	});
}

/*
 * Show Fields for a CouchDB
 */
Form.prototype.CouchDB = function () {
	$("#inputContent").empty();
	$row = $('<div class="row"></div>');
	$db = this.PanelDatabase();
	//$user = this.PanelUser();
	$query = this.PanelQuery();
	$category = this.PanelCategory();
	$row.append($db);
	//$row.append($user);
	$row.append($query);
	$row.append($category);
	$("#inputContent").append($row);
	//Database
	$('#panelDatabase').append(this.db_name());
	$("#panelDatabase").append(this.db_host);
	$("#panelDatabase").append(this.db_port);
	$("#panelDatabase").append(this.db_instance);
	$("#panelDatabase").append(this.db_description);
	//Query
	$('#panelQuery').append(this.queryName());
	$('#panelQuery').append(this.queryIntern());
	$('#panelQuery').append(this.queryExtern());
	$('#panelQuery').append(this.queryDescription());
	//Category

	var that = this;
	$.getJSON( "http://giv-oct.uni-muenster.de:8080/api/categories/withDatasets/", function (json) {
		dropdown = '<div class="dropdown">'
	  	dropdown += '<button class="btn btn-success dropdown-toggle" type="button" id="categoryDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
	    dropdown += 'Add Category'
	    dropdown += '<span class="caret"></span>'
	  	dropdown += '</button>'
	  	dropdown += '<ul class="dropdown-menu category" aria-labelledby="dropdownMenu">'
		for(i in json) {
			dropdown += '<li id="list-'+json[i].category_name.replace(/ /g, '').replace(/,/g, '')+'"><a href="#">'+json[i].category_name+'</a></li>'
		}
		dropdown += '</ul>'
		dropdown += '</div>'
		$('#panelCategory').append($(dropdown));

		$('ul.dropdown-menu.category li a').click(function (e) {
		    var $div = $(this).parent().parent().parent(); 
	    	$div.removeClass('open');
	    	e.preventDefault();
	    	category = $(this).text();
	    	that.categories.push(category);
	    	$("#panelCategory").append('<div><span class="label label-default">'+category+'</span><a id="'+category+'" href="#"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true" style="color:red;"></span></a></div>');
	    	$(this).parent().hide();
	    	$("#"+category).click(function (e) {
	    		_category = $(this).attr('id');
	    		$("#list-"+_category.replace(/ /g, '').replace(/,/g, '')).show();
	    		var index = that.categories.indexOf(_category);
				that.categories.splice(index, 1);
	    		$(this).parent().empty();
	    		$(this).parent().remove();
	    	});
		});
	});
	


	this.btnSend("Send", function (e) {
		alert(e);
	});
}

Form.prototype.Parliament = function () {
	$("#inputContent").empty();
	$row = $('<div class="row"></div>');
	$db = this.PanelDatabase();
	//$user = this.PanelUser();
	$query = this.PanelQuery();
	$category = this.PanelCategory();
	$row.append($db);
	//$row.append($user);
	$row.append($query);
	$row.append($category);
	$("#inputContent").append($row);
	//Database
	$('#panelDatabase').append(this.db_name());
	$('#panelDatabase').append(this.db_host());
	$('#panelDatabase').append(this.db_description());
	//Query
	$('#panelQuery').append(this.queryName());
	$('#panelQuery').append(this.queryIntern());
	$('#panelQuery').append(this.queryExtern());
	$('#panelQuery').append(this.queryDescription());
	//Category

	var that = this;
	$.getJSON( "http://giv-oct.uni-muenster.de:8080/api/categories/withDatasets/", function (json) {
		dropdown = '<div class="dropdown">'
	  	dropdown += '<button class="btn btn-success dropdown-toggle" type="button" id="categoryDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
	    dropdown += 'Add Category'
	    dropdown += '<span class="caret"></span>'
	  	dropdown += '</button>'
	  	dropdown += '<ul class="dropdown-menu category" aria-labelledby="dropdownMenu">'
		for(i in json) {
			dropdown += '<li id="list-'+json[i].category_name.replace(/ /g, '').replace(/,/g, '')+'"><a href="#">'+json[i].category_name+'</a></li>'
		}
		dropdown += '</ul>'
		dropdown += '</div>'
		$('#panelCategory').append($(dropdown));

		$('ul.dropdown-menu.category li a').click(function (e) {
		    var $div = $(this).parent().parent().parent(); 
	    	$div.removeClass('open');
	    	e.preventDefault();
	    	category = $(this).text();
	    	that.categories.push(category);
	    	$("#panelCategory").append('<div><span class="label label-default">'+category+'</span><a id="'+category+'" href="#"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true" style="color:red;"></span></a></div>');
	    	$(this).parent().hide();
	    	$("#"+category).click(function (e) {
	    		_category = $(this).attr('id');
	    		$("#list-"+_category.replace(/ /g, '').replace(/,/g, '')).show();
	    		var index = that.categories.indexOf(_category);
				that.categories.splice(index, 1);
	    		$(this).parent().empty();
	    		$(this).parent().remove();
	    	});
		});
	});
	


	this.btnSend("Send", function (e) {
		alert(e);
	});
}

Form.prototype.PanelDatabase = function () {
	panel = '<div class=col-md-4>'
	panel += '<div class="panel panel-default">'
	panel += '<div class="panel-body" id="panelDatabase">'
	panel += '<div class="panel-heading"><h3 class="panel-title">Database Settings</h3></div>'
	panel += '<div id="dbContent"></div>'
	panel += '</div></div></div>'
	return $(panel);
}

Form.prototype.PanelUser = function () {
	panel = '<div class=col-md-3>'
	panel += '<div class="panel panel-default">'
	panel += '<div class="panel-body" id="panelUser">'
	panel += '<div class="panel-heading"><h3 class="panel-title">User Settings</h3></div>'
	panel += '</div></div></div>'
	return $(panel);
}

Form.prototype.PanelQuery = function () {
	panel = '<div class=col-md-4>'
	panel += '<div class="panel panel-default">'
	panel += '<div class="panel-body" id="panelQuery">'
	panel += '<div class="panel-heading"><h3 class="panel-title">Query Settings</h3></div>'
	panel += '</div></div></div>'
	return $(panel);
}

Form.prototype.PanelCategory = function () {
	panel = '<div class=col-md-4>'
	panel += '<div class="panel panel-default">'
	panel += '<div class="panel-body" id="panelCategory">'
	panel += '<div class="panel-heading"><h3 class="panel-title">Categories</h3></div>'
	panel += '</div></div></div>'
	return $(panel);
}

/*
 * Show Field for Username
 */
Form.prototype.username = function () {
	$username = $('<input type="text" class="form-control" id="username" placeholder="Username" aria-describedby="basic-addon3">');
	return $username
}

/*
 * Show Fields for User
 */
Form.prototype.first_name = function () {
	$firstName = $('<input type="text" class="form-control" id="first-name" placeholder="First Name" aria-describedby="basic-addon3">');
	return $firstName;

}

Form.prototype.last_name = function () {
	$lastName = $('<input type="text" class="form-control" id="last-name" placeholder="Last Name" aria-describedby="basic-addon3">');
	return $lastName;
}

/*
 * Show Field for Email Address
 */
Form.prototype.email = function () {
	$email = $('<input type="text" id="email" class="form-control" placeholder="max.mustermann@example.com" aria-describedby="basic-addon2">');
	return $email;
}

/*
 * Show Field for Database Name
 */
Form.prototype.db_name = function () {
	$db_name = $('<div class="form-group"><input type="text" class="form-control" id="db-name" placeholder="Name" aria-describedby="basic-addon3"></div>');
	return $db_name;
}

/*
 * Show Field for Database Host
 */
Form.prototype.db_host = function () {
	$db_host = $('<div class="form-group"><input type="text" class="form-control" id="db-host" placeholder="Host" aria-describedby="basic-addon3"></div></div>');
	return $db_host;
}

Form.prototype.db_user = function () {
	$db_host = $('<div class="form-group"><input type="text" class="form-control" id="db-user" placeholder="User" aria-describedby="basic-addon3"></div></div>');
	return $db_host;
}

Form.prototype.db_password = function () {
	$db_host = $('<div class="form-group"><input type="text" class="form-control" id="db-password" placeholder="Password" aria-describedby="basic-addon3"></div></div>');
	return $db_host;
}

Form.prototype.queryIntern = function () {
	$intern = $('<div class="form-group"><input type="text" class="form-control" id="query-intern" placeholder="Intern" aria-describedby="basic-addon3"></div>');
	return $intern;
}

Form.prototype.queryExtern = function () {
	$extern = $('<div class="form-group"><div class="input-group"><span class="input-group-addon" id="basic-addon2">...api/dataset/</span><input type="text" class="form-control" id="query-extern" placeholder="Extern" aria-describedby="basic-addon3"></div></div>');
	return $extern;
}

Form.prototype.queryDescription = function () {
	$description = $('<div class="form-group"><input type="text" class="form-control" id="query-description" placeholder="Description" aria-describedby="basic-addon3"></div></div>');
	return $description;
}

Form.prototype.queryName = function () {
	$name = $('<div class="form-group"><input type="text" class="form-control" id="query-name" placeholder="Name" aria-describedby="basic-addon3"></div></div>');
	return $name;
}

/*
 * Show Field for Database Port
 */
Form.prototype.db_port = function () {
	$db_port = $('<div class="form-group"><div class="input-group"><span class="input-group-addon" id="basic-addon2">:</span><input type="text" class="form-control" id="db-port" placeholder="Port" aria-describedby="basic-addon3"></div></div>');
	return $db_port;
}

Form.prototype.db_instance = function () {
	$db_instance = $('<div class="form-group"><input type="text" class="form-control" id="db-instance" placeholder="Instance" aria-describedby="basic-addon3"></div>');
	return $db_instance;
}

/*
 * Show Field for URL
 */
Form.prototype.url = function () {
	$url = $('<div class="form-group"><div class="input-group"><input type="text" class="form-control" id="url" placeholder="url" aria-describedby="basic-addon3"></div></div>');
	return $url;
}

/*
 * Show Field for Database Description
 */
Form.prototype.db_description = function () {
	$description = $('<div class="form-group"><input type="text" class="form-control" id="db-description" placeholder="Description" aria-describedby="basic-addon3"></div>');
	return $description;
}

/*
 * Show Field for Password
 */
Form.prototype.password = function () {
	$password = $('<input type="text" class="form-control" id="password" placeholder="Password" aria-describedby="basic-addon3">');
	return $password;
}

Form.prototype.validate = function () {
	_return = true;
	switch(this.status) {
		case("Postgres"):
			if($("#db-name").val() == "") {
				$("#db-name").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-name").parent().removeClass("has-error");
			}
			if($("#db-host").val() == "") {
				$("#db-host").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-host").parent().parent().removeClass("has-error");
			}
			if($("#db-instance").val() == "") {
				$("#db-instance").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-instance").parent().parent().removeClass("has-error");
			}
			if($("#db-user").val() == "") {
				$("#db-user").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-user").parent().parent().removeClass("has-error");
			}
			if($("#db-password").val() == "") {
				$("#db-password").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-password").parent().parent().removeClass("has-error");
			}
			if($("#db-description").val() == "") {
				$("#db-description").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-description").parent().removeClass("has-error");
			}
			if($("#query-name").val() == "") {
				$("#query-name").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-name").parent().removeClass("has-error");
			}
			if($("#query-intern").val() == "") {
				$("#query-intern").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-intern").parent().removeClass("has-error");
			}
			if($("#query-extern").val() == "") {
				$("#query-extern").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-extern").parent().parent().removeClass("has-error");
			}
			if($("#query-description").val() == "") {
				$("#query-description").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-description").parent().removeClass("has-error");
			}
			if(_return) {
				return true;
			} else {
				$(".modal-header h5").html("First fill in all Data!");
				return false;
			}
			break;
		case("Rest-API"):
			if($("#db-name").val() == "") {
				$("#db-name").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-name").parent().removeClass("has-error");
			}
			if($("#url").val() == "") {
				$("#url").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#url").parent().parent().removeClass("has-error");
			}
			if($("#db-description").val() == "") {
				$("#db-description").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-description").parent().removeClass("has-error");
			}
			if($("#query-name").val() == "") {
				$("#query-name").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-name").parent().removeClass("has-error");
			}
			if($("#query-intern").val() == "") {
				$("#query-intern").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-intern").parent().removeClass("has-error");
			}
			if($("#query-extern").val() == "") {
				$("#query-extern").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-extern").parent().parent().removeClass("has-error");
			}
			if($("#query-description").val() == "") {
				$("#query-description").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-description").parent().removeClass("has-error");
			}
			if(_return) {
				return true;
			} else {
				$(".modal-header h5").html("First fill in all Data!");
				return false;
			}
			break;
		case("CouchDB"):
			if($("#db-name").val() == "") {
				$("#db-name").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-name").parent().removeClass("has-error");
			}
			if($("#url").val() == "") {
				$("#url").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#url").parent().parent().removeClass("has-error");
			}
			if($("#db-description").val() == "") {
				$("#db-description").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-description").parent().removeClass("has-error");
			}
			if($("#db-instance").val() == "") {
				$("#db-instance").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-instance").parent().removeClass("has-error");
			}
			if($("#query-name").val() == "") {
				$("#query-name").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-name").parent().removeClass("has-error");
			}
			if($("#query-intern").val() == "") {
				$("#query-intern").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-intern").parent().removeClass("has-error");
			}
			if($("#query-extern").val() == "") {
				$("#query-extern").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-extern").parent().parent().removeClass("has-error");
			}
			if($("#query-description").val() == "") {
				$("#query-description").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-description").parent().removeClass("has-error");
			}
			if(_return) {
				return true;
			} else {
				$(".modal-header h5").html("First fill in all Data!");
				return false;
			}
			break;
		case("Parliament"):
			if($("#db-name").val() == "") {
				$("#db-name").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-name").parent().removeClass("has-error");
			}
			if($("#url").val() == "") {
				$("#url").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#url").parent().parent().removeClass("has-error");
			}
			if($("#db-description").val() == "") {
				$("#db-description").parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-description").parent().removeClass("has-error");
			}
			if($("#query-name").val() == "") {
				$("#query-name").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-name").parent().removeClass("has-error");
			}
			if($("#query-intern").val() == "") {
				$("#query-intern").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-intern").parent().removeClass("has-error");
			}
			if($("#query-extern").val() == "") {
				$("#query-extern").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-extern").parent().parent().removeClass("has-error");
			}
			if($("#query-description").val() == "") {
				$("#query-description").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-description").parent().removeClass("has-error");
			}
			if(_return) {
				return true;
			} else {
				$(".modal-header h5").html("First fill in all Data!");
				return false;
			}
			break;
	}
}

/*
 * Add a Button, Add a Click Listener
 */
Form.prototype.btnSend = function (text, callback) {
	$(".modal-footer").empty();
	var that = this;
	var cb = callback;
	$btnSend = $('<button type="button" class="btn btn-primary right">'+text+'</button>');
	switch(that.status) {
		case("Postgres"):
			$(".modal-footer").append('<button type="button" class="btn btn-secondary pull-left" data-dismiss="modal">Close</button>');
			$(".modal-footer").append($btnSend);
			break;
		case("Rest-API"):
			$(".modal-footer").append('<button type="button" class="btn btn-secondary pull-left" data-dismiss="modal">Close</button>');
			$(".modal-footer").append($btnSend);
			break;
		case("CouchDB"):
			$(".modal-footer").append('<button type="button" class="btn btn-secondary pull-left" data-dismiss="modal">Close</button>');
			$(".modal-footer").append($btnSend);
			break;
		default:
			$("#inputForm").append($btnSend);
			break;
	}

	//Listen on Button Clicks
	$btnSend.click(function (e) {
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
				if(that.validate()) {
					$('#myModal').modal('hide')
					db_name = $("#db-name").val();
					db_host = $("#db-host").val();
					db_port = $("#db-port").val();
					db_instance = $("db-instance").val();
					db_description = $("#db-description").val();
					db_user = $("#db-user").val();
					db_password = $("#db-password").val();

					//User
					username = that.user.username;
					
					//query
					query_name = $("#query-name").val();
					query_intern = $("#query-intern").val();
					query_extern = $("#query-extern").val();
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
						sd_name: query_name,
						sd_description: "",
						query_intern: query_intern,
						query_extern: query_extern,
						query_description: query_description,
						categories: that.categories
					}
					$.ajax({
					    type: "POST",
					    url: "http://giv-oct.uni-muenster.de:8080/api/querycheck",
					    processData: false,
					    contentType: 'application/json',
					    data: JSON.stringify(data),
					    success: function(r) {
					    	$.ajax({
							    type: "POST",
							    url: "http://giv-oct.uni-muenster.de:8080/api/submit",
							    processData: false,
							    contentType: 'application/json',
							    data: JSON.stringify(data),
							    success: function(r) {
							    	callback(r);
							    	$('#myModal').modal('hide');
								}, 
								error: function (e) {
									callback(JSON.stringyfy(e));
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
				if(that.validate()) {
					$('#myModal').modal('hide')
					db_name = $("#db-name").val();
					url = $("#url").val();
					ds_description = $("#db-description").val();

					//User
					username = that.user.username;
					
					//query
					query_name = $("#query-name").val();
					query_intern = $("#query-intern").val();
					query_extern = $("#query-extern").val();
					query_description = $("#query-description").val();

					data = {
						ds_type: "REST",
						ds_description: ds_description,
						ds_host: url,
						ds_port: "",
						db_instance: "",
						db_user: "",
						db_password: "",
						created_by: username,
						md_name: db_name,
						md_description: ds_description,
						publisher: "",
						license: "",
						sd_name: query_name,
						sd_description: "",
						query_intern: query_intern,
						query_extern: query_extern,
						query_description: query_description,
						categories: that.categories
					}
					$.ajax({
					    type: "POST",
					    url: "http://giv-oct.uni-muenster.de:8080/api/querycheck",
					    processData: false,
					    contentType: 'application/json',
					    data: JSON.stringify(data),
					    success: function(r) {
					    	$.ajax({
							    type: "POST",
							    url: "http://giv-oct.uni-muenster.de:8080/api/submit",
							    processData: false,
							    contentType: 'application/json',
							    data: JSON.stringify(data),
							    success: function(r) {
							    	callback(r);
							    	$('#myModal').modal('hide');
								}, 
								error: function (e) {
									callback(JSON.stringyfy(e));
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
				if(that.validate()) {
					db_name = $("#db-name").val();
					db_host = $("#db-host").val();
					db_port = $("#db-port").val();
					db_instance = $("#db-instance").val();
					db_description = $("#db-description").val();

					username = that.user.username;
					
					//query
					query_name = $("#query-name").val();
					query_intern = $("#query-intern").val();
					query_extern = $("#query-exter").val();
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
						sd_name: query_name,
						sd_description: "",
						query_intern: query_intern,
						query_extern: query_extern,
						query_description: query_description,
						categories: that.categories
					}
					$.ajax({
					    type: "POST",
					    url: "http://giv-oct.uni-muenster.de:8080/api/querycheck",
					    processData: false,
					    contentType: 'application/json',
					    data: JSON.stringify(data),
					    success: function(r) {
					    	$.ajax({
							    type: "POST",
							    url: "http://giv-oct.uni-muenster.de:8080/api/submit",
							    processData: false,
							    contentType: 'application/json',
							    data: JSON.stringify(data),
							    success: function(r) {
							    	callback(r);
							    	$('#myModal').modal('hide');
								}, 
								error: function (e) {
									callback(JSON.stringyfy(e));
								}
							});
						}, 
						error: function (e) {
							callback(JSON.stringyfy(e));
						}
					});
				}


				$('#myModal').modal('hide')
				

				data = {
					db_name: db_name,
					db_host: db_host,
					db_port: db_port,
					db_instance: db_instance,
					db_description: db_description,
					username: username
				}
				console.log(data);
				break;
			case("Parliament"):
				if(that.validate()) {
					
					db_name = $("#db-name").val();
					db_host = $("#db-host").val();
					db_description = $("#db-description").val();

					//User
					username = that.user.username;
					
					//query
					query_name = $("#query-name").val();
					query_intern = $("#query-intern").val();
					query_extern = $("#query-exter").val();
					query_description = $("#query-description").val();

					data = {
						ds_type: "PARLIAMENT",
						ds_description: db_description,
						ds_host: db_host,
						ds_port: "",
						db_instance: "",
						db_user: "",
						db_password: "",
						created_by: username,
						md_name: db_name,
						md_description: db_description,
						publisher: "",
						license: "",
						sd_name: query_name,
						sd_description: "",
						query_intern: query_intern,
						query_extern: query_extern,
						query_description: query_description,
						categories: that.categories
					}
					$.ajax({
					    type: "POST",
					    url: "http://giv-oct.uni-muenster.de:8080/api/querycheck",
					    processData: false,
					    contentType: 'application/json',
					    data: JSON.stringify(data),
					    success: function(r) {
					    	$.ajax({
							    type: "POST",
							    url: "http://giv-oct.uni-muenster.de:8080/api/submit",
							    processData: false,
							    contentType: 'application/json',
							    data: JSON.stringify(data),
							    success: function(r) {
							    	callback(r);
							    	$('#myModal').modal('hide');
								}, 
								error: function (e) {
									callback(JSON.stringyfy(e));
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
	})
};

Form.prototype.addUser = function (user) {
	this.user = user;
}