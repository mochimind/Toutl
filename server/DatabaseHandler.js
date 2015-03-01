var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	user: 'toutl',
	password: 'israelxie',
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
			conection.release();
			errorCallback(message, 'could not connect to database');
			return;
		}
		
		console.log('connected as id ' + connection.threadId);
		// really should check for sql injection here
		connection.query('INSERT INTO posts (msg, parentID, poster) values ("' + 
				message + '",' +
				parent + '",' +
				poster + '")', 
			function (insertError, result, fields) {
			if (insertError) {
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
			conection.release();
			errorCallback(id, 'could not connect to database');
			return;
		}
		
		console.log('connected as id ' + connection.threadId);
		connection.query('SELECT * FROM posts WHERE parent = ' + id, 
			function (queryError, result, fields) {
			if (queryError) {
				errorCallback(id, queryError);
			} else {
				okCallback(id, result);		
			}
			connection.release();
		});
	});
};