var Table = function () {
}

Table.prototype.url = "http://giv-oct.uni-muenster.de:8080/api/";
Table.prototype.type = "Apps";
Table.prototype.data = [];
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
	columnDefs = [];
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
    	scrollY: '60vh',
        scrollCollapse: true,
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
        form.Modify(data);
    } );
}

/*
 * Get Data From Apps and Parse them
 */
Table.prototype.Queries = function () {
	this.type = "Queries";
	this.data = [];
	this.empty();
	var that = this;
	$.getJSON(this.url + "database_all", function(json){
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
			that.data.push([
				json[index].query_id,
				json[index].query_extern,
				json[index].query_intern,
				json[index].query_description,
				json[index].category_name,
				_url,
				json[index].ds_type,
				_dsUrl
				]);
		}
		that.draw();
	});	
}

Table.prototype.QueriesByUser = function (username, form) {
	this.type = "QueriesByUser";
	this.data = [];
	this.empty();
	var that = this;
	$.getJSON(this.url + "database_all/" + username, function(json){
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
			console.log(json[index].active)
			that.data.push([
				json[index].query_id,
				json[index].query_extern,
				json[index].query_intern,
				json[index].query_description,
				json[index].category_name,
				_url,
				json[index].ds_type,
				_dsUrl
				]);
		}
		that.draw(form);
	});	
}
