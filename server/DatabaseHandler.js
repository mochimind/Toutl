var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	user: 'root',
	password: 'southbend',
	database: 'toutl',
	debug: false
});


exports.createMessage = function(poster, message, parent, errorCallback, okCallback) {
	// check the poster name is valid
	if (poster.length > 128) {
		errorCallback(message, 'poster name is too long');
		return;
	}
	// check the poster message is valid
	if (message.length > 512) {
		errorCallback(message, 'message is too long');
		return;
	}
	// check the poster parent id is valid
	if (parent < 0) {
		errorCallback(message, 'invalid parent node');
		return;
	}
	
	// upload to database
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			conection.release();
			errorCallback(message, 'could not connect to database');
			return;
		}
		
		// really should check for sql injection here
		var query = 'INSERT INTO posts (msg, parentID, poster) values ("' + 
			message + '","' +
			parent + '","' +
			poster + '")';
		console.log("query string is: " + query);
		connection.query(query, 
			function (insertError, result, fields) {
			if (insertError) {
				console.log("error: " + insertError.message);
				errorCallback(message, insertError);
			} else {
				okCallback(message, result.ID);				
			}
			connection.release();
		});
	});
};

exports.loadView = function(id, errorCallback, okCallback) {
	// check the id is valid
	if (id < 0) {
		errorCallback(id, 'id is invalid');
		return;
	}
	
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			connection.release();
			errorCallback(id, 'could not connect to database');
			return;
		}
		
		connection.query('SELECT * FROM posts WHERE parentID = ' + id, 
			function (queryError, result, fields) {
			if (queryError) {
				console.log("error: " + queryError.message);
				errorCallback(id, queryError);
			} else {
				okCallback(id, result);
			}
			connection.release();
		});
	});
};