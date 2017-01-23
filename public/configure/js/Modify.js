
var Modify = function (Form) {
	this.Form = Form;
	this.categories = [];
}

Modify.prototype.modify = function (id) {
	console.log(id)
	var data = this.Form.Table.data_all[id];
	console.log(data);
	switch(data.ds_type) {
		case("POSTGRES"):
			that.Postgres();
			break;
		case("Rest-API"):
			that.API();
			break;
		case("COUCHDB"):
			$('#myModalLabel').text("Modify this database");
			$('#additionalText').empty();
			$('#additionalText').append('<input id="toggle" type="checkbox" data-width="150" checked data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success" data-offstyle="danger">');
			$('#toggle').bootstrapToggle();
			if(data.active === false) {
				console.log("inactive");
				$('#toggle').bootstrapToggle('off');
			} else {
				console.log("active");
				$('#toggle').bootstrapToggle('on');
			}

			var categories = data.category_name.split(",");

			this.Form.CouchDB(data.category_name);
			$('#query-id').val(data.query_extern);
			$('#query').val(data.query_intern);
			$('#query-description').val(data.query_description);
			for(i in categories) {
				category = categories[i].replace(/ /g, '').replace(/,/g, '');
				this.categories.push(category);
	    		$("#panelCategoryName").append('<div><span class="label label-default">'+category+'</span><a id="'+category+'" href="#"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true" style="color:red;"></span></a></div>');
	    		$("#list-"+category).hide();
			}	
			$("#"+category).click(function (e) {
	    		_category = $(this).attr('id');
	    		$("#list-"+_category.replace(/ /g, '').replace(/,/g, '')).show();
	    		var index = this.categories.indexOf(_category);
				this.categories.splice(index, 1);
	    		$(this).parent().empty();
	    		$(this).parent().remove();
	    	});	
			break;
		case("PARLIAMENT"):
			this.status="Modify-Parliament";
			$('#myModalLabel').text("Modify this database");
			$('#additionalText').empty();
			$('#additionalText').append('<input id="toggle" type="checkbox" data-width="150" checked data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success" data-offstyle="danger">');
			$('#toggle').bootstrapToggle();
			console.log(data.active)
			if(data.active === false) {
				console.log("inactive");
				$('#toggle').bootstrapToggle('off');
			} else {
				console.log("active");
				$('#toggle').bootstrapToggle('on');
			}
			var categories = data.category_name.split(",");

			this.Form.Parliament(data.category_name);
			$('#query-id').val(data.query_extern);;
			$('#query').val(data.query_intern);
			$('#query-description').val(query.description);

			$('#db-name').val(data.query_description);
			$('#db-host').val(data.ds_host);
			$('#db-description').val(data.query_description)
			
			for(i in categories) {
				category = categories[i].replace(/ /g, '').replace(/,/g, '');
				this.categories.push(category);
	    		$("#panelCategoryName").append('<div><span class="label label-default">'+category+'</span><a id="'+category+'" href="#"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true" style="color:red;"></span></a></div>');
	    		$("#list-"+category).hide();
			}	
			$("#"+category).click(function (e) {
	    		_category = $(this).attr('id');
	    		$("#list-"+_category.replace(/ /g, '').replace(/,/g, '')).show();
	    		var index = this.categories.indexOf(_category);
				this.categories.splice(index, 1);
	    		$(this).parent().empty();
	    		$(this).parent().remove();
	    	});


			break;
		default:
			break;
	}
}
