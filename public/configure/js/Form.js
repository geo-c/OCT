var Form = function (Table) {
	this.Table = Table;
}

Form.prototype.elements = new Elements();
Form.prototype.status = "";
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
	$('#add-a-query').hide();
	this.status = "login";
	this.empty();
	$("#form").append('<div id=inputForm></div>');
	$('#inputForm').append(this.elements.username());
	$('#inputForm').append(this.elements.password());
	this.btnSend("Login", callback);
}

/*
 * Show Fields for Signup
 */
Form.prototype.signup = function (callback) {
	$('#add-a-query').hide();
	this.status = "signup";
	this.empty();
	$("#form").append('<div id=inputForm></div>');
	$('#inputForm').append(this.elements.username());
	$('#inputForm').append(this.elements.first_name());
	$('#inputForm').append(this.elements.last_name());
	$('#inputForm').append(this.elements.email());
	$('#inputForm').append(this.elements.password());
	this.btnSend("Sign up", callback);
}

Form.prototype.addingButton = function () {
	this.empty();
	/*$space = $('<br>')
	$button = $('<button type="button" class="btn btn-success btn-lg" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-plus"></span>Add a Query</button>');
	$("#form").append($space);
	$("#form").append($button);
	$("#form").append($space);*/
	$('#add-a-query').show();

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
    dropdown += '<li><a href="#">Triple Store</a></li>'
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
			case("TripleStore"):
				that.status ="Parliament";
				that.Parliament();
				break;
			default:
				break;
		}

	    return false;
	});
}

Form.prototype.Modify = function (id) {
	this.emptyForm();
	$(".modal-body").append('<div id=inputForm></div>');
	$('#inputForm').append('<div id="inputContent"></div>');
	console.log("start modify");
	modify = new Modify(this).modify(id);
}

/*
 * Show Fields for a Postgres Database
 */
Form.prototype.Postgres = function (categories, modify) {
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
	$('#panelDatabase').append(this.elements.db_name());
	$('#panelDatabase').append(this.elements.db_host());
	$('#panelDatabase').append(this.elements.db_port());
	$('#panelDatabase').append(this.elements.db_instance());
	$('#panelDatabase').append(this.elements.db_user());
	$('#panelDatabase').append(this.elements.db_password());
	$('#panelDatabase').append(this.elements.db_description());
	//Query
	$('#panelQuery').append(this.elements.queryId());
	$('#panelQuery').append(this.elements.query());
	$('#panelQuery').append(this.elements.queryDescription());
	//Category
	this.Categories(categories);
	var that = this;
	if(modify) {
		this.btnSend("Send", function (e) {
			alert(e);
		});
	} else {
		this.btnSend("Send", function (e) {
			alert(e);
			that.Table.Queries();
		});
	}	
}

/*
 * Show Fields for a Rest-API
 */
Form.prototype.API = function (categories, modify) {
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
	$('#panelDatabase').append(this.elements.db_name());
	$('#panelDatabase').append(this.elements.url());
	$('#panelDatabase').append(this.elements.db_description());
	//Query
	$('#panelQuery').append(this.elements.queryId());
	$('#panelQuery').append(this.elements.query());
	$('#panelQuery').append(this.elements.queryDescription());
	//Category
	this.Categories(categories);
	var that = this;
	if(modify) {
		this.btnSend("Send", function (e) {
			alert(e);
		});
	} else {
		this.btnSend("Send", function (e) {
			alert(e);
			that.Table.Queries();
		});
	}	
}

/*
 * Show Fields for a CouchDB
 */
Form.prototype.CouchDB = function (categories, modify) {
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
	$('#panelDatabase').append(this.elements.db_name());
	$("#panelDatabase").append(this.elements.db_host());
	$("#panelDatabase").append(this.elements.db_port());
	$("#panelDatabase").append(this.elements.db_instance());
	$("#panelDatabase").append(this.elements.db_description());
	//Query
	$('#panelQuery').append(this.elements.queryId());
	$('#panelQuery').append(this.elements.query());
	$('#panelQuery').append(this.elements.queryDescription());
	//Category
	this.Categories(categories);
	var that = this;
	if(modify) {
		this.btnSend("Send", function (e) {
			alert(e);
		});
	} else {
		this.btnSend("Send", function (e) {
			alert(e);
			that.Table.Queries();
		});
	}	
}

