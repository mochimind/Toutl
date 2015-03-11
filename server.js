var Toutl = {};

// note need to run this as root

var express = require('express');
var gravatar = require('gravatar');
var handler = require('./server/ClientHandler');

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

io.of('/socket').on('connection', function (socket) {
	handler.Initialize(socket);
});
