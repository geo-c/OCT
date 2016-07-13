var Table = function () {
}

Table.prototype.url = "api/";
Table.prototype.type = "Apps";
Table.prototype.data = [];
Table.prototype.dataTable = null;

Table.prototype.empty = function () {
	$("#content").empty();
}

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
		case("Apps"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Name" },
	            { title: "Description" },
	            { title: "Count" }
			];
			break;
		case("Categories"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Name" },
	            { title: "Count" }
			];
			break;
		case("Usage"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Date" },
	            { title: "Count" }
			];
			break;
		default:
			break;
	}
    this.dataTable = $('#table').DataTable( {
    	destroy: true,
    	responsive: true,
    	"searching": false,
    	"ordering": false,
    	"paging": false,
    	"info": false,
        data: this.data,
        columns: columns,
        "columnDefs": columnDefs
    } );
}

Table.prototype.Apps = function () {
	this.type = "Apps";
	this.data = [];
	this.empty();
	//$("#content").html('<table id="table" class="display" style="width=100%;"><thead><tr><th style=\"display:none;\"></th><th class=\"details-control sorting_disabled headrow\" rowspan=\"1\" colspan=\"1\" aria-label=\"\" style=\"width: 18px;\">More</th><th>Name</th><th>Description</th><th>Calls</th></tr></thead><tbody></tbody></table>');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(this.url + "apps", function(json){
		for(index in json) {
			that.data.push([json[index].app_hash, '', json[index].app_name, json[index].app_description, json[index].calls]);
		}
		that.draw();
		$('#table tbody').on('click', 'td.details-control', function () {
	        var tr = $(this).closest('tr');
	        var row = that.dataTable.row( tr );
	 
	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            row.child( that.moreInfo(row.data()[0]) ).show();
	            tr.addClass('shown');
	        }
	    });
	});	
}

Table.prototype.Categories = function () {
	this.type = "Categories";
	this.data = [];
	this.empty;
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(this.url + "categories", function(json){
		for(index in json) {
			that.data.push([json[index].category_id, '', json[index].catgegory_name, json[index].calls]);
		}
		that.draw();
		$('#table tbody').on('click', 'td.details-control', function () {
	        var tr = $(this).closest('tr');
	        var row = that.dataTable.row( tr );
	 
	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            row.child( that.moreInfo(row.data()[0]) ).show();
	            tr.addClass('shown');
	        }
	    });
	});	
}

Table.prototype.Usage = function () {
	this.type = "Usage";
	this.data = [];
	this.empty();
	//$("#content").html('<table id="table" class="display" style="width=100%;"><thead><tr><th style=\"display:none;\"></th><th class=\"details-control sorting_disabled headrow\" rowspan=\"1\" colspan=\"1\" aria-label=\"\" style=\"width: 18px;\">More</th><th>Name</th><th>Description</th><th>Calls</th></tr></thead><tbody></tbody></table>');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(this.url + "logs/countByDay", function(json){
		for(index in json) {
			that.data.push([index, '', json[index].date.slice(0, json[index].date.lastIndexOf("T")), json[index].count]);
		}
		that.draw();
		$('#table tbody').on('click', 'td.details-control', function () {
	        var tr = $(this).closest('tr');
	        var row = that.dataTable.row( tr );
	 
	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            row.child( that.moreInfo(row.data()[0]) ).show();
	            tr.addClass('shown');
	        }
	    });
	});
}

Table.prototype.moreInfo = function (data) {
	switch(this.type) {
		case("Apps"):
			var ssdata = data.substring(0,16);
			$.getJSON(this.url + "apps/" + data + '/logsByTag', function(json){
				for(index in json) {
					$('#'+ssdata+'-tags').append('<tr><td>'+json[index].tag_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			$.getJSON(this.url + "apps/" + data + '/logsByCategory', function(json){
				for(index in json) {
					$('#'+ssdata+'-categories').append('<tr><td>'+json[index].catgegory_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+ssdata+'-detail"><thead><th>Tags</th><th>Categories</th></thead><tr><td id="'+ssdata+'-tags"></td><td id="'+ssdata+'-categories"></td></tr></table>';
		case("Categories"):
			$.getJSON(this.url + "categories/" + data + '/apps', function(json){
				for(index in json) {
					$('#'+data+'-app').append('<tr><td>'+json[index].app_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+data+'-detail"><thead><th>App</th><th>Calls</th></thead><tr><td id="'+data+'-app"></td><td id="Calls"></td></tr></table>';
		case("Usage"):
			return '<table></table>'
		default:
			return null;
			break;
	}
}