Form.prototype.Parliament = function (categories, modify) {
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
	$('#panelDatabase').append(this.elements.db_name());
	$('#panelDatabase').append(this.elements.db_host());
	$('#panelDatabase').append(this.elements.db_description());
	//Query
	$('#panelQuery').append(this.elements.queryId());
	$('#panelQuery').append(this.elements.query());
	$('#panelQuery').append(this.elements.queryDescription());
	//Category
	this.Categories(categories);
	var that = this;
	if(modify) {
		this.btnSend("Send", function (e) {
			alert(e);
		});
	} else {
		this.btnSend("Send", function (e) {
			alert(e);
			that.Table.Queries();
		});
	}	
}

Form.prototype.Categories = function (categories) {
	var that = this;

	dropdown = '<div class="dropdown">'
  	dropdown += '<button class="btn btn-success dropdown-toggle" type="button" id="categoryDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
    dropdown += 'Add Category'
    dropdown += '<span class="caret"></span>'
  	dropdown += '</button>'
  	dropdown += '<ul class="dropdown-menu category" aria-labelledby="dropdownMenu">'
	dropdown += '</ul>'
	dropdown += '</div>'
	$('#panelCategoryDropdown').append($(dropdown));

	$.getJSON( new API().endpoint + "categories/withDatasets/get", function (json) {
		list = "";
		for(i in json) {
			list += '<li id="list-'+json[i].category_name.replace(/ /g, '').replace(/,/g, '')+'"><a href="#">'+json[i].category_name+'</a></li>';
		}
		$('ul.dropdown-menu.category').append(list);
		
		if(categories) {
			for(i in categories) {
				category = categories[i].replace(/ /g, '').replace(/,/g, '');
				console.log("hide: "+ category);
				$("#list-"+category).hide();
			}
		}

		$('ul.dropdown-menu.category').on('click', 'li a', function (e) {
		    var $div = $(this).parent().parent().parent(); 
	    	$div.removeClass('open');
	    	e.preventDefault();
	    	category = $(this).text();
	    	_category = category.replace(/ /g, '').replace(/,/g, '');
	    	that.categories.push(category);
	    	$("#panelCategoryName").append('<div><span class="label label-default">'+category+'</span><a id="'+_category+'" href="#"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true" style="color:red;"></span></a></div>');
	    	$(this).parent().hide();
	    	$("#"+_category).click(function (e) {
	    		_category2 = $(this).attr('id');
	    		$("#list-"+_category.replace(/ /g, '').replace(/,/g, '')).show();
	    		var index = that.categories.indexOf(_category2);
				that.categories.splice(index, 1);
	    		$(this).parent().empty();
	    		$(this).parent().remove();
	    	});
		});
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
	panel += '<div id="panelCategoryDropdown"></div>'
	panel += '<div id="panelCategoryName"></div>'
	panel += '</div></div></div>'
	return $(panel);
}

/*
 * Add a Button, Add a Click Listener
 */
Form.prototype.btnSend = function (text, callback) {
	$(".modal-footer").empty();
	var that = this;
	var cb = callback;
	$btnSend = $('<button type="button" id="submit" class="btn btn-primary right">'+text+'</button>');
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
		case("Parliament"):
			$(".modal-footer").append('<button type="button" class="btn btn-secondary pull-left" data-dismiss="modal">Close</button>');
			$(".modal-footer").append($btnSend);
			break;
		default:
			$("#inputForm").append($btnSend);
			break;
	}

	//Listen on Button Clicks
	$btnSend.click(function (e) {
		submit = new Submit(that.user, that.categories);
		submit.submit(that.status, callback);
		//Check which status is active
	})
};

Form.prototype.addUser = function (user) {
	this.user = user;
}