var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '/public')));

var users = 0;
var userList = [];

io.on('connection', function(socket){
	users++;
	socket.name = "Äpärä" + users;
	userList.push(socket);
	console.log(socket.name + " connected");
	socket.broadcast.emit('change name', socket.name + " connected");
	socket.emit('change name' ,"Tervetuloo, tämän hetkinen äpärien määrä chatissa: " + users);
	socket.on('disconnect', function(){
		io.emit('offline', socket.name + " disconnected");
		userList.splice(userList.indexOf(socket), 1);
		users--;
	});
});

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		io.emit('chat message', socket.name + " : " + msg);
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