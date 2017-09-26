var Table = function () {
}

Table.prototype.type = "Apps";
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
/*Table.prototype.draw = function () {
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
				{ title: "ID" },
	            { title: "More" },
	            { title: 'Name' },
	            { title: 'Description' },
	            { title: 'Category Search  <a id="help-search"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' },
	            { title: 'Dataset Search  <a id="help-api"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' }
			];
			columnDefs = [
				{
		            "visible": false,
		            "targets": [0]
		        },
		        {
		            "visible": false,
		            "targets": [1]
		        },
		        {
		        	"className": 'details-control',
		        	"width": '18px',
		        	"targets":[2]
		        }
			]
			break;
		case("Categories"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Name" },
	            { title: 'Searches   <a id="help-search"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' },
	            {title: 'Number of Datasets  <a id="help-numodata"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>'}
			];
			break;
		case("Usage"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Date" },
	            { title: 'Category Search  <a id="help-search"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' },
	            { title: 'Dataset Search  <a id="help-api"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' }
			];
			break;
		case("Datasets"):
			columns = [
				{title: ""},
				{title: "More"},
				{title: "Dataset"},
				{ title: 'Dataset Search  <a id="help-api"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' }
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
	    	"paging": false,
	    	"info": false,
	        data: this.data,
	        columns: columns,
	        "columnDefs": columnDefs,
	        "createdRow": function ( row, data, index ) {

	        }
	    } );
	} else {
		this.dataTable = $('#table').DataTable( {
	    	destroy: true,
	    	responsive: true,
	    	"searching": false,
	    	"paging": false,
	    	"info": false,
	        data: this.data,
	        columns: columns,
	        "columnDefs": columnDefs,
	        "createdRow": function ( row, data, index ) {
	            if ( data[5] == "waiting<span>.</span><span>.</span><span>.</span>") {
	                $('td', row).eq(3).addClass('waiting');
	            } else {
	            	$('td', row).eq(3).removeClass('waiting');
	            }
	            if ( data[6] == "waiting<span>.</span><span>.</span><span>.</span>") {
	                $('td', row).eq(4).addClass('waiting');
	            }  else {
	            	$('td', row).eq(4).removeClass('waiting');
	            }
	        }
	    } );
	}  
}*/

/*
 * Get Data From Apps and Parse them
 */
Table.prototype.Apps = function () {
	this.type = "Usage";
	this.data = [];
	this.empty();
	var pbar = $('#pbar');
	pbar.width(0 + '%');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;

	$('#table').DataTable( {
	    ajax:           '/api/apps',
	    destroy: true,
	    responsive: true,
	    "searching": false,
    	"order": [[2, "desc"]],
    	"info": false,
	    columns: columns.apps,
	    columnDefs: columnDefs.apps,
	    deferRender:    true,
        scrollY:        false,
        scrollX: 		false, 
        scrollCollapse: true,
        scroller:       {
        	boundaryScale: 0.8,
        	displayBuffer: 2
        }
	} );
	/*this.type = "Apps";
	this.data = [];
	this.empty();
	var pbar = $('#pbar');
	pbar.width(0 + '%');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;


	$.getJSON(new API().endpoint + "apps", function(json){
		for(index in json) {
			that.data.push([json[index].app_hash, index, '', json[index].app_name, json[index].app_description, json[index].searches, json[index].api_calls]);
		}
		//that.draw();


		
		var count = 0;
		for(index in that.data) {
			(function(index)
				{
					$.getJSON(new API().endpoint + "apps/" + that.data[index][0], function(result) {
						that.data[index][5] = result[0].searches;
						that.data[index][6] = result[0].api_calls;
						
						count++;
						pbar.width(count/that.data.length*100 + '%');
						//that.draw();
					});
				}
			)(index);
			
		}

		$("thead a").on('click', function (e) {
			e.stopImmediatePropagation();
			$('#myModal').modal('show');
			$("#txtSearch").hide();
			$("#txtAPI").hide();
			switch($(this).attr("id")) {
				case("help-search"):
					$("#txtSearch").show();
					break;
				case("help-api"):
					$("#txtAPI").show();
					break;
			}
		});
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
	            row.child( that.moreInfo(row.data()[1], row.data()[0]) ).show();
	            tr.addClass('shown');
	        }
	    });
	});	*/
}

