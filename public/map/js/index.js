$(document).ready(function() {

	var map;
	var markers;
	
	var getMarker = function (status, value) {
		if(markers != null) {
			map.removeLayer(markers);
		}
		markers = null;
		markers = L.markerClusterGroup({ chunkedLoading: true });

		$.getJSON("http://giv-oct.uni-muenster.de:8081/api/visitors/" + status + "/" + value, function(json){ 
			for(i in json) {
				
				//console.log(json[i])
				marker = L.marker([json[i].latitude, json[i].longitude]);

				marker.bindPopup('<ul><li> Time: '+ json[i].timestamp + '</li><li> Latitude: '+ json[i].latitude + '</li><li> Longitude: ' + json[i].longitude + '</li><li> App_name: ' + json[i].app_name + '</li><li> Dataset: ' + json[i].dataset + '</li></ul>');

				markers.addLayer(marker);
			}
			if(json.length != 0) {
				map.addLayer(markers);

				map.fitBounds(markers.getBounds());

				markers.on('click', function (a) {
					console.log('marker ' + a.layer);
				});
			} else {
				alert("No Api Usages yet!");
			}
			
		});


		
	}

	var getApps = function () {
		$.getJSON(new API().endpoint + "apps", function(apps) {
			for(i in apps) {
				$('#drpdwn-apps').append('<li><a href="#">' + apps[i].app_name + '</a></li>');
			}

			$('#drpdwn-apps li a').on('click', function (e) {
				var $div = $(this).parent().parent().parent(); 
    			var $btn = $div.find('button');
    			$btn.html($(this).text() + ' <span class="caret"></span>');
			    $div.removeClass('open');
			    e.preventDefault();

			    $('#btn-datasets').html('Datasets <span class="caret"></span>');

			    getMarker("app", $(this).text());
			    return false;
			})
		});
	}

	var getDatasets = function () {
		$.getJSON(new API().endpoint + "tdataset", function(datasets) {
			for(i in datasets) {
				$('#drpdwn-datasets').append('<li><a href="#">' + datasets[i].dataset + '</a></li>');
			}

			$('#drpdwn-datasets li a').on('click', function (e) {
				var $div = $(this).parent().parent().parent(); 
    			var $btn = $div.find('button');
    			$btn.html($(this).text() + ' <span class="caret"></span>');
			    $div.removeClass('open');
			    e.preventDefault();

			    $('#btn-apps').html('Apps <span class="caret"></span>');

			    getMarker("dataset", $(this).text());
			    return false;
			})
		});
	}


	




	var init = function () {

		getApps();
		getDatasets();
		
		map = L.map('mapid').setView([51.959076, 7.623653], 12);


		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
			{
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
				maxZoom: 18,
			}
		).addTo(map);
	};

	init();



	
	


	
});