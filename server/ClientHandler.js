var switchbox = require('./Switchbox');
var db = require('./DatabaseHandler');

exports.Handler = function(_socket) {
	this.socket = _socket;
	this.name = "";
	this.curView = 0;
};

exports.Initialize = function(_socket) {
	var outObj = {
			'socket': _socket,
			'name': "",
			'curView': 0
	};
	
	outObj.socket.on("connected", function(_name) {		
		outObj.name = _name;
		console.log('connected: ' + outObj.name);
		switchbox.registerClient(outObj);
	});
	
	outObj.socket.on('create_chan', function(params, id) {
		console.log('received channel creation request: ' + id + "||" + params);
		// database update
		var newID = db.createChannel(outObj, params.message, function(handler, caller, msg) {
			console.log("emitting error");
			outObj.socket.emit('error', id, {'message': msg});
		}, function(handler, msg, chanID) {
			console.log("confirming: " + handler + "||" + handler.socket);
			outObj.socket.emit('response', id, {'speaker': outObj.name, 'message': msg, 'id': chanID});
		});
		switchbox.newChannel(newID, outObj, params.message, newID);
	});
	
	outObj.socket.on('create_msg', function(params) {
		console.log('received msg creation request: ' + params);
		var newID = db.createMessage(outObj, params.message, params.parent, function(handler, caller, msg) {
			console.log("emitting error");
			outObj.socket.emit('error', id, {'message': msg});
		}, function(handler, msg, id) {
			console.log("confirming: " + handler + "||" + handler.socket);
			outObj.socket.emit('response', id, {'speaker': outObj.name, 'message': msg});
		});
		switchbox.newMessage(params.parent, outObj, params.message);
	});
	
	outObj.socket.on("changename", function(params, id) {
		console.log("changing name: " + params);
		outObj.name = params.newName;
		outObj.socket.emit('response', id, {'newName': outObj.name});
	});
	
	outObj.socket.on('changeview', function(params, id) {
		console.log("changing view: " + params + "||" + id);
		db.loadView(params.channel, outObj, function(handler, caller, msg) {
			console.log("emitting error");
			outObj.socket.emit('error', id, {'message': msg});
		}, function(handler, parent, children) {
			outObj.socket.emit('response', id, {'messages': children, 'parent': params.channel});
		});
	});
	
	outObj.socket.on('disconnect', function() {
		console.log("disconnecting");
		switchbox.deregisterClient(outObj);
		// TODO: may need to kill socket to finish GC
		outObj.socket = undefined;
	});	

};

exports.handleNewMessage = function(handler, parent, message) {
	if (handler.curView == parent) {
		handler.socket.emit('newchan', handler.name, message, id);
	}
};

exports.handleNewChannel = function(handler, chanID, message) {
	// TODO: this is a hack, implement this properly
	if (handler.curView == 0) {
		handler.socket.emit('newmsg', handler.name, message, chanID);		
	}
};




