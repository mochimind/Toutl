Toutl.ServerConnection = {};

Toutl.ServerConnection.requests = {};
Toutl.ServerConnection.requestCounter = Math.ceil(Math.random() * 100000);
Toutl.ServerConnection.Init = function() {
	Toutl.ServerConnection.socket = io.connect('/socket');
	console.log('connected');
	
	Toutl.ServerConnection.socket.on('connect', function(){
		Toutl.ServerConnection.socket.emit('connected', Toutl.GUIDisplay.myName);
	});
	
	Toutl.ServerConnection.socket.on('response', function(id, params) {
		console.log("received response: " + id);
		var request = Toutl.ServerConnection.requests[id];
		if (request == undefined) { return; }
		request.okCallback(id, params);
	});

	Toutl.ServerConnection.socket.on('error', function(id, params) {
		var request = Toutl.ServerConnection.requests[id];
		if (request == undefined) { return; }
		
		request.errCallback(id, params);
	});
	
	Toutl.ServerConnection.socket.on('newmsg', function(poster, msg) {
		// TODO: this is a hack for testing, fix
		Toutl.MessageDisplay.ShowMsg(poster, msg);
	});

	Toutl.ServerConnection.socket.on('newchan', function(poster, msg, chanID) {
		// TODO: this is a hack for testing, fix
		Toutl.MessageDisplay.NewChannel(poster, msg, chanID);
	});	
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

