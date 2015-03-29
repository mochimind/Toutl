Toutl.ServerConnection = {};

Toutl.ServerConnection.requests = {};
Toutl.ServerConnection.requestCounter = Math.ceil(Math.random() * 100000);
Toutl.ServerConnection.Init = function() {
	Toutl.ServerConnection.socket = io.connect('/socket');
	console.log('connected');
	
	Toutl.ServerConnection.socket.on('connect', function(){
		Toutl.ServerConnection.socket.emit('connected', Toutl.Landing.myName);
	});
	
	Toutl.ServerConnection.socket.on('response', function(id, params) {
		console.log("received response: " + id);
		var request = Toutl.ServerConnection.requests[id];
		if (request == undefined) { return; }
		if (request.okCallback!= null) { request.okCallback(params); }
	});

	Toutl.ServerConnection.socket.on('problem', function(id, params) {
		var request = Toutl.ServerConnection.requests[id];
		if (request == undefined) { return; }
		
		request.errCallback(params);
	});
	
	Toutl.ServerConnection.socket.on('newchan', function(poster, msg, chanID) {
		// TODO: this is a hack for testing, fix
		Toutl.Channel.NewChannel(poster, msg, chanID);
	});	
};

Toutl.ServerConnection.RegisterListener = function(messageType, callback) {
	Toutl.ServerConnection.socket.on(messageType, function(params) {
		callback(params);
	});
};

Toutl.ServerConnection.RemoveListener = function(messageType, callback) {
	if (callback != undefined) {
		Toutl.ServerConnection.socket.removeListener(messageType, callback);		
	} else {
		Toutl.ServerConnection.socket.removeAllListeners(messageType);		
	}
};

Toutl.ServerConnection.CreateRequest = function(type, params, okCallback, errCallback) {
	var id = Toutl.ServerConnection.requestCounter++;	
	Toutl.ServerConnection.requests[id] = {
			'okCallback': okCallback,
			'errCallback': errCallback,
			'params': params
		};
	Toutl.ServerConnection.socket.emit(type, params, id);
	return id;
};

Toutl.ServerConnection.CancelRequest = function(id) {
	Toutl.ServerConnection.requests[i] = undefined;
};

