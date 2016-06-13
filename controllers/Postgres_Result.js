/**
 * Constructs an empty DbResults object.
 */
var Postgres_Result = function() {
	this.data = [];
};

/**
 * Adds a data touple/row to the data array.
 *
 * @param array Data to add
 */
Postgres_Result.prototype.addRow = function(rowData) {
	this.data.push(rowData);
};

/**
 * Returns the current data.
 *
 * @returns array
 */
Postgres_Result.prototype.getData = function() {
	return this.data;
};

/**
 * Gets a single row of data specified by the zero based row index.
 *
 * @param int Row index
 * @returns Data of the row or null if row index is invalid.
 */
Postgres_Result.prototype.getRow = function(row) {
	if (row >= 0 && row < this.data.length) {
		return this.data[row];
	}
	else {
		console.log("DbClient.getRow(): Row number invalid");
		return null;
	}
};

/**
 * Returns a single cell of the data, specified by row index and column name.
 *
 * @param int Row index
 * @param string Column name
 * @returns mixed Returns the data of the specified cell.
 */
Postgres_Result.prototype.getCell = function(row, colName) {
	var rowData = this.getRow(row);
	if (rowData !== null) {
		return rowData[colName];
	}
	else {
		console.log("DbClient.getCell(): Column name not found: ", colName);
		return null;
	}
};

/**
 * Returns a JSON object of all data rows which is taking the "column" names of the query for the structure.
 *
 * The _ is used as separator to specifiy the levels with their names. Additionalle you can
 * use §xx at the end of the column name to format the value. xx is a variable. See _parseValue for more info.
 * The specified parameter is used as top level name. To avoid a top level name set the parameter
 * to null.
 *
 * @param string Top level element name or null
 * @returns object JSON based object
 * @see DbResult._parseValue()
 */
Postgres_Result.prototype.parseRowsByColNames = function(name) {
	var dataList = [];
	for (i = 0; i < this.getNumOfRows(); i++) {
		dataList.push(this.parseRowByColNames(i));
	}
	var response = {};
	if (name !== null) {
		response[name] = dataList;
	}
	else {
		response = dataList;
	}
	return response;
};

/**
 * Returns a JSON object of a single data row which is taking the "column" names of the query for the structure.
 *
 * This is similar to parseRowsByColNames(), but only for one single row and without to level elemtn.
 *
 * @param int Row index
 * @returns object JSON based object
 * @see DbResult.parseRowsByColNames()
 */
Postgres_Result.prototype.parseRowByColNames = function(row) {
	var response = {};
	var rowData = this.getRow(row);
	if (rowData !== null) {
		for (var key in rowData) {
			if (rowData.hasOwnProperty(key)) {
				var keys = key.split("_");
				this._parseColName(response, keys, 0, rowData[key]);
			}
		}
	}
	return response;
};

/**
 * Internal method to parse the column names and add the data to the object.
 *
 * @param object Target object (reference) to add the data to
 * @param array Keys for the level elements
 * @param {type} Current depth in the object / index of the current element in the keys.
 * @param {type} Value to add, might have a §xx based type declaration
 */
Postgres_Result.prototype._parseColName = function(target, keys, depth, value) {
	var key = keys[depth];
	if (typeof target[key] === 'undefined') {
		target[key] = {};
	}
	depth++;

	if (keys.length === depth) {
		var format = key.split('§');
		if (format.length === 2) {
			target[format[0]] = this._parseValue(value, format[1]);
			delete target[key]; // Remove the old entry
		}
		else {
			target[key] = value;
		}
	}
	else {
		this._parseColName(target[key], keys, depth, value);
	}
};

/**
 * Returns the number of data rows.
 *
 * @returns int Number of rows
 */
Postgres_Result.prototype.getNumOfRows = function() {
	return this.data.length;
};

/**
 * Returns whether the DbResult object has data.
 * @returns boolean No data = false, At least one row of data = true
 */
Postgres_Result.prototype.hasRows = function() {
	return (this.data.length > 0);
};

module.exports = Postgres_Result;