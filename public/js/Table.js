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
	            { title: "API Calls" }
			];
			break;
		case("Categories"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Name" },
	            { title: "Calls" }
			];
			break;
		case("Usage"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Date" },
	            { title: "API Calls" }
			];
			break;
		case("Datasets"):
			columns = [
				{title: ""},
				{title: "More"},
				{title: "Dataset"},
				{title: "API Calls"}
			];
			break;
		case("DatasetsPerCategory"):
			columns = [
				{title: ""},
				{title: "More"},
				{title: "Category"},
				{title: "Number of Datasets"}
			];
			break;
		default:
			break;
	}
	if(this.type == "Usage") {
		this.dataTable = $('#table').DataTable( {
	    	destroy: true,
	    	responsive: true,
	    	"searching": false,
	    	"order": [[2, "desc"]],
	    	scrollY: '60vh',
	        scrollCollapse: true,
	    	"paging": false,
	    	"info": false,
	        data: this.data,
	        columns: columns,
	        "columnDefs": columnDefs
	    } );
	} else {
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
	 		if(row.data()[4] != 0) {
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
		    } else {
		    	tr.addClass("unavailable");
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
	 		if(row.data()[3] != 0) {
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
	    	} else {
		    	tr.addClass("unavailable");
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
	 		if(row.data()[3] != 0) {
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
	    	} else {
		    	tr.addClass("unavailable");
		    }
	    });
	});
}

Table.prototype.Datasets = function () {
	this.type = "Datasets";
	this.data = [];
	this.empty();
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(this.url + "tdataset", function(json){
		for(index in json) {
			console.log(json[index])
			that.data.push([json[index].sd_id, '', json[index].dataset, json[index].count]);
		}
		that.draw();
		$('#table tbody').on('click', 'td.details-control', function () {
	        var tr = $(this).closest('tr');
	        var row = that.dataTable.row( tr );
	 		if(row.data()[3] != 0) {
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
	 		} else {
		    	tr.addClass("unavailable");
		    }
	    });
    });
}

Table.prototype.DatasetsPerCategory = function () {
	this.type = "DatasetsPerCategory";
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
	 		console.log(row.data())
	 		if(row.data()[3] != 0) {
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
	 		} else {
		    	tr.addClass("unavailable");
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
			$.getJSON(this.url + "apps/" + data + '/logsByDataset', function(json){
				for(index in json) {
					$('#'+ssdata+'-dataset').append('<tr><td>'+json[index].dataset+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+ssdata+'-detail"><thead><th>Categories</th><th>Count</th><th>Dataset</th><th>Count</th></thead><tr><td id="'+ssdata+'-categories"></td><td id="'+ssdata+'-dataset"></td></tr></table>';
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
		case("Datasets"):
			$.getJSON(this.url + "tdataset/" + data, function(json){
				for(index in json) {
					$('#'+data+'-datasets').append('<tr><td>'+json[index].app_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+data+'-detail"><thead><th>Datasets</th><th>Count</th></thead><tr><td id="'+data+'-datasets"></td></tr></table>';
		case("DatasetsPerCategory"):
			$.getJSON(this.url + "categories/withDatasets/" + data, function(json){
				for(index in json) {
					$('#'+data+'-datasetsPerCategory').append('<tr><td>'+json[index].md_name+'</td></tr>');
				}
			});
			return '<table id="'+data+'-detail"><thead><th>Datasets</th></thead><tr><td id="'+data+'-datasetsPerCategory"></td></tr></table>';
		default:
			return null;
			break;
	}
}