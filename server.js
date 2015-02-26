// note need to run this as root

var express = require('express');
var gravatar = require('gravatar');

var port = 80;

var app = express();
var io = require('socket.io').listen(app.listen(port));
var connected = [];

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){ 
	res.render('home'); 
});

var chat = io.of('/socket').on('connection', function (socket) {
	var name = "";

	socket.on("connected", function(_name) {
		connected.push(socket);
		console.log(connected.length + " connected");
		name = _name;
	});
	
	socket.on("msg", function(msg) {
		console.log("hit " + msg);
		var arrLen = connected.length;
		for (var i=0 ; i<arrLen ; i++) {
			if (connected[i] != socket) {
				console.log("found 1");
				connected[i].emit("receiveMsg", name, msg);
			}
		}
	});
	
	socket.on("changename", function(newName) {
		var arrLen = connected.length;
		for (var i=0 ; i<arrLen ; i++) {
			if (connected[i] != socket) {
				connected[i].emit("changename", name, newName);
			}
		}
		name = newName;

	});
	
	socket.on('disconnect', function() {
		var index = connected.indexOf(socket);
		if (index != -1) {
			connected.splice(index, 1);
			console.log("disconnecting 1");
			var arrLen = connected.length;
			for (var i=0 ; i<arrLen ; i++){
				connected[i].emit("leaving", name);
			}
		}
	});	
});
