var mysql = require('mysql');
var util = require('util');

var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	user: 'root',
	password: 'southbend',
	database: 'toutl',
	debug: false
});

exports.createChannel = function (handler, message, errorCallback, okCallback) {
	exports.createMessage(handler, message, 0, errorCallback, okCallback);
};

exports.createMessage = function(handler, message, parent, errorCallback, okCallback) {
	// check the poster name is valid
	if (handler.name.length > 128) {
		errorCallback(handler, message, 'poster name is too long');
		return;
	}
	// check the poster message is valid
	if (message.length > 512) {
		errorCallback(handler, message, 'message is too long');
		return;
	}
	// check the poster parent id is valid
	if (parent < 0) {
		errorCallback(handler, message, 'invalid parent node');
		return;
	}
	
	// upload to database
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			conection.release();
			errorCallback(handler, message, 'could not connect to database');
			return;
		}
		
		// really should check for sql injection here
		var query = 'INSERT INTO posts (msg, parentID, poster) values ("' + 
			message + '","' +
			parent + '","' +
			handler.name + '")';
		console.log("query string is: " + query);
		connection.query(query, 
			function (insertError, result) {
			if (insertError) {
				console.log("error: " + insertError.message);
				errorCallback(handler, message, insertError);
			} else {
				//console.log("test: " + util.inspect(result, false, null));
				okCallback(handler, message, result.insertId);	
			}
			connection.release();
		});
	});
};

exports.updateUser = function(username, handler, errorCallback, okCallback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			connection.release();
			errorCallback(handler, 'could not connect to database');
			return;
		}
		
		var date = new Date();
		date = date.getUTCFullYear() + '-' +
	    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
	    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
	    ('00' + date.getUTCHours()).slice(-2) + ':' + 
	    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
	    ('00' + date.getUTCSeconds()).slice(-2);
		connection.query('INSERT INTO users (username, login) VALUES ("' + username + '","' + date + 
					'") ON DUPLICATE KEY Update login=VALUES(login)', 
			function (queryError, result, fields) {
			if (queryError) {
				console.log("error: " + queryError.message);
				errorCallback(handler, queryError);
			} else {
				okCallback(handler, result);
			}
			connection.release();
		});
	});
};

exports.loadView = function(id, handler, errorCallback, okCallback) {
	// check the id is valid
	if (id < 0) {
		errorCallback(handler, id, 'id is invalid');
		return;
	}
	
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			connection.release();
			errorCallback(handler, id, 'could not connect to database');
			return;
		}
		
		connection.query('SELECT * FROM posts WHERE parentID = ' + id, 
			function (queryError, result, fields) {
			if (queryError) {
				console.log("error: " + queryError.message);
				errorCallback(handler, id, queryError);
			} else {
				okCallback(handler, id, result);
			}
			connection.release();
		});
	});
};