var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '/public')));

var users = 0;

io.on('connection', function(socket){
	users++;
	socket.name = "Neekeri" + users;
	console.log(socket.name + " connected");
	io.emit('chat message', socket.name + " connected");
	socket.on('disconnect', function(){
		io.emit('chat message', socket.name + " disconnected");
		users--;
	});
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		io.emit('chat message', socket.name + " : " + msg);
	});
	socket.on('change name', function(user){
		io.emit('chat message', socket.name + " changed name to " + user);
		console.log(socket.name + " changed name to " + user);
		socket.name = user;
	});
});

var port = Number(process.env.PORT || 3000);

http.listen(port, function(){
	console.log('listening on *:3000');
});