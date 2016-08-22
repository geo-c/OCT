var Table = function () {
}

Table.prototype.url = "api/";
Table.prototype.type = "Apps";
Table.prototype.data = [];
Table.prototype.dataTable = null;

/*
 * Empty Table
 */
Table.prototype.empty = function () {
	$("#content").empty();
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
		case("Information"):
			columns = [
				{title: ""},
				{title: "More"},
				{title: "Category"},
				{title: "Count"}
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

/*
 * Get Data From Apps and Parse them
 */
Table.prototype.Apps = function () {
	this.type = "Apps";
	this.data = [];
	this.empty();
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(this.url + "apps", function(json){
		for(index in json) {
			that.data.push([json[index].app_hash, '', json[index].app_name, json[index].app_description, json[index].calls]);
		}
		that.draw();
		//Set listener on Click for more Details
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

/*
 * Get Data From Categories and Parse them
 */
Table.prototype.Categories = function () {
	this.type = "Categories";
	this.data = [];
	this.empty;
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(this.url + "categories", function(json){
		for(index in json) {
			that.data.push([json[index].category_id, '', json[index].category_name, json[index].calls]);
		}
		that.draw();
		//Set listener on Click for more Details
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

/*
 * Get Data From Usage and Parse them
 */
Table.prototype.Usage = function () {
	this.type = "Usage";
	this.data = [];
	this.empty();
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(this.url + "logs/countByDay", function(json){
		for(index in json) {
			date =  json[index].date.slice(0, json[index].date.lastIndexOf("T"))
			that.data.push([date, '',date, json[index].count]);
		}
		that.draw();
		//Set listener on Click for more Details
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

Table.prototype.Information = function () {
	this.type = "Information";
	this.data = [];
	this.empty();
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(this.url + "categories/withDatasets", function(json){
		for(index in json) {
			that.data.push([json[index].category_id, '', json[index].category_name, json[index].count]);
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

/*
 * Expand Table to show more Information
 */
Table.prototype.moreInfo = function (data) {
	//Check which Type is active
	switch(this.type) {
		case("Apps"):
			var ssdata = data.substring(0,16);
			$.getJSON(this.url + "apps/" + data + '/logsByCategory', function(json){
				for(index in json) {
					$('#'+ssdata+'-categories').append('<tr><td>'+json[index].category_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+ssdata+'-detail"><thead><th>Categories</th><th>Count</th></thead><tr><td id="'+ssdata+'-categories"></td></tr></table>';
		case("Categories"):
			$.getJSON(this.url + "categories/" + data + '/apps', function(json){
				for(index in json) {
					$('#'+data+'-app').append('<tr><td>'+json[index].app_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+data+'-detail"><thead><th>App</th><th>Count</th></thead><tr><td id="'+data+'-app"></td><td id="Calls"></td></tr></table>';
		case("Usage"):
			$.getJSON(this.url + "apps/byDate/" + data, function(json){
				for(index in json) {
					$('#'+data+'-apps').append('<tr><td>'+json[index].app_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			$.getJSON(this.url + "categories/byDate/" + data, function(json){
				for(index in json) {
					$('#'+data+'-categories').append('<tr><td>'+json[index].category_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+data+'-detail"><thead><th>Apps</th><th>Categories</th></thead><tr><td id="'+data+'-apps"></td><td id="'+data+'-categories"></td></tr></table>';
		case("Information"):
			$.getJSON(this.url + "categories/withDatasets/" + data, function(json){
				for(index in json) {
					$('#'+data+'-datasets').append('<tr><td>'+json[index].md_name+'</td></tr>');
				}
			});
			return '<table id="'+data+'-detail"><thead><th>Datasets</th></thead><tr><td id="'+data+'-datasets"></td></tr></table>';
		default:
			return null;
			break;
	}
}