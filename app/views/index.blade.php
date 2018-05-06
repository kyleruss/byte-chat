@extends('layout.master')

@section('content')

<div class='panel panel-default'>
	<div class='panel-heading'>
		<p class='panel-title'>Index</p>
	</div>

	<div class='panel-body'>
		<div id='messages'>

		</div>
	</div>
</div>

<script>
	var username = prompt("test");
	var socket	=	io.connect('http://localhost:8100');
	socket.emit('enter', {user: username});

	socket.on('messagex', function(data)
	{
			console.log(data);
		$('#messages').append('<p>' + data.content + '</p>');
	});
</script>

@stop