/*
 * Get Data From Categories and Parse them
 */
Table.prototype.Categories = function () {
	this.type = "Usage";
	this.data = [];
	this.empty();
	var pbar = $('#pbar');
	pbar.width(0 + '%');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	console.log(columnDefs.categories);
	$('#table').DataTable( {
	    ajax:           '/api/apps',
	    destroy: true,
	    responsive: true,
	    "searching": false,
    	"order": [[2, "desc"]],
    	"info": false,
	    columns: columns.categories,
	    columnDefs: columnDefs.categories,
	    deferRender:    true,
        scrollY:        false,
        scrollX: 		false, 
        scrollCollapse: true,
        scroller:       {
        	boundaryScale: 0.8,
        	displayBuffer: 2
        }
	} );

	/*
	this.type = "Categories";
	this.data = [];
	this.empty;
	var pbar = $('#pbar');
	pbar.width(0 + '%');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(new API().endpoint + "categories", function(json){
		for(index in json) {
			that.data.push([json[index].category_id, '', json[index].category_name, json[index].searches, json[index].datasets]);
		}
		//that.draw();


		
		var count = 0;
		for(index in that.data) {
			(function(index)
				{
					$.getJSON(new API().endpoint + "categories/" +json[index].category_id, function(result) {
						that.data[index][3] = result[0].searches;
						that.data[index][4] = result[0].datasets;

						count++;
						pbar.width(count/that.data.length*100 + '%');
						//that.draw();
					});
				}
			)(index);
			
		}

		$("thead a").on('click', function (e) {
			e.stopImmediatePropagation();
			$('#myModal').modal('show');
			$("#txtSearch").hide();
			$("#txtAPI").hide();
			switch($(this).attr("id")) {
				case("help-search"):
					$("#txtSearch").show();
					break;
				case("help-numodata"):
					$("#txtNumOData").show();
					break;
			}
		});
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
	});	*/
}

/*
 * Get Data From Usage and Parse them
 */
Table.prototype.Usage = function () {
	this.type = "Usage";
	this.data = [];
	this.empty();
	var pbar = $('#pbar');
	pbar.width(0 + '%');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;

	$('#table').DataTable( {
	    ajax:           '/api/logs/byDay',
	    destroy: true,
	    responsive: true,
	    "searching": false,
    	"order": [[2, "desc"]],
    	"info": false,
	    columns: columns.usage,
	    columnDefs: columnDefs.usage,
	    deferRender:    true,
        scrollY:        false,
        scrollCollapse: true,
        scroller:       {
        	boundaryScale: 0.8,
        	displayBuffer: 2
        }
	} );

	/*
	that.data.push(["","","loading","loading","loading"]);
	that.draw();
	$.getJSON(new API().endpoint + "logs/byDay", function(json){
		that.data=[];
		for(index in json) {
			date =  json[index].date.slice(0, json[index].date.lastIndexOf("T"))
			that.data.push([date, '',date, json[index].searches, json[index].api_calls]);
		}
		that.draw();


		
		var count = 0;
		for(index in that.data) {
			(function(index)
				{
					$.getJSON(new API().endpoint + "logs/byDay/" +json[index].date.substring(0,10), function(result) {
						that.data[index][3] = result.searches;
						that.data[index][4] = result.api_calls;

						count++;
						pbar.width(count/that.data.length*100 + '%');
						that.draw();
					});
				}
			)(index);
			
		}

		$("thead a").on('click', function (e) {
			e.stopImmediatePropagation();
			$('#myModal').modal('show');
			$("#txtSearch").hide();
			$("#txtAPI").hide();
			switch($(this).attr("id")) {
				case("help-search"):
					$("#txtSearch").show();
					break;
				case("help-api"):
					$("#txtAPI").show();
					break;
			}
		});
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
	});*/
}

