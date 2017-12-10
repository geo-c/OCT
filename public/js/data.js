var data = {
	"apps": [],
	"categories": [],
	"datasets": [],
	"usage": []
};

var columnDefs = {
	apps: [
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
	],
	categories: [
		{
            "visible": false,
            "targets": [0]
        },
        {
        	"className": 'details-control',
        	"width": '18px',
        	"targets":[1]
        }
	],
	usage: [
		{
            "visible": false,
            "targets": [0]
        },
        {
        	"className": 'details-control',
        	"width": '18px',
        	"targets":[1]
        }
	],
	datasets: [
		{
            "visible": false,
            "targets": [0]
        },
        {
        	"className": 'details-control',
        	"width": '18px',
        	"targets":[1]
        }
	]
}

var columns = {
	apps: [
		{ title: "" },
		{ title: "ID" },
        { title: "More" },
        { title: 'Name' },
        { title: 'Description' },
        { title: 'App Type' },
        { title: 'Category Search  <a id="help-search"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' },
        { title: 'Dataset Search  <a id="help-api"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' }
	],
	categories: [
		{ title: "" },
        { title: "More" },
        { title: "Name" },
        { title: 'Searches   <a id="help-search"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' },
        {title: 'Number of Datasets  <a id="help-numodata"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>'}
	],
	usage: [
		{ title: "" },
        { title: "More" },
        { title: "Date" },
        { title: 'Category Search  <a id="help-search"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' },
        { title: 'Dataset Search  <a id="help-api"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' }
	],
	datasets: [
		{title: ""},
		{title: "More"},
		{title: "Dataset"},
		{ title: 'Dataset Search  <a id="help-api"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span><a>' }
	]
}