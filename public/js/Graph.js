var Graph = function () {
}

Graph.prototype.data = [];
Graph.prototype.labels = [];
Graph.prototype.backgroundColors = [];
Graph.prototype.borderColors = [];
Graph.prototype.ctx = $("#grid");
Graph.prototype.url = "api/";
Graph.prototype.chart = null;

Graph.prototype.draw = function () {
	console.log(this.data);
	console.log(this.labels);
	console.log(this.backgroundColors);
	console.log(this.borderColors);
	this.ctx = $("#grid");
	this.chart = new Chart(this.ctx, {
	    type: 'bar',
	    data: {
	        labels: this.labels,
	        datasets: [{
	            label: '# calls',
	            data: this.data,
	            backgroundColor: this.backgroundColors,
	            borderColor: this.borderColors,
	            borderWidth: 1
	        }]
	    },
	    options: {
	    	legend: {
	            display: false
	        },
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

Graph.prototype.reset = function () {
	this.labels = [];
	this.data = [];
	this.backgroundColors = [];
	this.borderColors = [];
}

Graph.prototype.Apps = function () {
	$("#content").html('<div><canvas id="grid"></canvas><div>');
	this.reset();
	var that = this;
	$.getJSON(that.url + "apps", function (json) {
		for(index in json) {
			that.labels.push(json[index].app_name);
			that.data.push(json[index].calls);
			that.backgroundColors.push('rgba(255, 99, 132, 0.2)');
			that.borderColors.push('rgba(255,99,132,1)');
		}
		that.draw();
	});
}

Graph.prototype.Categories = function () {
	$("#content").html('<div><canvas id="grid"></canvas><div>');
	this.reset();
	var that = this;
	$.getJSON(that.url + "categories", function (json) {
		for(index in json) {
			that.labels.push(json[index].catgegory_name);
			that.data.push(json[index].calls);
			that.backgroundColors.push('rgba(255, 99, 132, 0.2)');
			that.borderColors.push('rgba(255,99,132,1)');
		}
		that.draw();
	});
}

Graph.prototype.Usage = function () {
	$("#content").html('<div><canvas id="grid"></canvas><div>');
	this.reset();
	var that = this;
	$.getJSON(that.url + "logs/countByDay", function (json) {
		for(index in json) {
			that.labels.push(json[index].date.slice(0, json[index].date.lastIndexOf("T")));
			that.data.push(json[index].count);
			that.backgroundColors.push('rgba(255, 99, 132, 0.2)');
			that.borderColors.push('rgba(255,99,132,1)');
		}
		that.draw();
	});
}