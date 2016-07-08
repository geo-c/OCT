$(document).ready(function() {
	var url = "api/";
	var table = null;
	var graph = null;

	//Init
	Apps();

	//Listen on Tab Changes
	$(".nav a").on("click", function(){
	   	$(".nav").find(".active").removeClass("active");
	   	$(this).parent().addClass("active");
	   	if($(this).html() == "Apps") {
	   		Apps();
	   	} else if ($(this).html() == "Tags") {
	   		Tags();
	   	} else if ($(this).html() =="Categories") {
	   		Categories();
	   	} else {
	   		Usage();
	   	}
	});

	function Apps() {
		$("#content").empty();
		$("#content").html('<table id="table" class="display" style="width=100%;"><thead><tr><th style=\"display:none;\"></th><th class=\"details-control sorting_disabled headrow\" rowspan=\"1\" colspan=\"1\" aria-label=\"\" style=\"width: 18px;\">More</th><th>Name</th><th>Description</th><th>Calls</th></tr></thead><tbody></tbody></table>');
		initTableApps();
	}

	function Tags() {
		$("#content").empty();
		$("#content").html('<table id="table" class="display" style="width=100%;"><thead><tr><th style=\"display:none;\"><th class=\"details-control sorting_disabled headrow\" rowspan=\"1\" colspan=\"1\" aria-label=\"\" style=\"width: 18px;\">More</th><th>Name</th><th>Calls</th></tr></thead><tbody></tbody></table>');
		initTableTags();
	}

	function Categories() {
		$("#content").empty();
		$("#content").html('<table id="table" class="display" style="width=100%;"><thead><tr><th style=\"display:none;\"><th class=\"details-control sorting_disabled headrow\" rowspan=\"1\" colspan=\"1\" aria-label=\"\" style=\"width: 18px;\">More</th><th>Name</th><th>Calls</th></tr></thead><tbody></tbody></table>');
		initTableCategories();
	}

	function Usage() {
		$("#content").empty();
		$("#content").html('<div style="width=600px;height=400px;"><canvas id="grid"></canvas><div>');
		initGraphUsage();
	}

	function initTableApps() {
		$.getJSON(url + "apps", function(json){
			for(index in json) {
				var $bline = $( "<tr></tr>" );
				$bline.append( $( "<td class=\"app_hash\" style=\"display:none;\"></td>").html(json[index].app_hash) );
				$bline.append( $( "<td class=\"details-control\"></td>" ).html('') );
				$bline.append( $( "<td></td>" ).html( json[index].app_name ) );
				$bline.append( $( "<td></td>" ).html( json[index].app_description ) );
				$bline.append( $( "<td></td>" ).html( json[index].calls ) );
				$('#table').append($bline);
			}
			table = $('#table').DataTable();
		});	

		$('#table tbody').on('click', 'td.details-control', function () {
	        var tr = $(this).closest('tr');
	        var row = table.row( tr );
	 
	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            row.child( appMoreInfo(row.data()[0]) ).show();
	            tr.addClass('shown');
	        }
	    } );
	}

	function appMoreInfo(app_hash) {
		$.getJSON(url + "apps/" + app_hash + '/logsByTag', function(json){
			for(index in json) {
				$('#tags').append('<tr><td>'+json[index].tag_name+'</td><td>'+ json[index].count +'</td></tr>');
			}
		});
		$.getJSON(url + "apps/" + app_hash + '/logsByCategory', function(json){
			for(index in json) {
				$('#categories').append('<tr><td>'+json[index].catgegory_name+'</td><td>'+ json[index].count +'</td></tr>');
			}
		});
		return '<table id="detail"><thead><th>Tags</th><th>Categories</th></thead><tr><td id="tags"></td><td id="categories"></td></tr></table>';
	}

	function initTableTags() {
		$.getJSON(url + "tags", function(json){
			for(index in json) {
				var $bline = $( "<tr></tr>" );
				$bline.append( $( "<td class=\"app_hash\" style=\"display:none;\"></td>").html(json[index].tag_id) );
				$bline.append( $( "<td class=\"details-control\"></td>" ).html('') );
				$bline.append( $( '<td></td>' ).html( json[index].tag_name ) );
				$bline.append( $( "<td></td>" ).html( json[index].calls ) );
				$('#table').append($bline);
			}
			table = $('#table').DataTable();
		});	

		$('#table tbody').on('click', 'td.details-control', function () {
	        var tr = $(this).closest('tr');
	        var row = table.row( tr );
	 
	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            row.child( tagMoreInfo(row.data()[0]) ).show();
	            tr.addClass('shown');
	        }
	    } );
	}

	function tagMoreInfo(tag_id) {
		$.getJSON(url + "tags/" + tag_id + '/apps', function(json){
			for(index in json) {
				$('#app').append('<tr><td>'+json[index].app_name+'</td><td>'+ json[index].count +'</td></tr>');
			}
		});
		return '<table id="detail"><thead><th>App</th><th>Calls</th></thead><tr><td id="app"></td><td id="Calls"></td></tr></table>';
	}

	function initTableCategories() {
		$.getJSON(url + "categories", function(json){
			for(index in json) {
				var $bline = $( "<tr></tr>" );
				$bline.append( $( "<td class=\"app_hash\" style=\"display:none;\"></td>").html(json[index].category_id) );
				$bline.append( $( "<td class=\"details-control\"></td>" ).html('') );
				$bline.append( $( '<td></td>' ).html( json[index].catgegory_name ) );
				$bline.append( $( "<td></td>" ).html( json[index].calls ) );
				$('#table').append($bline);
			}
			table = $('#table').DataTable();
		});

		$('#table tbody').on('click', 'td.details-control', function () {
	        var tr = $(this).closest('tr');
	        var row = table.row( tr );
	 
	        if ( row.child.isShown() ) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            row.child( categoryMoreInfo(row.data()[0]) ).show();
	            tr.addClass('shown');
	        }
	    } );
	}

	function categoryMoreInfo(category_id) {
		$.getJSON(url + "categories/" + category_id + '/apps', function(json){
			for(index in json) {
				$('#app').append('<tr><td>'+json[index].app_name+'</td><td>'+ json[index].count +'</td></tr>');
			}
		});
		return '<table id="detail"><thead><th>App</th><th>Calls</th></thead><tr><td id="app"></td><td id="Calls"></td></tr></table>';
	}

	function initGraphUsage() {
		$.getJSON(url + "logs/countByDay", function (json) {
			var ctx = $("#grid")
			var labels = [];
			var data = [];
			var backgroundColors = [];
			var borderColors = [];

			for(index in json) {
				labels.push(json[index].date);
				data.push(json[index].count);
				backgroundColors.push('rgba(255, 99, 132, 0.2)');
				borderColors.push('rgba(255,99,132,1)');
			}

			var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			        labels: labels,
			        datasets: [{
			            label: '# calls',
			            data: data,
			            backgroundColor: backgroundColors,
			            borderColor: borderColors,
			            borderWidth: 1
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        }
			    }
			});
		});
	}

	function getData() {

	}

});