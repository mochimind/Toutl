// note need to run this as root

var express = require('express');
var gravatar = require('gravatar');

var port = 80;

var app = express();
var io = require('socket.io').listen(app.listen(port));

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');

app.get('/', function(req, res){ 
	res.render('home'); 
});
