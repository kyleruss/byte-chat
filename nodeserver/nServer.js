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
		{notify_title: data.notify_title, notify_content: data.notify_content, notify_type: data.notify_type});
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

	socket.on('conversation_leave', function(data)
	{
		socket.leave(data.room);

		var users_count = 0;

		if(io.sockets.adapter.rooms.hasOwnProperty(data.room))
			users_count	=	io.sockets.adapter.rooms[data.room].length;

		io.sockets.in(data.room).emit('user_conversation_left', { user: data.user, room_count: users_count, room: data.room });
	});

	socket.on('user_log', function(data)
	{
		var rName;
		if(data.login)
		{
			rName = 'friend_online';
			socket.join(data.username);
		}

		else
			rName = 'friend_offline';

		data.friends.forEach(function(friend)
		{
			console.log('friend');
			console.log(friend.username);
			io.sockets.in(friend.username).emit(rName, { name: data.name, username: data.username });
		});	

		io.sockets.in(data.username).emit('user_log_finished', { status: true });
	});




	socket.on('conversation_cancel', function(data)
	{
		io.sockets.in(data.recip).emit('user_conversation_cancel', { user: data.user, room: data.room });
	});

	socket.on('chat_private_create', function(data)
	{
		socket.join(data.room);

		io.sockets.in(data.contact).emit('private_room_ready', { room: data.room, chatting_with: data.sender });
	});

	socket.on('private_room_msg', function(data)
	{
		socket.broadcast.to(data.room).emit('private_room_broadcast', data);
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
