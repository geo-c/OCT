$(document).ready(function() {
	var url = "api/";
	var table = new Table();
	var form = new Form(table);
	var login = false;

	//Callback fired when User is logged in or signed up
	var signup_login_callback = function (data) {
		username = data.username;
		form.addUser(data);
		login = true;
		//Remove right Navbar
		$(".navbar-right li").remove();

		//Add Label to the right
		$menu = $('<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> '+username+'</a><ul class="dropdown-menu"><li><a href="#">All Datasets</a></li><li><a href="#">My Datasets</a></li><li role="separator" class="divider"></li><li><a href="#">Logout</a></li></ul></li>');
		$(".navbar-right").append($menu);

		table.Queries();
		form.addingButton();

		$(".navbar-right .dropdown ul li a").on("click", function (e) {
			switch($(this).text()) {
				case("Logout"):
					location.reload();
					break;
				case("My Datasets"): 
					table.QueriesByUser(username, form);
					break;
				case("All Datasets"):
					table.Queries();
					break;
			}
		})
	}



	//Listen on Right Tab Changes
	$(".navbar-right a").on("click", function(){
		if(!login) {
			$(".btn-group").hide();
		   	$(".nav").find(".active").removeClass("active");
		   	$(this).parent().addClass("active");
		   	switch($(this).html()) {
		   		case('Login'):
		   			form.login(signup_login_callback);
		   			break;
		   		case('Sign Up'):
		   			form.signup(signup_login_callback);
		   			break;
		   		default:
		   		console.log("jaa")
		   			break;
		   	}
		}
	});

	function init () {
		form.login(signup_login_callback);
		$("#username").focus();
		$("#password").keyup(function(event) {
			if(event.keyCode == 13) {
				$('#submit').click();
			}
		})
	}

	init();

});