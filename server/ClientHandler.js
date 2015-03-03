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
		switchbox.broadcast(lineage, msg);
		
		// database update
		var newID = db.createMessage(this.name, msg, this.sendError.bind(this), this.confirmPost.bind(this));
	}.bind(this));
	
	this.socket.on("changename", function(newName) {
		this.name = newName;
	}.bind(this));
	
	this.socket.on("gotochild", function(id) {
		this.lineage.push(id);
		
		//load view from database
		db.loadView(id, this.sendError.bind(this), this.updateView.bind(this));
	}.bind(this));
	
	this.socket.on('init', function() {
		this.lineage.push(0);
		db.loadView(0, this.sendError.bind(this), this.updateView.bind(this));
	}.bind(this));
	
	this.socket.on("gotoparent", function() {
		this.lineage.splice(this.lineage.length - 1, 1);
		
		// load view from database
		db.loadView(this.lineage[this.lineage.length - 1], this.sendError.bind(this), this.updateView.bind(this));
	}.bind(this));
	
	this.socket.on('disconnect', function() {
		switchbox.deregisterClient(this);
		// TODO: may need to kill socket to finish GC
	}.bind(this));	
};

// TODO: we should have these send requestIDs and not messages to the database and client for callback
exports.Handler.HandlePost = function(_lineage, message) {
	console.log("implement handling post");
};

exports.Handler.prototype.sendError = function(caller, msg) {
	this.socket.emit('error ',  caller,  msg);
};

exports.Handler.prototype.confirmPost = function(msg, id) {
	this.socket.emit('confirm', msg, id);
};

exports.Handler.prototype.updateView = function(parent, children) {
	this.socket.emit('updateview', parent, children);
};


