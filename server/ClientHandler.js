var switchbox = require('./Switchbox');
var db = require('./DatabaseHandler');

Toutl.ClientHandler = function(_socket) {
	this.socket = _socket;
	this.name = "";
	this.lineage = [];
	
	this.socket.on("connected", function(_name) {		
		this.name = _name;
		switchbox.registerClient(this);
	});
	
	this.socket.on("msg", function(msg) {
		switchbox.broadcast(lineage, msg);
		
		// database update
	});
	
	this.socket.on("changename", function(newName) {
		name = newName;
	});
	
	this.socket.on("gotochild", function(id) {
		lineage.push(id);
		
		//load view from database
	});
	
	this.socket.on("gotoparent", function(id) {
		lineage.splite(lineage.length - 1, 1);
		
		// load view from database
	});
	
	this.socket.on('disconnect', function() {
		switchbox.deregisterClient(this);
	});	
};

Toutl.ClientHandler.prototype.handlePost = function(_lineage, message) {
	console.log("implement handling post");
};