Table.prototype.Datasets = function () {
	this.type = "Usage";
	this.data = [];
	this.empty();
	var pbar = $('#pbar');
	pbar.width(0 + '%');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;

	$('#table').DataTable( {
	    ajax:           '/api/tdataset',
	    destroy: true,
	    responsive: true,
	    "searching": false,
    	"order": [[2, "desc"]],
    	"info": false,
	    columns: columns.datasets,
	    columnDefs: columnDefs.datasets,
	    deferRender:    true,
        scrollY:        false,
        scrollX: 		false, 
        scrollCollapse: true,
        scroller:       {
        	boundaryScale: 0.8,
        	displayBuffer: 2
        }
	} );
	/*this.type = "Datasets";
	this.data = [];
	this.empty();
	var pbar = $('#pbar');
	pbar.width(0 + '%');
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;
	$.getJSON(new API().endpoint + "tdataset", function(json){
		for(index in json) {
			that.data.push([json[index].sd_id, '', json[index].dataset, json[index].count]);
		}
		that.draw();
		$("thead a").on('click', function (e) {
			e.stopImmediatePropagation();
			$('#myModal').modal('show');
			$("#txtSearch").hide();
			$("#txtAPI").hide();
			switch($(this).attr("id")) {
				case("help-api"):
					$("#txtAPI").show();
					break;
			}
		});

		var count = 0;
		for(index in that.data) {
			(function(index)
				{
					$.getJSON(new API().endpoint + "tdataset/" +json[index].sd_id, function(result) {
						that.data[index][3] = result[0].count;

						count++;
						pbar.width(count/that.data.length*100 + '%');
						that.draw();
					});
				}
			)(index);
			
		}


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
    });*/
}

/*
 * Expand Table to show more Information
 */
Table.prototype.moreInfo = function (data, hash) {
	//Check which Type is active
	switch(this.type) {
		case("Apps"):
			$.getJSON(new API().endpoint + "apps/" + hash + '/logsByCategory', function(json){
				for(index in json) {
					$('#'+data+'-categories').append('<tr><td>'+json[index].category_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			$.getJSON(new API().endpoint + "apps/" + hash + '/logsByDataset', function(json){
				for(index in json) {
					$('#'+data+'-dataset').append('<tr><td>'+json[index].dataset+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<div class="row"><div class="col-md-4"><h3>Category Search</h3><div id="'+data+'-categories"></div></div> <div class="col-md-4"><h3>Dataset Search</h3><div id="'+data+'-dataset"></div></div></div>';
		case("Categories"):
			$.getJSON(new API().endpoint + "categories/" + data + '/apps', function(json){
				for(index in json) {
					$('#'+data+'-apps').append('<tr><td>'+json[index].app_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			$.getJSON(new API().endpoint + "categories/withDatasets/" + data, function(json){
				for(index in json) {
					$('#'+data+'-datasets').append('<tr><td>'+json[index].md_name+'</td></tr>');
				}
			});
			return '<div class="row"><div class="col-md-4"><h3>Apps</h3><div id="'+data+'-apps"></div></div> <div class="col-md-4"><h3>Datasets</h3><div id="'+data+'-datasets"></div></div></div>'
		case("Usage"):
			$.getJSON(new API().endpoint + "apps/byDate/" + data, function(json){
				for(index in json) {
					$('#'+data+'-apps').append('<tr><td>'+json[index].app_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			$.getJSON(new API().endpoint + "categories/byDate/" + data, function(json){
				for(index in json) {
					$('#'+data+'-categories').append('<tr><td>'+json[index].category_name+'</td><td>'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+data+'-detail"><thead><th>Apps</th><th>Categories</th></thead><tr><td id="'+data+'-apps"></td><td id="'+data+'-categories"></td></tr></table>';
		case("Datasets"):
			$.getJSON(new API().endpoint + "tdataset/" + data, function(json){
				for(index in json) {
					$('#'+data+'-datasets').append('<tr><td>'+json[index].app_name+'</td><td align="right">'+ json[index].count +'</td></tr>');
				}
			});
			return '<table id="'+data+'-detail"><thead><th>Apps</th><th>Dataset Search</th></thead><tbody id="'+data+'-datasets"></tbody></table>';
		default:
			return null;
			break;
	}
}