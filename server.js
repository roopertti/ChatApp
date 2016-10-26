var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '/public')));

var users = 0;
var userList = [];

app.get('/', function(req, res){
	res.sendFile(__dirname, '/index.html');
});

io.on('connection', function(socket){
	users++;
	socket.name = "User" + users;
	userList.push(socket);
	console.log(socket.name + " connected");
	socket.broadcast.emit('change name', socket.name + " connected");
	socket.emit('change name' ,"Welcome! Current users: " + users);
	socket.on('disconnect', function(){
		io.emit('offline', socket.name + " disconnected");
		userList.splice(userList.indexOf(socket), 1);
		users--;
	});
});

io.on('connection', function(socket){

	socket.on('chat message', function(msg){
		var currentTime = new Date();
		var today = new Date();  
		var localoffset = -(today.getTimezoneOffset()/60);
		var destoffset = +3;

		var offset = destoffset-localoffset;
		var d = new Date( new Date().getTime() + offset * 3600 * 1000);
		var minutes = d.getMinutes();
		if(minutes < 10){
			minutes = "0" + minutes; 
		}

		io.emit('chat message', "[" + d.getHours() + ":" + minutes + "] " + socket.name + " : " + msg);
	});
	socket.on('change name', function(user){
		io.emit('change name', socket.name + " changed name to " + user);
		console.log(socket.name + " changed name to " + user);
		socket.name = user;
	});
});



var port = Number(process.env.PORT || 3000);

http.listen(port, function(){
	console.log('listening on *:3000');
});