var switchbox = require('./Switchbox');
var db = require('./DatabaseHandler');

exports.Handler = function(_socket) {
	this.socket = _socket;
	this.name = "";
	this.lineage = [];
	
	this.socket.on("connected", function(_name) {		
		this.name = _name;
		switchbox.registerClient(this);
	}.bind(this));
	
	this.socket.on("msg", function(msg) {
		console.log("received message");
		switchbox.broadcast(this.lineage);
		
		// database update
		var newID = db.createMessage(this.name, msg, this.lineage[this.lineage.length - 1], this.sendError.bind(this), this.confirmPost.bind(this));
	}.bind(this));
	
	this.socket.on("changename", function(newName) {
		console.log("changing name");
		this.name = newName;
	}.bind(this));
	
	this.socket.on("gotochild", function(id) {
		console.log("going to child");
		this.lineage.push(id);
		
		//load view from database
		db.loadView(id, this.sendError.bind(this), this.updateView.bind(this));
	}.bind(this));
	
	this.socket.on('init', function() {
		console.log("initializing");
		this.lineage.push(0);
		db.loadView(0, this.sendError.bind(this), this.updateView.bind(this));
	}.bind(this));
	
	this.socket.on("gotoparent", function() {
		console.log("going to parent");
		this.lineage.splice(this.lineage.length - 1, 1);
		
		// load view from database
		db.loadView(this.lineage[this.lineage.length - 1], this.sendError.bind(this), this.updateView.bind(this));
	}.bind(this));
	
	this.socket.on('disconnect', function() {
		console.log("disconnecting");
		switchbox.deregisterClient(this);
		// TODO: may need to kill socket to finish GC
	}.bind(this));	
};

// TODO: we should have these send requestIDs and not messages to the database and client for callback
exports.Handler.prototype.handlePost = function(_lineage, message) {
	// TODO: this is a hack, implement this properly
	this.socket.emit();
};

exports.Handler.prototype.sendError = function(caller, msg) {
	console.log("emitting error");
	this.socket.emit('problem',  caller,  msg);
};

exports.Handler.prototype.confirmPost = function(msg, id) {
	console.log("confirming");
	this.socket.emit('confirm', msg, id);
};

exports.Handler.prototype.updateView = function(parent, children) {
	console.log("updating view");
	this.socket.emit('updateview', parent, children);
};


