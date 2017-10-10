var Validator = function () {
}

Validator.prototype.check = function (status) {
	_return = true;
	switch(status) {
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
			if($("#query").val() == "") {
				$("#query").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query").parent().removeClass("has-error");
			}
			if($("#query-id").val() == "") {
				$("#query-id").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-id").parent().parent().removeClass("has-error");
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
			if($("#query").val() == "") {
				$("#query").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query").parent().removeClass("has-error");
			}
			if($("#query-id").val() == "") {
				$("#query-id").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-id").parent().parent().removeClass("has-error");
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
			if($("#db-host").val() == "") {
				$("#db-host").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-host").parent().parent().removeClass("has-error");
			}
			if($("#db-port").val() == "") {
				$("#db-port").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-port").parent().parent().removeClass("has-error");
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
			if($("#query").val() == "") {
				$("#query").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query").parent().removeClass("has-error");
			}
			if($("#query-id").val() == "") {
				$("#query-id").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-id").parent().parent().removeClass("has-error");
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
			if($("#db-host").val() == "") {
				$("#db-host").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#db-host").parent().parent().removeClass("has-error");
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
			if($("#query").val() == "") {
				$("#query").parent().addClass("has-error");
				_return = false;
			} else {
				$("#query").parent().removeClass("has-error");
			}
			if($("#query-id").val() == "") {
				$("#query-id").parent().parent().addClass("has-error");
				_return = false;
			} else {
				$("#query-id").parent().parent().removeClass("has-error");
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
		default:
			return true;
			break;
	}
}