var Graph = function () {
}

Graph.prototype.data = {first: [], second: []};
Graph.prototype.labels = [];
Graph.prototype.label = {first: "", second: ""}
Graph.prototype.backgroundColors = {first: [], second: []};
Graph.prototype.borderColors = {first: [], second: []};
Graph.prototype.ctx = $("#grid");
Graph.prototype.chart = null;

/*
 * Draw the Graph.
 */
Graph.prototype.draw = function (multiple) {
	var datasets = [];
	if(multiple) {
		datasets = [{
            label: this.label.first,
            data: this.data.first,
            backgroundColor: this.backgroundColors.first,
            borderColor: this.borderColors.first,
            borderWidth: 1
        },
        {
        	label: this.label.second,
        	data: this.data.second,
        	backgroundColor: this.backgroundColors.second,
        	borderColor: this.borderColors.second,
        	borderWidth: 1
        }]
	} else {
		datasets = [{
			label: "# calls",
			data: this.data.first,
			backgroundColor: this.backgroundColors.first,
			borderColor: this.borderColors.first,
			borderWidth: 1
		}]
	}
	this.ctx = $("#grid");
	this.chart = new Chart(this.ctx, {
	    type: 'bar',
	    data: {
	        labels: this.labels,
	        datasets: datasets
	    },
	    options: {
	    	legend: {
	            display: false
	        },
	        maintainAspectRatio:false,
	        responsive:true,
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
}

/*
 * Reset all Data.
 */
Graph.prototype.reset = function () {
	this.labels = [];
	this.data = {first: [], second: []};
	this.backgroundColors = {first: [], second: []};;
	this.borderColors = {first: [], second: []};;
}

/*
 * Get Data from Apps
 */
Graph.prototype.Apps = function () {
	$("#content").html('<canvas id="grid" width="400" height="450px"></canvas>');
	this.reset();
	var that = this;
	$.getJSON(new API().endpoint + "apps", function (json) {
		for(index in json) {
			that.label.first = "# Searches";
			that.label.second = "# API Calls"
			that.labels.push(json[index].app_name);
			that.data.first.push(json[index].searches);
			that.data.second.push(json[index].api_calls);
			that.backgroundColors.first.push('rgba(255, 99, 132, 0.2)');
			that.backgroundColors.second.push('rgba(54, 162, 235, 0.2)');
			that.borderColors.first.push('rgba(255,99,132,1)');
			that.borderColors.second.push('rgba(54, 162, 235, 1)');
		}
		that.draw(true);
	});
}

/*
 * Get Data from Categories
 */
Graph.prototype.Categories = function () {
	$("#content").html('<canvas id="grid" width="400" height="450px"></canvas>');
	this.reset();
	var that = this;
	$.getJSON(new API().endpoint + "categories", function (json) {
		for(index in json) {
			that.label.first = "# Searches";
			that.label.second = "# Datasets";
			that.labels.push(json[index].category_name);
			that.data.first.push(json[index].searches);
			that.data.second.push(json[index].datasets);
			that.backgroundColors.first.push('rgba(255, 99, 132, 0.2)');
			that.backgroundColors.second.push('rgba(54, 162, 235, 0.2)');
			that.borderColors.first.push('rgba(255,99,132,1)');
			that.borderColors.second.push('rgba(54, 162, 235, 1)');
		}
		that.draw(true);
	});
}

/*
 * Get Data from Usage
 */
Graph.prototype.Usage = function () {
	$("#content").html('<canvas id="grid" width="400" height="450px"></canvas>');
	this.reset();
	var that = this;
	$.getJSON(new API().endpoint + "logs/byDay", function (json) {
		for(index in json) {
			that.label.first = "# Searches";
			that.label.second = "# API Calls";
			that.labels.push(json[index].date.slice(0, json[index].date.lastIndexOf("T")));
			that.data.first.push(json[index].searches);
			that.data.second.push(json[index].api_calls);
			that.backgroundColors.first.push('rgba(255, 99, 132, 0.2)');
			that.backgroundColors.second.push('rgba(54, 162, 235, 0.2)');
			that.borderColors.first.push('rgba(255,99,132,1)');
			that.borderColors.second.push('rgba(54, 162, 235, 1)');
		}
		that.draw(true);
	});
}

Graph.prototype.Datasets = function () {
	$("#content").html('<canvas id="grid" width="400" height="450px"></canvas>');
	this.reset();
	var that = this;
	$.getJSON(new API().endpoint + "tdataset", function (json) {
		for(index in json) {
			that.labels.push(json[index].dataset);
			that.data.first.push(json[index].count);
			that.backgroundColors.first.push('rgba(255, 99, 132, 0.2)');
			that.borderColors.first.push('rgba(255,99,132,1)');
		}
		that.draw();
	});	
}