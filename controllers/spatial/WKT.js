var WKT = function () {
	this._wkt = [];
}

WKT.prototype.get = function () {
	return this._wkt;
}

/*
 *	Convert GeoJSON to WKT
 */
WKT.prototype.convert = function (geojson) {
	/*
	 *	Extract spatial Information out of the geojson
	 */
	var _extract = function (json, dt) {
		var that = this;
		if(Array.isArray(json)) {
			for(i in json) {
				if(typeof json[i] === "object" || Array.isArray(json[i])) {
					_extract(json[i], dt);
				}
			}
			return dt;
		} else {
			for(var key in json) {
				var value = json[key];
				if(key == "geometry") {
					return dt.push(value);
				} else {
					if(typeof value === "object" || Array.isArray(value)) {
						_extract(value, dt);
					}
				}
			}
			return dt;
		}
	}

	// Parse spatial Information to wkt
	// Supported: Point and Polygon
	var dt = _extract(geojson, []);
	for(i in dt) {
		switch(dt[i].type) {
			case("Point"):
				wkt = "POINT(";
				wkt += dt[i].coordinates[0] + " " + dt[i].coordinates[1];
				wkt += ")";
				this._wkt.push(wkt);
				break;
			case("Polygon"):
				wkt = "POLYGON((";
				for(j in dt[i].coordinates[0]) {
					if(j != 0) {
						wkt += ", "
					}
					wkt += dt[i].coordinates[0][j][0] + " " + dt[i].coordinates[0][j][1];
				}
				wkt += ""
				wkt += "))";
				this._wkt.push(wkt);
				break;
			default:
				break;
		}
	}
}

module.exports = WKT;