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
Table.prototype.draw = function () {
	columns = [];
	columnDefs = [
		{
            "visible": false,
            "targets": [0]
        },
        {
        	"className": 'details-control',
        	"width": '18px',
        	"targets":[1]
        }
	];
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
