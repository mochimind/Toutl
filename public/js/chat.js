var Toutl = {};
Toutl.Chat = {};

Toutl.Chat.CreateChannel = function(message) {
	Toutl.Chat.socket.emit("create_chan", message);
};

Toutl.Chat.CreateMessage = function(message) {
	Toutl.Chat.socket.emit("create_msg", message);
};

Toutl.Chat.UpdateName = function(newName) {
	socket.emit("changename", newName);
};

Toutl.Chat.RequestView = function(channelID) {
	
};

$(function(){
	// connect to the socket
	Toutl.Chat.socket = io.connect('/socket');
	Toutl.GUIDisplay.Init();
	//console.log("hit");
	
	// on connection to server get the id of person's room
	Toutl.Chat.socket.on('connect', function(){
		Toutl.Chat.socket.emit('connected', Toutl.GUIDisplay.myName);
		Toutl.Chat.socket.emit('init');
	});
	
	Toutl.Chat.socket.on('updateview', function(parent, children) {
		Toutl.MessageDisplay.DisplayChannels(children);		
	});
	
	Toutl.Chat.socket.on('newmsg', function(poster, msg) {
		// TODO: this is a hack for testing, fix
		Toutl.MessageDisplay.ShowMsg(poster, msg, Toutl.MessageDisplay.ChildClass);
	});
	
	Toutl.Chat.socket.on('problem', function(request, message) {
		console.log("received: " + request + "||" + message);
		alert("Error processing request: " + request + " - " + message);		
	});	
});