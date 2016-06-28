$(document).ready(function() {
	var url = "api/";


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
		$("#content").html('<table id="table" class="display" style="width=100%;"><thead><tr><th>Name</th><th>Description</th><th>Calls</th></tr></thead><tbody></tbody></table>');
		initTable();
	}

	function Tags() {
		$("#content").empty();
	}

	function Categories() {
		$("#content").empty();
	}

	function Usage() {
		$("#content").empty();
		$("#content").html('<div style="width=600px;height=400px;"><canvas id="grid"></canvas><div>');
		initGraph();
	}

	function initTable() {
		$.getJSON(url + "apps", function(json){
			for(index in json) {
				var $bline = $( "<tr></tr>" );
				$bline.append( $( '<td></td>' ).html( json[index].app_name ) );
				$bline.append( $( "<td></td>" ).html( json[index].app_description ) );
				$bline.append( $( "<td></td>" ).html( json[index].calls ) );
				$('#table').append($bline);
			}
			$('#table').DataTable();
		});	
	}

	function initGraph() {
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