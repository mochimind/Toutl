// note need to run this as root

var express = require('express');
var gravatar = require('gravatar');

var io = require('socket.io').listen(app.listen(port));
var app = express();

var port = 80;

app.get('/', function(req, res){ 
	res.render('home'); 
});
