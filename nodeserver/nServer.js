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

	socket.on('chat_req', function(data)
	{
		console.log('data: ' + data);
		io.sockets.in(data.user_req).emit('chat_req_rec', data);
	});

	socket.on('chat_req_ans', function(data)
	{
		if(data.answer)
			socket.join(data.room);

		io.sockets.in(data.user_requester).emit('chat_req_reply', { answer: data.answer, room: data.room, pkey: data.pkey, user_recip: data.user_recip });
		
	});

	socket.on('chat_private_create', function(data)
	{
		socket.join(data.room);

		io.sockets.in(data.contact).emit('private_room_ready', { room: data.room, chatting_with: data.sender });
	});

	socket.on('private_room_msg', function(data)
	{
		io.sockets.in(data.room).emit('private_room_broadcast', { message: data.message, sender: data.sender, room: data.room });
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
		console.log('disconnect');
	});
});
