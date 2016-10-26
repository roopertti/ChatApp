var socket = io();

$('#typemsg').submit(function(){
  	socket.emit('chat message', $('#msg').val());
  	$('#msg').val('');
	return false;
});

socket.on('chat message', function(msg){
  	$('#messages').append($('<li class="list-group-item">').text(msg));
  	$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 100);
});

socket.on('change name', function(msg){
  	$("#messages").append($('<li class="list-group-item list-group-item-success">').text(msg));
  	$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 100);
});

socket.on('offline', function(msg){
  	$("#messages").append($('<li class="list-group-item list-group-item-danger">').text(msg));
  	$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 100);
});



socket.on('clear users', function(){
	$('#users').empty();
});

socket.on('set userlist', function(user){
	$("#users").append($('<li class="list-group-item">').text(user));
})


$('#username').submit(function(){
  	socket.emit('change name', $('#user').val());
  	$('#user').val('');
  	return false;
});