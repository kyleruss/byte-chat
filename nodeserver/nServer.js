var app		=	require('express')();
var server	=	require('http').Server(app);
var io		=	require('socket.io')(server);
var redis	=	require('redis');

server.listen(8100);

io.on('connection', function(socket)
{
	socket.on('client_join', function(data)
	{
		console.log('Client connect: ' + data.user);
		socket.join(data.user);
	});

	socket.on('notification_push', function(data)
	{
		console.log(data);
		io.sockets.in(data.user).emit('notification_broadcast', 
		{notify_title: data.notify_title, notify_content: data.notify_content});
	});

	socket.on('exit', function(data)
	{
		socket.leave(data.user);
	});

	socket.on('messagex', function(message)
	{
		io.sockets.in(message.user).emit('messagex', {content: message.content});
	});

	socket.on('disconnect', function()
	{

	});
});
