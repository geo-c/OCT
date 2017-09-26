var Table = function (data) {
	this.data = data;
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
			this.dataTable = $('#table').DataTable( {
		    	destroy: true,
		    	responsive: true,
		    	"searching": false,
		    	"paging": false,
		    	"info": false,
		        data: this.data.apps,
		        columns: columns,
		        "columnDefs": columnDefs
		    } );
			break;
		case("Categories"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Name" },
	            { title: 'Searches   <a id="help-search"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' },
	            {title: 'Number of Datasets  <a id="help-numodata"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>'}
			];
			this.dataTable = $('#table').DataTable( {
		    	destroy: true,
		    	responsive: true,
		    	"searching": false,
		    	"paging": false,
		    	"info": false,
		        data: this.data.categories,
		        columns: columns,
		        "columnDefs": columnDefs
		    } );
			break;
		case("Usage"):
			columns = [
				{ title: "" },
	            { title: "More" },
	            { title: "Date" },
	            { title: 'Category Search  <a id="help-search"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' },
	            { title: 'Dataset Search  <a id="help-api"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' }
			];
			this.dataTable = $('#table').DataTable( {
		    	destroy: true,
		    	responsive: true,
		    	"searching": false,
		    	"order": [[2, "desc"]],
		    	"paging": false,
		    	"info": false,
		        data: this.data.usage,
		        columns: columns,
		        "columnDefs": columnDefs
		    } );
			break;
		case("Datasets"):
			columns = [
				{title: ""},
				{title: "More"},
				{title: "Dataset"},
				{ title: 'Dataset Search  <a id="help-api"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' }
			];
			this.dataTable = $('#table').DataTable( {
		    	destroy: true,
		    	responsive: true,
		    	"searching": false,
		    	"paging": false,
		    	"info": false,
		        data: this.data.datasets,
		        columns: columns,
		        "columnDefs": columnDefs
		    } );
			break;
		default:
			break;
	}
}

/*
 * Get Data From Apps and Parse them
 */
Table.prototype.Apps = function () {
	this.empty();
	this.type = "Apps";	
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;

	if(this.data.apps.length==0) {
		$.getJSON(new API().endpoint + "apps", function(json){
			for(index in json) {
				that.data.apps.push([json[index].app_hash, index, '', json[index].app_name, json[index].app_description, json[index].searches, json[index].api_calls]);
			}
			that.draw();


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
		});
	} else {
		this.draw();
	}	
}

/*
 * Get Data From Categories and Parse them
 */
Table.prototype.Categories = function () {
	this.type = "Categories";
	this.empty();
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;

	if(this.data.categories.length==0) {
		$.getJSON(new API().endpoint + "categories", function(json){
			for(index in json) {
				that.data.categories.push([json[index].category_id, '', json[index].category_name, json[index].searches, json[index].datasets]);
			}
			that.draw();

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
		});
	} else {
		this.draw();
	}	
}

/*
 * Get Data From Usage and Parse them
 */
Table.prototype.Usage = function () {
	this.type = "Usage";
	this.empty();
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;

	if(this.data.usage.length == 0) {
		$.getJSON(new API().endpoint + "logs/byDay", function(json){
			for(index in json) {
				date =  json[index].date.slice(0, json[index].date.lastIndexOf("T"))
				that.data.usage.push([date, '',date, json[index].searches, json[index].api_calls]);
			}
			that.draw();

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
		});
	} else {
		this.draw();
	}
}

Table.prototype.Datasets = function () {
	this.type = "Datasets";
	this.empty();
	$("#content").html('<table id="table" class="display" width="100%"></table>');
	var that = this;

	if(this.data.datasets.length == 0) {
		$.getJSON(new API().endpoint + "tdataset", function(json){
			for(index in json) {
				that.data.datasets.push([json[index].sd_id, '', json[index].dataset, json[index].count]);
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
	} else {
		this.draw();
	}
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