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

exports.broadcast = function(lineage, message) {
	var clen = clients.length;
	for (var i=0 ; i<clen ; i++) {
		clients[i].handlePost(lineage, message);
	}
};