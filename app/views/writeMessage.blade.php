@extends('layout.master')

@section('content')

<div class='panel panel-default'>
	<div class='panel-heading'>
		<p class='panel-title'>Index</p>
	</div>

	<div class='panel-body'>
		<form method='post' action='{{ URL::route("sendMessage"); }}'>
			<input id='subtext' type='text' class='form-control' placeholder='message' name='message' />
			<br>
			<input id='sub' type='submit' class='btn btn-default' value='send' />
		</form>
	</div>
</div>

<script>
	var socket	=	io.connect('http://localhost:8100');
	socket.emit('enter', {user: 'john'});

	$('#sub').click(function(e)
	{
		e.preventDefault();
		var text =	 $('#subtext').val();
		socket.emit('messagex', {user: 'kyleruss', content: text});
	}); 
</script>

@stop
