$(document).ready(function() {
	var url = "api/";


	var table = new Table(data);
	var graph = new Graph(data);
	var status = "Apps";

	//Init
	init();

	$(document).on('click','.navbar-collapse.in',function(e) {
	    if( $(e.target).is('a') ) {
	        $(this).collapse('hide');
	    }
	});

	//Listen on Left Tab Changes
	$(".navbar-left a").on("click", function(){
		$(".btn-group").show();
	   	$(".nav").find(".active").removeClass("active");
	   	$(this).parent().addClass("active");
	   	status = $(this).html().replace(/\s/g, '');
	   	$("#btn-table").addClass("active");
	   	$("#btn-graph").removeClass("active");
	   	showTable();
	});

	//Listen on Right Tab Changes
	$(".navbar-right a").on("click", function(){
		$(".btn-group").show();
	   	$(".nav").find(".active").removeClass("active");
	   	$(this).parent().addClass("active");
	   	status = $(this).text().replace(/\s/g, '');
	   	$("#btn-table").addClass("active");
	   	$("#btn-graph").removeClass("active");
	   	switch(status) {
	   		case("StartTour"):
	   				introJs().start();
	   			break;
	   		case("RegisteranApp"):
	   			signupForm();
	   			break;
	   		default:
	   			console.log("Unknown Status: " + status);
	   			break;
	   	}
	});

	//Listen on Button-Group Clicks
	$(".btn-group-justified div button").on("click", function(){
		$(".btn-group").find(".active").removeClass("active");
		$(this).addClass("active");
		if($(this).html() == "Table") {
			showTable();
		} else if ($(this).html() == "Graph") {
			showGraph();
		} else if ($(this).html() == "Map") {
			console.log("map")
			location = location.origin + '/map';
		}
	});

	//Init the table. Show first Tab content (Apps)
	function init() {
		showTable();
	}


	function signupForm() {
		$('#content').empty('');
		$('#content').append($('<label for="appname-label">App Name (required)</label>'));
		$('#content').append($('<input type="text" class="form-control" id="appname" aria-describedby="basic-addon3">'));

		$('#content').append($('<label for="description-label">Type of component</label>'));
		dropdown =  '<div class="row">'
		dropdown += '	<div class="col-md-3">'
		dropdown += '		<div class="radio">'
  		dropdown += '			<label><input type="radio" name="optradio">MobileApp</label>'
		dropdown += '		</div>'
		dropdown += '	</div>'
		dropdown += '	<div class="col-md-3">'
		dropdown += '		<div class="radio">'
  		dropdown += '			<label><input type="radio" name="optradio">WebApp</label>'
		dropdown += '		</div>'
		dropdown += '	</div>'
		dropdown += '	<div class="col-md-3">'
		dropdown += '		<div class="radio">'
  		dropdown += '			<label><input type="radio" name="optradio">Service</label>'
		dropdown += '		</div>'
		dropdown += '	</div>'
		dropdown += '	<div class="col-md-3">'
		dropdown += '		<div class="radio">'
  		dropdown += '			<label><input type="radio" name="optradio">Guideline</label>'
		dropdown += '		</div>'
		dropdown += '	</div>'
		dropdown += '</div>'
		/*
		dropdown = '<div class="dropdown">'
	  	dropdown += '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'
	    dropdown += 'App'
	    dropdown += '<span class="caret"></span>'
	  	dropdown += '</button>'
	  	dropdown += '<ul class="dropdown-menu" aria-labelledby="dropdownMenu">'
	    dropdown += '<li><a href="#">App</a></li>'
	    dropdown += '<li><a href="#">Service</a></li>'
	    dropdown += '<li><a href="#">Guideline</a></li>'
	  	dropdown += '</ul>'
		dropdown += '</div>'*/
  		$('#content').append($(dropdown));

  		var type = "App";
  		$('.radio').click(function(e) {
  			type = $(this).children().text();
  		});
  		/*$('ul.dropdown-menu li a').click(function (e) {
		    var $div = $(this).parent().parent().parent(); 
		    var $btn = $div.find('button');
		    $btn.html($(this).text() + ' <span class="caret"></span>');
		    $div.removeClass('open');
		    e.preventDefault();
		    type = $(this).text();
		});*/



		$('#content').append($('<label for="description-label">Description</label>'));
		$('#content').append($('<input type="text" class="form-control" id="description" aria-describedby="basic-addon3">'));

		$('#content').append($('<label for="email-label">Email (required)</label>'));
		$('#content').append($('<input type="text" class="form-control" id="email" aria-describedby="basic-addon3">'));

		$('#content').append($('<label for="firstname-label">First Name (required)</label>'));
		$('#content').append($('<input type="text" class="form-control" id="firstname" aria-describedby="basic-addon3">'));

		$('#content').append($('<label for="lastname-label">Last Name (required)</label>'));
		$('#content').append($('<input type="text" class="form-control" id="lastname" aria-describedby="basic-addon3">'));

		$('#content').append($('<label for="lastname-label">Website (required)</label>'));
		$('#content').append($('<input type="text" class="form-control" id="website" aria-describedby="basic-addon3">'));

		$btn = $('<br><button type="button" class="btn btn-primary right">Signup</button>');
		$('#content').append($btn);
		$btn.click(function () {
			var data = {
				"app_name": $('#appname').val(),
				"app_description": $('#description').val(),
    			"email_address": $('#email').val(),
   				"first_name": $('#firstname').val(),
    			"last_name": $('#lastname').val(),
    			"url": $("#website").val(),
    			"type": type
			}
			console.log(data);
			
			if(data.app_name != "" || data.email_address != "" || data.first_name != "" || data.last_name != "" || data.url != "" ) {
				$.ajax({
				    type: "POST",
				    url: new API().endpoint + "signup",
				    processData: false,
				    contentType: 'application/json',
				    data: JSON.stringify(data),
				    success: function(r) {
				    	$('#content').empty('');
				    	$('#content').append('<label>Your App has been signed up.</label>');
				    	$('#content').append('<br><label>Your API Key is:</label>');
				    	$('#content').append('<br><section><code>' + r.app_hash + '</code></section>');
				    	$('#content').append('<br><br><label>Your key has also been sent to your email address</label>');
				    	$('#content').append('<br><br><label>The URL of the API is: <a>http://giv-oct2.uni-muenster.de:8080/api/</a>');
				    	$('#content').append('<br><br><label>You can query the Databases with <a  href="http://giv-oct2.uni-muenster.de:8080/api/query/Traffic?authorization='+r.app_hash+'">http://giv-oct2.uni-muenster.de:8080/api/query/:categoryname:?authorization=YourAPIKey</a>');
				    	$('#content').append('<br><br>If you have further Questions please visit: <a>http://giv-oct2.uni-muenster.de:8080/docs/architecture/rest-api/</a>');

				    	console.log(r);
					}, 
					error: function(e) {
						console.log(e);
						alert("Not all required fields have values")
					}
				});
			} else {
				alert("Not all required fiels have values");
			}
		});
	}

	//Show Table depending on status
	function showTable() {
		switch(status) {
			case("Apps"):
				table.Apps();
				break;
			case("Categories"):
				table.Categories();
				break;
			case("Usage"):
				table.Usage();
				break;
			case("Datasets"):
				table.Datasets();
				break;
			case("DatasetsperCategory"):
				table.DatasetsPerCategory();
				break;
			default:
				break;
		}
	}

	//Show Table depending on status
	function showGraph() {
		switch(status) {
			case("Apps"):
				graph.Apps();
				break;
			case("Categories"):
				graph.Categories();
				break;
			case("Usage"):
				graph.Usage();
				break;
			case("Datasets"):
				graph.Datasets();
				break;
			case("DatasetsperCategory"):
				graph.DatasetsPerCategory();
				break;
			default:
				break;
		}
	}

});