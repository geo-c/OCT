var Elements = function () {
	
}

/*
 * Show Field for Username
 */
Elements.prototype.username = function () {
	$username = $('<input type="text" class="form-control" id="username" placeholder="Username" aria-describedby="basic-addon3">');
	return $username
}

/*
 * Show Fields for User
 */
Elements.prototype.first_name = function () {
	$firstName = $('<input type="text" class="form-control" id="first-name" placeholder="First Name" aria-describedby="basic-addon3">');
	return $firstName;

}

Elements.prototype.last_name = function () {
	$lastName = $('<input type="text" class="form-control" id="last-name" placeholder="Last Name" aria-describedby="basic-addon3">');
	return $lastName;
}

/*
 * Show Field for Email Address
 */
Elements.prototype.email = function () {
	$email = $('<input type="text" id="email" class="form-control" placeholder="max.mustermann@example.com" aria-describedby="basic-addon2">');
	return $email;
}

/*
 * Show Field for Database Name
 */
Elements.prototype.db_name = function () {
	$db_name = $('<div class="form-group"><input type="text" class="form-control" id="db-name" placeholder="Name" aria-describedby="basic-addon3"></div>');
	return $db_name;
}

/*
 * Show Field for Database Host
 */
Elements.prototype.db_host = function () {
	$db_host = $('<div class="form-group"><input type="text" class="form-control" id="db-host" placeholder="Host" aria-describedby="basic-addon3"></div></div>');
	return $db_host;
}

Elements.prototype.db_user = function () {
	$db_host = $('<div class="form-group"><input type="text" class="form-control" id="db-user" placeholder="User" aria-describedby="basic-addon3"></div></div>');
	return $db_host;
}

Elements.prototype.db_password = function () {
	$db_host = $('<div class="form-group"><input type="text" class="form-control" id="db-password" placeholder="Password" aria-describedby="basic-addon3"></div></div>');
	return $db_host;
}

Elements.prototype.query = function () {
	$query = $('<div class="form-group"><input type="text" class="form-control" id="query" placeholder="Query" aria-describedby="basic-addon3"></div>');
	return $query;
}

Elements.prototype.queryId = function () {
	$id = $('<div class="form-group"><div class="input-group"><span class="input-group-addon" id="basic-addon2">...api/dataset/</span><input type="text" class="form-control" id="query-id" placeholder="Query ID" aria-describedby="basic-addon3"></div></div>');
	return $id;
}

Elements.prototype.queryDescription = function () {
	$description = $('<div class="form-group"><input type="text" class="form-control" id="query-description" placeholder="Query Description" aria-describedby="basic-addon3"></div></div>');
	return $description;
}

Elements.prototype.queryName = function () {
	$name = $('<div class="form-group"><input type="text" class="form-control" id="query-name" placeholder="Name" aria-describedby="basic-addon3"></div></div>');
	return $name;
}

/*
 * Show Field for Database Port
 */
Elements.prototype.db_port = function () {
	$db_port = $('<div class="form-group"><div class="input-group"><span class="input-group-addon" id="basic-addon2">:</span><input type="text" class="form-control" id="db-port" placeholder="Port" aria-describedby="basic-addon3"></div></div>');
	return $db_port;
}

Elements.prototype.db_instance = function () {
	$db_instance = $('<div class="form-group"><input type="text" class="form-control" id="db-instance" placeholder="Instance" aria-describedby="basic-addon3"></div>');
	return $db_instance;
}

/*
 * Show Field for URL
 */
Elements.prototype.url = function () {
	$url = $('<div class="form-group"><div class="input-group"><input type="text" class="form-control" id="url" placeholder="url" aria-describedby="basic-addon3"></div></div>');
	return $url;
}

/*
 * Show Field for Database Description
 */
Elements.prototype.db_description = function () {
	$description = $('<div class="form-group"><input type="text" class="form-control" id="db-description" placeholder="Description" aria-describedby="basic-addon3"></div>');
	return $description;
}

/*
 * Show Field for Password
 */
Elements.prototype.password = function () {
	$password = $('<input type="password" class="form-control" id="password" placeholder="Password" aria-describedby="basic-addon3">');
	return $password;
}
