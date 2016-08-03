$(document).ready(function() {
	var url = "api/";

	var table = new Table();
	var graph = new Graph();
	var status = "Apps";

	//Init
	init();

	//Listen on Left Tab Changes
	$(".navbar-left a").on("click", function(){
		$(".btn-group").show();
	   	$(".nav").find(".active").removeClass("active");
	   	$(this).parent().addClass("active");
	   	status = $(this).html();
	   	$("#btn-table").addClass("active");
	   	$("#btn-graph").removeClass("active");
	   	showTable();
	});

	$(".btn-group button").on("click", function(){
		$(".btn-group").find(".active").removeClass("active");
		$(this).addClass("active");
		if($(this).html() == "Table") {
			showTable();
		} else if ($(this).html() == "Graph") {
			showGraph();
		}
	});

	function init() {
		showTable();
	}

	function showTable() {
		switch(status) {
			case("Apps"):
				table.Apps();
				break;
			case("Categories"):
				table.Categories();
				break;
			case("Usage"):
				table.Usage();
				break;
			default:
				break;
		}
	}

	function showGraph() {
		switch(status) {
			case("Apps"):
				graph.Apps();
				break;
			case("Categories"):
				graph.Categories();
				break;
			case("Usage"):
				graph.Usage();
				break;
			default:
				break;
		}
	}

});