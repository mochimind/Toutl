var clients = [];

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
			console.log("broadcasting: " + caller.name + "||" + message);			
			clients[i].handleNewChannel.bind(clients[i])(channelID, caller.name, message);
		} else {
			console.log('skipped broadcasting');
		}
	}
};

exports.newMessage = function(parentID, caller, message) {
	var clen = clients.length;
	for (var i=0 ; i<clen ; i++) {
		if (clients[i] != caller) {
			console.log("broadcasting: " + caller.name + "||" + message);			
			clients[i].handleNewMessage.bind(clients[i])(parentID, caller.name, message);
		} else {
			console.log('skipped broadcasting');
		}
	}
};
