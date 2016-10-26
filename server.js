var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '/public')));

var userList = [];
var randomNames = ["Donald Trump", "Ismo Laitela", "Obama", "Arnold Scwarzenegger", "Anssi", "Teppo", "Hillary Clinton", "clone man", "Jakob", "Harambe"];

app.get('/', function(req, res){
	res.sendFile(__dirname, '/index.html');
});

io.on('connection', function(socket){
	//New user
	socket.name = "Spectator " + randomNames[Math.floor((Math.random() * 10))];
	console.log(socket.name + " connected");
	socket.broadcast.emit('status msg green', socket.name + " connected");
	userList.push(socket);
	updateUsers();
	socket.emit('status msg green' ,"Welcome! Start by typing your name!");

	//Disconnect
	socket.on('disconnect', function(){
		io.emit('status msg red', socket.name + " disconnected");
		userList.splice(userList.indexOf(socket), 1);
		updateUsers();
	});

	//Chat message
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

	//Status message green
	socket.on('status msg green', function(msg){
		io.emit('status msg green', msg);
	});

	//Status message yellow
	socket.on('status msg yellow', function(msg){
		socket.emit('status msg yellow', msg);
	});

	socket.on('cmd users', function(){
		var usertext = "Current users: ";
		for(i=0;i<userList.length;i++){
			usertext += userList[i].name + " ";
		}
		socket.emit('status msg yellow', usertext);
	});

	socket.on('cmd clone', function(){
		io.emit('status msg yellow', "is caled clone man");
	});

	//Change username
	socket.on('change name', function(user){
		io.emit('status msg green', socket.name + " changed name to " + user);
		console.log(socket.name + " changed name to " + user);
		socket.name = user;
		userList.splice(userList.indexOf(socket), 1);
		userList.push(socket);
		updateUsers();
	});

	function updateUsers() {
		var users = [];
		for(i = 0; i < userList.length; i++){
			users.push(userList[i].name);
		}
		io.emit('set users', users);
	}
});

var port = Number(process.env.PORT || 3000);

http.listen(port, function(){
	console.log('listening on *:3000');
});