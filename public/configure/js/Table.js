var Table = function () {
}

Table.prototype.type = "Apps";
Table.prototype.data = [];
Table.prototype.data_all = [];
Table.prototype.dataTable = null;

/*
 * Empty Table
 */
Table.prototype.empty = function () {
	$("#table").empty();
}

/*
 * Draw Table
 */
Table.prototype.draw = function (form) {
	columns = [];
	switch(this.type) {
		case("Queries"):
			columns = [
				{ title : ""},
				{ title : "query_id"},
				{ title : "query"},
				{ title : "query_description"},
				{ title : "category"},
				{ title : "endpoint"},
				{ title : "database type"},
				{ title : "database"}
			]
			columnDefs = [
				{
		            "visible": false,
		            "targets": [0]
		        },
		        {
		        	"className": 'detail',
		        	"width": '18px',
		        	"targets":[2]
		        }
			];
			break;
		case("QueriesByUser"):
			columns = [
				{ title : "Modify"},
				{ title : "query_id"},
				{ title : "query"},
				{ title : "query_description"},
				{ title : "category"},
				{ title : "endpoint"},
				{ title : "database type"},
				{ title : "database"}
			]
			columnDefs = [
				{
		            "visible": true,
		            "targets": [0]
		        },
		        {
		        	"className": 'detail',
		        	"width": '18px',
		        	"targets":[2]
		        },
		        {
		            "targets": 0,
		            "data": null,
		            "defaultContent": '<button type="button" class="btn btn-default" aria-label="Left Align" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span></button>'
		        }
			];
			break;
		default:
			break;
	}
	this.dataTable = $('#table').DataTable( {
    	destroy: true,
    	responsive: true,
    	"searching": false,
    	"paging": false,
    	"info": false,
        data: this.data,
        columns: columns,
        "columnDefs": columnDefs
    } );

	var that = this;
    $('#table tbody').on( 'click', 'button', function () {
        var data = that.dataTable.row( $(this).parents('tr') ).data();
        $(".modal-footer").empty();
        form.Modify(data[0]);
    } );
}

/*
 * Get Data From Apps and Parse them
 */
Table.prototype.Queries = function () {
	this.type = "Queries";
	this.data = [];
	this.data_all = [];
	this.empty();
	var that = this;
	$.getJSON(new API().endpoint + "database_all", function(json){
		for(index in json) {
			_url = json[index].endpoint_host;
			if(json[index].endpoint_port != null && json[index].endpoint_port != "") {
				_url += ":" + json[index].endpoint_port + "/";
			}
			if(json[index].endpoint_path != null && json[index].endpoint_path != "") {
				_url += json[index].endpoint_path;
			}
			_url += '/dataset/' + json[index].query_extern;
			_dsUrl = json[index].ds_host;
			if(json[index].ds_port != null && json[index].ds_port != "") {
				_dsUrl += ":" + json[index].ds_port+"/";
			}
			if(json[index].query_intern.replace("<", "&lt;").replace(">", "&gt;").length > 13) {
				that.data.push([
					json[index].query_id,
					json[index].query_extern,
					json[index].query_intern.replace("<", "&lt;").replace(">", "&gt;").substring(0,10) + '...',
					json[index].query_description,
					json[index].category_name,
					_url,
					json[index].ds_type,
					_dsUrl
				]);
			} else {
				that.data.push([
					json[index].query_id,
					json[index].query_extern,
					json[index].query_intern.replace("<", "&lt;").replace(">", "&gt;"),
					json[index].query_description,
					json[index].category_name,
					_url,
					json[index].ds_type,
					_dsUrl
				]);
			}
			that.data_all.push([
				json[index].query_id,
				json[index].query_extern,
				json[index].query_intern.replace("<", "&lt;").replace(">", "&gt;"),
				json[index].query_description,
				json[index].category_name,
				_url,
				json[index].ds_type,
				_dsUrl
			]);
		}
		that.draw();

		//Set listener on Click for more Details
		$('#table tbody').on('click', 'td.detail', function () {
	        var tr = $(this).closest('tr');
	        var row = that.dataTable.row( tr );
	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            row.child( that.moreInfo(row.data()[1]) ).show();
	            tr.addClass('shown');
	        }
	    });
	});	
}

Table.prototype.QueriesByUser = function (username, form) {
	this.type = "QueriesByUser";
	this.data = [];
	this.data_all = [];
	this.empty();
	var that = this;
	$.getJSON(new API().endpoint + "database_all/" + username, function(json){
		that.data_all = [];
		for(index in json) {
			that.data_all[json[index].query_id] = json[index];

			_url = json[index].endpoint_host;
			if(json[index].endpoint_port != null && json[index].endpoint_port != "") {
				_url += ":" + json[index].endpoint_port + "/";
			}
			if(json[index].endpoint_path != null && json[index].endpoint_path != "") {
				_url += json[index].endpoint_path;
			}
			_url += '/dataset/' + json[index].query_extern;
			_dsUrl = json[index].ds_host;
			if(json[index].ds_port != null && json[index].ds_port != "") {
				_dsUrl += ":" + json[index].ds_port+"/";
			}
			if(json[index].query_intern.replace("<", "&lt;").replace(">", "&gt;").length > 13) {
				that.data.push([
					json[index].query_id,
					json[index].query_extern,
					json[index].query_intern.replace("<", "&lt;").replace(">", "&gt;").substring(0,10) + '...',
					json[index].query_description,
					json[index].category_name,
					_url,
					json[index].ds_type,
					_dsUrl
				]);
			} else {
				that.data.push([
					json[index].query_id,
					json[index].query_extern,
					json[index].query_intern.replace("<", "&lt;").replace(">", "&gt;"),
					json[index].query_description,
					json[index].category_name,
					_url,
					json[index].ds_type,
					_dsUrl
				]);
			}
			that.data_all.push([
				json[index].query_id,
				json[index].query_extern,
				json[index].query_intern.replace("<", "&lt;").replace(">", "&gt;"),
				json[index].query_description,
				json[index].category_name,
				_url,
				json[index].ds_type,
				_dsUrl
			]);
		}
		that.draw(form);

		//Set listener on Click for more Details
		$('#table tbody').on('click', 'td.detail', function () {
	        var tr = $(this).closest('tr');
	        var row = that.dataTable.row( tr );
	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            row.child( that.moreInfo(row.data()[1]) ).show();
	            tr.addClass('shown');
	        }
	    });
	});	
}


/*
 * Expand Table to show more Information
 */
Table.prototype.moreInfo = function (data) {
	console.log(this.data_all);
	console.log(data);
	for(i in this.data_all) {
		console.log(this.data_all[i][1])
		if(this.data_all[i][1] == data) {
			return '<center><code>' + this.data_all[i][2] + '</code></center>';
		}
	}
	return '';
}