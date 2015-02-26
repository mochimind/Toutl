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
	chat.emit("connect", 0);
	connected.push(chat);
	console.log(connected.length + " connected");
	
	socket.on("msg", function(broadcaster, msg) {
		console.log("hit");
	});
});
