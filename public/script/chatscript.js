var socket = io();

//Message submit
$('#typemsg').submit(function(){
	var input = $('#msg').val();

	switch(input){
		case "": socket.emit('status msg yellow', "You're message was blank...");
		$('#msg').val('');
		return false;
		break;
		case "/users": socket.emit('cmd users');
		$('#msg').val('');
		return false;
		break;
		default: socket.emit('chat message', $('#msg').val());
		$('#msg').val('');
		return false;
		break;
	}
});

//Append message
socket.on('chat message', function(msg){
  	$('#messages').append($('<li class="list-group-item">').text(msg));
  	$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 100);
});

//Green status message
socket.on('status msg green', function(msg){
  	$("#messages").append($('<li class="list-group-item list-group-item-success">').text(msg));
  	$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 100);
});

//Red status message
socket.on('status msg red', function(msg){
  	$("#messages").append($('<li class="list-group-item list-group-item-danger">').text(msg));
  	$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 100);
});

//Yellow status message
socket.on('status msg yellow', function(msg){
	$("#messages").append($('<li class="list-group-item list-group-item-warning">').text(msg));
  	$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 100);
});

socket.on('set username', function(data){
	$('#who').text('');
	$('#who').text(data);
})

//Set users
socket.on('set users', function(data){
	$('#users').empty();
	for(i = 0;i < data.length;i++){
		$("#users").append($('<li class="list-group-item list-group-item-warning">').text(data[i]));
	}
});

//Submit username
$('#username').submit(function(){
	var input = $('#user').val();
	if(input == ""){
		socket.emit('status msg yellow', "Blank username, not cool...");
		$('#user').val('');
		return false;
	} else {
		socket.emit('change name', $('#user').val());
		$('#user').val('');
		return false;
	}
});