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
		db.updateUser(outObj, _name, function(handler, caller, msg) {
			outObj.socket.emit('problem', {'message': msg});
		}, function(handler, msg) {
			outObj.socket.emit('login');
		});
	});
	
	outObj.socket.on('new_messages', function(params, id) {
		console.log("received request for new messages: " + id + "||" + params.channel + "||" + params.messagesSince);
		var newID = db.getNewMessages(outObj, outObj.name, params.channel, params.messagesSince, function(handler, caller, msg) {
			console.log("emitting error");
			outObj.socket.emit('problem', id, {'message': msg});
	
		}, function(handler, messages, lastDate) {
			console.log("out put new messages :" + lastDate + "||" + messages.length);
			outObj.socket.emit('response', id, {'lastMsgTime': lastDate, "messages": messages});
		});
	});
	
	outObj.socket.on('create_chan', function(params, id) {
		console.log('received channel creation request: ' + id + "||" + params);
		// database update
		var newID = db.createChannel(outObj, params.message, function(handler, caller, msg) {
			console.log("emitting error");
			outObj.socket.emit('problem', id, {'message': msg});
		}, function(handler, msg, chanID) {
			console.log("emitting: " + outObj.name + "||" + msg + "||" + chanID);
			outObj.socket.emit('response', id, {'speaker': outObj.name, 'message': msg, 'id': chanID});
		});
		switchbox.newChannel(newID, outObj, params.message, newID);
	});
	
	outObj.socket.on('create_msg', function(params,id) {
		console.log('received msg creation request: ' + params.message + "||" + params.parent);
		var newID = db.createMessage(outObj, params.message, params.parent, function(handler, caller, msg) {
			console.log("emitting error");
			outObj.socket.emit('problem', id, {'message': msg});
		}, function(handler, msg, chanID, newTime) {
			console.log("confirming: " + handler + "||" + handler.socket);
			outObj.socket.emit('response', id, {'speaker': outObj.name, 'message': msg, 'lastMsgTime': newTime});
			switchbox.newMessage(params.parent, outObj, params.message, newTime);
		});
	});
	
	outObj.socket.on("changename", function(params, id) {
		console.log("changing name: " + params.newName);
		outObj.name = params.newName;
		outObj.socket.emit('response', id, {'newName': outObj.name});
	});
	
	outObj.socket.on('changeview', function(params, id) {
		console.log("changing view: " + params.channel + "||" + id);
		db.loadView(params.channel, outObj, function(handler, caller, msg) {
			console.log("emitting error");
			outObj.socket.emit('problem', id, {'message': msg});
		}, function(handler, parent, children) {
			console.log('output change view: ' + children.length);
			outObj.curView = params.channel;
			outObj.socket.emit('response', id, {'messages': children, 'parent': params.channel});
		});
	});

	outObj.socket.on('loadchannels', function(params, id) {
		console.log("loading channels");
		db.loadChannels(outObj, outObj.name, function(handler, msg) {
			console.log("emitting error");
			outObj.socket.emit('problem', id, {'message': msg});
		}, function(handler, children) {
			console.log('output load channels: ' + children.length);
			outObj.socket.emit('response', id, {'messages': children});
		});
	});

	
	outObj.socket.on('disconnect', function() {
		console.log("disconnecting");
		switchbox.deregisterClient(outObj);
		// TODO: may need to kill socket to finish GC
		outObj.socket = undefined;
	});	
};

exports.handleNewMessage = function(handler, speaker, message, chanID, time) {
	console.log("check: " + handler.curView + "||" + chanID);
	// this implementation is a bit inefficient because it sends the full message to everyone which increases bandwidth usage
	//handler.socket.emit('newmsg', {'channel': chanID, 'poster': speaker, 'msg': message, 'lastMsgTime': time});
	// TODO: this implementation sends less data, but requires one more database action
	handler.socket.emit('newmsg', {'channel': chanID});
};

exports.handleNewChannel = function(handler, speaker, message, chanID) {
	// TODO: this is a hack, implement this properly
	if (handler.curView == 0) {
		handler.socket.emit('newchan', speaker, message, chanID);
	}
};




