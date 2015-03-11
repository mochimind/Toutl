var clients = [];

var handlers = require('./ClientHandler');

exports.registerClient = function(handler) {
	clients.push(handler);
};

exports.deregisterClient = function(handler) {
	var index = clients.indexOf(handler);
	if (index != -1) {
		clients.splice(index, 1);
	}
};

exports.newChannel = function(channelID, caller, message) {
	var clen = clients.length;
	for (var i=0 ; i<clen ; i++) {
		if (clients[i] != caller) {
			console.log("broadcasting chan: " + clients[i].name + "||" + message);			
			handlers.handleNewChannel(clients[i], caller.name, message, channelID);
		} else {
			console.log('skipped broadcasting');
		}
	}
};

exports.newMessage = function(parentID, caller, message) {
	var clen = clients.length;
	console.log("we have: " + clen);
	for (var i=0 ; i<clen ; i++) {
		if (clients[i] != caller) {
			console.log("broadcasting msg: " + clients[i].name + "||" + message);			
			handlers.handleNewMessage(clients[i], caller.name, message, parentID);
		} else {
			console.log('skipped broadcasting');
		}
	}
};
