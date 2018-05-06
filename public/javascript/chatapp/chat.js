$(function()
{
	var person_template_item, notification_template_item, chat_window_template, chat_message_template;
	var active_rooms = {};
	var cSocket;
	var activeUser;
	initTooltips();
	initTemplates();
	initTabContent();
	loadFriendlist();
	initChatContent();
	connectClient();
	$('#home_btn').find('button').addClass('btn-default');
	$('#home_btn').find('button').removeClass('btn-danger');
	$('#chat_home_btn').find('button').addClass('btn-danger');
	$('#nav_register').hide();
	$('#nav_login').hide();

	$('.chat_window').draggable();
	$('.message_output_line').tooltip({container: '.message_output_inner'});
	$('.message_output_line').tooltip('show');

	$('#people_search_btn').click(function(e)
	{
		e.preventDefault();
		var form	=	$('#people_search_form');
		var url		=	form.attr('action');
		var data	=	form.serialize();

		if($('#people_search').val() == '')
		{
			loadFriendlist();
			return;
		}

		var ladda	=	Ladda.create(this);

		ladda.start();
		$.ajax
		({
			url: url,
			method: 'POST',
			data: data,
			dataType: 'json',
			success: function(response)
			{
				console.log(response);
				hideResultContainers();

				if(response.length == 0)
				{
					setTimeout(function()
					{
						ladda.stop();
						showNoResultsContainer();
					}, 1000);
				}
				else
				{
					setTimeout(function()
					{
						$('#people_list_group').empty();
						$.each(response, function(key, val)
						{
							var item = person_template_item.clone();
							item.find('.person_image').attr('src',  val.profile_image);
							item.find('.person_dn').text(val.name);
							item.find('.person_username').text(val.username);
							item.find('.remove_person_btn').hide();
							item.find('.message_person_btn').hide();
							item.find('.list_image').find('img').addClass('person_unkown');
							$('#people_list_group').append(item);

							ladda.stop();
							$('#people_list').fadeIn('fast');
						});
					}, 1000);
				}
			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		});
	});

	$('#people_search').keydown(function(e)
	{
		if($(this).val() == '')
			loadFriendlist();

	});

	$('.user_profile_image, #change_bg_label').hover(function()
	{
		$('.user_profile_image').addClass('profile_image_fade');
		$('#change_bg_label').removeClass('hide');
	}, function()
	{
		$('.user_profile_image').removeClass('profile_image_fade');
		$('#change_bg_label').addClass('hide');
	});

	$('.user_profile_image, #change_bg_label').click(function()
	{
		$('#dp_path_input').val('');
		$('#change_dp_alert').hide();
		$('#dp_change_modal').modal('show');
	});

	$('#load_new_dp_btn').click(function(e)
	{
		e.preventDefault();
		var imagePath	=	$('#dp_path_input').val();
		$('.new_dp_image').attr('src', imagePath);
		$('#dp_path_input').focus();
	});


	$('#save_dp_change').click(function()
	{
		var form	=	$('#save_dp_form');
		var url		=	form.attr('action');
		var data	=	form.serialize();
		
		$.ajax
		({
			url: url,
			data: data,
			method: 'POST',
			dataType: 'json',
			success: function(response)
			{
				$('#change_dp_alert').removeClass('alert-success');
				$('#change_dp_alert').removeClass('alert-danger');
				$('#change_dp_alert_message').text(response.message);

				if(response.status)
					$('#change_dp_alert').addClass('alert-success');
				else
					$('#change_dp_alert').addClass('alert-danger');

				$('#change_dp_alert').show();

				if(response.status)
				{
					var newSrc = $('#dp_path_input').val();
					setTimeout(function()
					{
						
						$('#dp_change_modal').modal('hide');
						$('.user_profile_image').attr('src', newSrc);
					}, 1000);
				}
			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		});
	});

	$('#friends_tab_header').click(function()
	{
		loadFriendlist();
		showTab('#friends_tab');
	});

	$('#notifications_tab_header').click(function()
	{
		loadNotificationList();
	});

	$('#settings_tab_header').click(function()
	{
		var fetchSettingsURL	=	$(this).find('a').attr('href');
		showTab('#transition_view');

		$.getJSON(fetchSettingsURL, function(response)
		{
			var tabContent	=	$('#settings_tab');
			tabContent.find('input[name="user_dn"]').val(response.user_dn);
			tabContent.find('input[name="user_dp"]').val(response.user_dp);
			tabContent.find('input[name="user_email"]').val(response.user_email);

			showTab('#settings_tab');
		});
	});

	$('#settings_update_btn').click(function(e)
	{
		var ladda = Ladda.create(this);
		ladda.start();

		e.preventDefault();
		var form	=	$('#settings_update_form');
		var url		=	form.attr('action');
		var data	=	form.serialize();
		var dp		=	form.find('input[name="user_dp"]').val();
		var dn		=	form.find('input[name="user_dn"]').val();

		console.log(data);

		$.ajax
		({
			url: url,
			data: data,
			method: 'POST',
			dataType: 'json',
			success: function(response)
			{
				console.log(response);
				setTimeout(function()
				{
					ladda.stop();

					showReturnMessage($('#settings_change_alert'), response.status, 
					response.message, $('#settings_change_message'));

					if(response.status)
					{
						$('.user_profile_image').attr('src', dp);
						$('#user_name_label').text(dn);
					}
				}, 500);
			},
			
			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		});
	});

	$(document).on('click', '.add_person_btn', function(e)
	{
		e.preventDefault();
		var btn			=	$(this);
		var url			=	btn.attr('href');
		var container	=	btn.closest('.person_list_item');
		var user		=	container.find('.person_username').text();

		if(user == activeUser)
		{	
			showReturnMessage('#person_status_alert', false,
					'You cannot add yourself', '#person_status_message');
			return;
		}

		var data	=	'user_id=' + user;
		$.ajax
		({
			url: url,
			data: data,
			method: 'POST',
			dataType: 'json',
			success: function(response)
			{
				showReturnMessage('#person_status_alert', response.status,
					response.message, '#person_status_message');

				var data_message	=	activeUser + ' has sent you a friend request';
				var data_title		=	'New friend request';

				if(response.status)
					cSocket.emit('notification_push', {user: user, notify_title: data_title, notify_content: data_message});
			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		});	
		
	});

	$(document).on('click', '.remove_person_btn', function(e)
	{
		e.preventDefault();
		var btn			=	$(this);
		var url			=	btn.attr('href');
		var container	=	btn.closest('.person_list_item');
		var friendid	=	container.attr('data-friendid');
		var data		=	'friendship_id=' + friendid;

		console.log(data);
		$.ajax
		({
			url: url,
			data: data,
			method: 'POST',
			dataType: 'json',
			success: function(response)
			{

				showReturnMessage('#person_status_alert', response.status,
					response.message, '#person_status_message');

				if(response.status)
					container.remove();

				if($('.person_list_item').length == 0)
					showNoFriendsContainer();

			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		});
	});

	$(document).on('click', '.message_person_btn', function(e)
	{
		e.preventDefault();
		$('#chat_waiting_modal').modal('show');
		var secret				=	SafeExchange.generateSecretInt();
		var roomid				=	SafeExchange.makeHash(secret);

		var myDispName			=	$('#user_name_label').text();
		var myDispImage			=	$('.user_profile_image').attr('src');
		var chatUser			=	$(this).closest('.person_list_item');
		var chatUsername		=	chatUser.find('.person_username').text();
		var chatDispImage		=	chatUser.find('.person_image').attr('src');
		var chatDispName		=	chatUser.find('.person_dn').text();
		var public_key			=	SafeExchange.generatePublicKey(secret);
		active_rooms[roomid]	=	{ 'secret': secret, 'pkey': '', 'iv': '', 'pubkey': public_key,
									person: {username: chatUsername, dn: chatDispName, dp: chatDispImage}};
		console.log('## SENDER KEY ESTABLISHMENT FOR ROOM: ' + roomid);
		console.log('-- GENERATED SECRET: ' + secret);
		console.log('-- PUBLIC KEY: ' + public_key);

		cSocket.emit('chat_req', {user_req: chatUsername, user_from: activeUser, room: roomid, pkey: public_key,
								 person: {username: activeUser, dn: myDispName, dp: myDispImage}});

		$('.cancel_chat_req, .chat_waiting_close').click(function()
		{
			delete active_rooms[roomid];
			cSocket.emit('conversation_cancel', { room: roomid, recip: chatUsername, user: activeUser });
			$('#chat_waiting_modal').modal('hide');
		});
	});


	cSocket.on('chat_req_rec', function(data)
	{
		$('.chat_requester_id').text(data.user_from);
		$('.reciever_waiting_msg').text('');
		$('#chat_req_modal').attr('data-roomid', data.room);
		$('#chat_req_modal').modal('show');

		var secret			=	SafeExchange.generateSecretInt();
		var public_key		=	SafeExchange.generatePublicKey(secret);
		var private_key		=	SafeExchange.generatePrivateKey(data.pkey, secret);
		var iv				=	SafeExchange.generateIV(private_key);

		console.log('## RECIEVER KEY ESTABLISHMENT FOR ROOM: ' + data.room);
		console.log('-- GENERATED SECRET: ' + secret);
		console.log('-- REC PUBLIC KEY: ' + data.pkey);
		console.log('-- PUBLIC KEY: ' + public_key);
		console.log('-- PRIVATE KEY: ' + private_key);
		console.log('-- INITIAL VECTOR: ' + iv);

		active_rooms[data.room]	=	{ 'secret': secret, 'pkey': private_key, 'iv': iv, person: data.person, 'pubkey': public_key };

		$('.accept_chat_req').click(function(e)
		{
			e.stopImmediatePropagation();
			var roomid = $('#chat_req_modal').attr('data-roomid');
			cSocket.emit('chat_req_ans', { answer: true, room: roomid, user_requester: data.user_from, user_recip: activeUser,  pkey: active_rooms[roomid].pubkey });
			$('.reciever_waiting_msg').text('Handshaking..');
			return;
		});

		$('.decline_chat_req, .decline_chat_close').click(function()
		{
			var roomid = $('#chat_req_modal').attr('data-roomid');
			$('#chat_req_modal').modal('hide');
			cSocket.emit('chat_req_ans', { answer: false, room: roomid, user_requester: data.user_from, user_recip: activeUser });
		});
	});


	cSocket.on('chat_req_reply', function(data)
	{
		var room		=	data.room;
		var public_key	=	data.pkey;

		if(data.answer)
		{
			var private_key	=	SafeExchange.generatePrivateKey(public_key, active_rooms[room].secret);
			var iv			=	SafeExchange.generateIV(private_key);
			console.log('## SENDER KEY ESTABLISHMENT FOR ROOM ' + room);
			console.log('-- PUBLIC KEY: ' + public_key);
			console.log('-- PRIVATE KEY: ' + private_key);
			console.log('-- INITIAL VECTOR: ' + iv);

			active_rooms[room].pkey	=	private_key;
			active_rooms[room].iv	=	iv;

			cSocket.emit('chat_private_create', { room: room, contact: data.user_recip, sender: activeUser });
			$('#chat_req_modal').modal('hide');
			$('#chat_waiting_modal').modal('hide');
			createChatWindow(data.user_recip, room);
		}

		else
		{
			delete active_rooms[room];
			var prevMessage	=	$('.waiting_status_msg').text();
			$('.waiting_status_msg').text(data.user_recip + ' has declined');
			setTimeout(function()
			{
				$('#chat_waiting_modal').modal('hide');
				setTimeout(function()
				{
					$('.waiting_status_msg').text(prevMessage);
				}, 500);
			}, 1000);
		}
	});


	cSocket.on('user_conversation_cancel', function(data)
	{
		delete active_rooms[data.room];
		var originalMsg = $('.request_waiting_msg').text();

		$('.request_waiting_msg').text(' has canceled');
		$('.decline_chat_req').attr('disabled', true);
		$('.accept_chat_req').attr('disabled', true);

		setTimeout(function()
		{
			$('#chat_req_modal').modal('hide');
			setTimeout(function()
			{
				$('.request_waiting_msg').text(originalMsg);
				$('.decline_chat_req').removeAttr('disabled');
				$('.accept_chat_req').removeAttr('disabled');
			}, 500);
		}, 1000);
	});


	cSocket.on('user_conversation_left', function(data)
	{
		var chatWindow	=	active_rooms[data.room].windowobj;
		chatWindow.find('.msg_send_btn').attr('disabled', true);
		var chatAlert	=	chatWindow.find('.wind_msg_alert');
		chatAlert.find('.wind_msg_alert_content').text(data.user + ' has left the conversation');
		chatAlert.fadeIn('fast');
	});

	cSocket.on('private_room_ready', function(data)
	{
		var room	=	data.room;
		var user	=	data.chatting_with;

		$('#chat_req_modal').modal('hide');
		$('#chat_waiting_modal').modal('hide');
		createChatWindow(user, room);
	});

	$('#nav_logout').off('click');

	$('#nav_logout').click(function(e)
	{
		e.preventDefault();
		$.each(active_rooms, function(room)
		{
			cSocket.emit('conversation_leave', { room: room, user: activeUser });
		});

		logoutUser();
	});

	cSocket.on('private_room_broadcast', function(data)
	{
		var sender	= data.sender;
		var message	= readMessage(data);
		console.log(message);

		if(message == null) 
		{
			console.log('NULL!');
			return;
		}

		addMessage(sender, message, data.room);	
	/*	var prev_message	=	$('.message_item_template').last();
		var next_message	=	prev_message.clone();
		next_message.find('.message_profile_text').text(sender);
		next_message.find('.msg_holder').text(message);

		var cFrame	=	next_message.find('.msg_holder');
		var pFrame	=	next_message.find('.msg_pframe');

		if(sender == activeUser)
		{
			cFrame.removeClass('inner');
			cFrame.addClass('inner_right');
			cFrame.addClass('chat_frame_right');
			cFrame.removeClass('chat_frame');
			pFrame.removeClass('profile_frame');
			pFrame.addClass('profile_frame_right');
		}

		else
		{
			cFrame.addClass('chat_frame');
			cFrame.removeClass('chat_frame_right');
			cFrame.addClass('inner');
			cFrame.removeClass('inner_right');
			pFrame.addClass('profile_frame');
			pFrame.removeClass('profile_frame_right');
		}

		next_message.hide();
		prev_message.after(next_message);
		next_message.fadeIn('fast');
		$('.message_output').animate({ scrollTop: $('.message_output').prop('scrollHeight') }, 500); */
	});

	function addMessage(sender, message, room)
	{
		var container		=	active_rooms[room].windowobj.find('.message_output');
		var prev_message	=	container.find('.message_item_template').last();
		var next_message	=	chat_message_template.clone();

		var cFrame	=	next_message.find('.msg_holder');
		var pFrame	=	next_message.find('.msg_pframe');
		var pImage, pName;

		if(sender == activeUser)
		{
			cFrame.removeClass('inner');
			cFrame.addClass('inner_right');
			cFrame.addClass('chat_frame_right');
			cFrame.removeClass('chat_frame');
			pFrame.removeClass('profile_frame');
			pFrame.addClass('profile_frame_right');

			pName	=	$('#user_name_label').text();
			pImage	=	$('.user_profile_image').attr('src');
		}

		else
		{
			cFrame.addClass('chat_frame');
			cFrame.removeClass('chat_frame_right');
			cFrame.addClass('inner');
			cFrame.removeClass('inner_right');
			pFrame.addClass('profile_frame');
			pFrame.removeClass('profile_frame_right');

			var pObj	=	active_rooms[room].person;
			pName		=	pObj.dn;
			pImage		=	pObj.dp;
		} 

		pFrame.find('img').attr('src', pImage);
		next_message.find('.message_profile_text').text(pName);
		next_message.find('.msg_holder').text(message);

		next_message.hide();
		if(prev_message.length)
			prev_message.after(next_message);
		else
			container.append(next_message);

		next_message.fadeIn('fast');
		container.animate({ scrollTop: container.prop('scrollHeight') }, 500);
	}


	$(document).on('click', '.read_notification_btn', function(e)
	{
		e.preventDefault();
		var url			=	$(this).attr('href');
		var container	=	$(this).closest('.notification_list_item');
		var notifyID	=	container.attr('data-notificationid');
		var data		=	'notification_id=' + notifyID;

		$.ajax
		({
			url: url,
			data: data,
			method: 'POST',
			dataType: 'json',
			success: function(response)
			{
				console.log(response);

				var notification	=	response.notification;	
				var modal			=	$('#notification_read_modal');
				var controls		=	$('#notification_controls').clone();
				var extra_controls	=	$('#notification_modal_extra_controls');

				$('#notif_modal_title').text(notification.title);
				$('#notif_modal_content').text(notification.content);
				modal.find('.modal-content').attr('data-notificationid', notifyID);
				$('#notification_modal_content').attr('data-friendshipid', notification.friendship_id);
				extra_controls.empty();
				extra_controls.append(controls);
				controls.removeClass('hide');
				modal.modal('show');
			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		});
	});



	$(document).on('click', '.remove_notification_btn', function(e)
	{
		e.preventDefault();
		console.log('test');
		var btn			=	$(this);
		var url			=	btn.attr('href');
		var item		=	btn.closest('.notification_list_item');
		var notID		=	item.attr('data-notificationid');
		var data		=	'notification_id=' + notID;
		$('#notification_list').remove(item);
		console.log(item);
		$.ajax
		({
			data: data,
			url: url,
			method: 'POST',
			dataType: 'json',
			success: function(response)
			{
				console.log(response);
				btn.tooltip('hide');
				showReturnMessage('#notification_status_alert', response.status,
					response.message, '#notification_status_message');

				if(response.status)
					item.remove();
			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		}); 
	});


	cSocket.on('notification_broadcast', function(data)
	{
		console.log(data);
		showNotificationPop(data.notify_title, data.notify_content);

		if(data.notify_type == 1)
			loadFriendlist();
	});

	cSocket.on('friend_online', function(data)
	{
		showNotificationPop('Friend online', data.username + ' has logged on');
		var nextCount = parseInt($('.friend_online_count').text()) + 1;
		$('.friend_online_count').text(nextCount);

		setTimeout(function()
		{
			loadFriendlist();
		}, 3500);
	});

	cSocket.on('friend_offline', function(data)
	{
		showNotificationPop('Friend offline', data.username + ' has logged off');
		var nextCount = parseInt($('.friend_online_count').text()) - 1;
		if(nextCount < 0) nextCount = 0;

		$('.friend_online_count').text(nextCount);

		setTimeout(function()
		{
			loadFriendlist();
		}, 3500);
	});

	$(document).on('click', '#accept_request_btn', function(e)
	{
		e.preventDefault();
		respondFriendRequest(true);
	});

	$(document).on('click', '#reject_request_btn', function(e)
	{
		e.preventDefault();
		respondFriendRequest(false);
	});

	$(document).on('click', '.msg_send_btn', function(e)
	{
		e.preventDefault();
		var container	=	$(this).closest('.chat_window');
		var room		=	container.attr('data-roomid');
		var msg			=	container.find('.chat_input').val();	
		writeMessage(msg, room);

		$('.chat_input').val('');
	});

	$(document).on('click', '.close_msg_window', function()
	{
		var chat_window	=	$(this).closest('.chat_window');	
		var roomid		=	chat_window.attr('data-roomid');
		
		active_rooms[roomid].windowobj.remove();
		delete active_rooms[roomid];

		cSocket.emit('conversation_leave', { room: roomid, user: activeUser });

		console.log('room len: ' + Object.keys(active_rooms).length + ' len: ' + $('.chat_window').length);

		if(Object.keys(active_rooms).length == 0 || $('.chat_window').length <= 1)
		{
			$('#messages_container').hide();
			$('.chat_jumbo').show();
		}
	});

	$(document).on('click', '.chat_window', function()
	{
		$('.chat_window').css('z-index', 50);
		$(this).css('z-index', 100);
	});

	function writeMessage(message, room)
	{
		if(active_rooms.hasOwnProperty(room))
		{
			var pkey	=	active_rooms[room].pkey;
			var iv		=	active_rooms[room].iv = SafeExchange.generateIV(active_rooms[room].iv);
			var msgData	=	SafeExchange.signMessage(message, pkey, iv);
			console.log('## WRITE MESSAGE FOR ROOM: ' + room);
			console.log('-- PRIVATE KEY: ' + pkey);
			console.log('-- INITIAL VECTOR: ' + iv);
			console.log('-- SIGNED MESSAGE: ' + msgData);
			
			addMessage(activeUser, message, room);
			cSocket.emit('private_room_msg', { room: room, messageData: msgData, sender: activeUser });
		}
	}

	function readMessage(data)
	{
		var room		=	data.room;
		var messageData =	data.messageData;
		var encMessage	=	messageData.msg;
		var encHash		=	messageData.hash;
		$.each(active_rooms, function(key, val)
		{
			$.each(val, function(key2, val2)
			{
				console.log(key2 + ': ' + val2);
			});
		});
		var iv			=	active_rooms[room].iv = SafeExchange.generateIV(active_rooms[room].iv);
		var pkey		=	active_rooms[room].pkey;

		console.log('## READ MESSAGE FOR ROOM: ' + room);
		console.log('-- ENCRYPTED MSG: ' + encMessage);
		console.log('-- ENCRYPTED HASH: ' + encHash);
		console.log('-- INITIAL VECTOR: ' + iv);
		console.log('-- PRIVATE KEY: ' + pkey);

		var decMessage = SafeExchange.releaseMessage(encMessage, encHash, pkey, iv);
		console.log('-- DECRYPTED MESSAGE: ' + decMessage);
		return decMessage;
	}

	function createChatWindow(chat_with, room)
	{
		$('.chat_jumbo').hide();
		$('#messages_container').show();
		var template = chat_window_template.clone();
		active_rooms[room].windowobj = template;
		template.find('.conversation_with_label').text(active_rooms[room].person.dn);
		template.attr('data-roomid', room);
		template.find('.message_output').empty();
		template.find('.msg_send_btn').removeAttr('disabled');
		template.draggable();
		$('#messages_container').append(template);

		if($('.chat_window').length > 2)
			template.css({'position': 'absolute', 'top': 0, 'left': 0, 'right': 0});

		template.fadeIn('fast');
	}

	function connectClient()
	{
		activeUser		=	$('#user_id_label').text();
		cSocket			=	io.connect(node_server);

		cSocket.emit('client_join', {user: activeUser});
	}

	function respondFriendRequest(accept)
	{
		var modal		=	$('#notification_read_modal');
		var url			=	$('#notification_controls').attr('data-respond-url');
		var friendID	=	$('#notification_modal_content').attr('data-friendshipid');
		var notifyID	=	modal.find('.modal-content').attr('data-notificationid');
		var data		=	'friendship_id=' + friendID + '&accept_req=' + accept + '&notifyid=' + notifyID;
		var laddaButton	=	(accept)? '#accept_request_btn' : '#reject_request_btn';
		var ladda		=	Ladda.create(document.querySelector(laddaButton));

		ladda.start();
		console.log(data);
		$.ajax
		({		
			url: url,
			data: data,
			method: 'POST',
			dataType: 'json',
			success: function(response)
			{
				console.log(response);
				setTimeout(function()
				{
					ladda.stop();
					showReturnMessage($('#friend_req_respond_alert'), response.status, 
					response.message, $('#friend_req_respond_message'));

					if(response.status)
					{
						if(accept)
						{
							var friendship		=	response.friendship;
							var friendUser		=	friendship.from_user;
							var clientUser		=	friendship.to_user;
							var data_message	=	clientUser + ' has accepted your friend request';
							var data_title		=	'Friend request response';

							cSocket.emit('notification_push', 
							{user: friendUser, notify_title: data_title, notify_content: data_message, notify_type: 1});
						}

						setTimeout(function()
						{
							modal.modal('hide');
							loadNotificationList();
						}, 1500);
					}

				}, 1500);
			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		});
	}

	function loadNotificationList()
	{
		var fetchNotificationsURL	=	$('#notifications_tab_header').find('a').attr('href');
		showTab('#transition_view');
		$.getJSON(fetchNotificationsURL, function(response)
		{
			showTab('#notifications_tab');
			console.log(response);

			if(response.length == 0)
			{
				$('#notification_list_container').hide();
				$('#no_notifications_content').show();
			}

			else
			{
				$('#no_notifications_content').hide();

				var container = $('#notification_list_container');
				container.empty();
				$.each(response, function(key, val)
				{
					var item	=	notification_template_item.clone();
					if(val.type	==	'1')
						item.find('.notification_icon').addClass('glyphicon glyphicon-user');

					item.find('.notification_title').text(val.title);
					item.find('.notification_content').text(val.content);
					item.attr('data-notificationid', val.id);
					container.append(item);
				});
				
				initTooltips();
			}
			
		})
		.fail(function(xhr, response, error)
		{
			console.log(xhr.responseText);
		});
	}
	
	function loadFriendlist()
	{
		var fetchFriendsURL	=	$('#friends_tab_header').find('a').attr('href');
		
		$.getJSON(fetchFriendsURL, function(response)
		{
			if(response.length == 0)
				showNoFriendsContainer();
			
			else
			{
				hideResultContainers();

				var onlineCount = 0;
				$('#people_list_group').empty();
				$.each(response, function(key, val)
				{
					var item = person_template_item.clone();
					item.find('.person_image').attr('src', val.profile_image);
					item.find('.person_dn').text(val.name);
					item.find('.person_username').text(val.username);
					item.attr('data-friendid', val.id);
					
					if(val.online == 1)
					{
						onlineCount++;
						item.find('.list_image').find('img').addClass('person_online');
					}

					else 
						item.find('.list_image').find('img').addClass('person_offline');

					
					$('.friend_online_count').text(onlineCount);
					item.find('.add_person_btn').hide();
					$('#people_list_group').append(item);
				});
				
				$('#people_list').fadeIn('fast');
				initTooltips();
			}
		})
		.fail(function(xhr, response, error)
		{
			console.log(xhr.responseText);
		});
	}
		
	function showTab(tab)
	{	
		$('.tab_content').hide();
		$(tab).fadeIn('fast');
	}

	function showNoFriendsContainer()
	{
		$('#people_list').hide();
		$('#no_friends_content').show();
		$('#people_search').focus();
	}

	function hideResultContainers()
	{
		$('#no_friends_content').hide();
		$('#no_results_container').hide();
	}

	function showNoResultsContainer()
	{
		$('#people_list').hide();
		$('#no_results_container').show();
		$('#people_search').focus();
	}

	function showNotificationPop(title, content)
	{
		var showTime		=	2000;
		var notification	=	$('#notification_pop');
		$('.not_pop_title').text(title);
		$('.not_pop_content').text(content);
		notification.fadeIn('slow');

		setTimeout(function()
		{
			notification.fadeOut('slow');
		}, showTime);
	}

	function initTabContent()
	{
		$('#settings_tab').hide();
		$('#settings_change_alert').hide();
		$('#no_notifications_content').hide();
		$('#no_friends_content').hide();
		$('#notification_status_alert').hide();
		$('#person_status_alert').hide();
		$('#no_results_container').hide();
		$('#people_search').val('');
		$('#friend_req_respond_alert').hide();
	}

	function initChatContent()
	{
		$('#notification_pop').hide();
		$('#messages_container').hide();
	}

	function initTemplates()
	{
		$('.wind_msg_alert').hide();
		person_template_item		=	$('#person_item_template').clone();
		notification_template_item	=	$('#notification_item_template').clone();
		chat_window_template		=	$('#chat_private_template').clone();
		chat_message_template		=	$('.message_item_template').first().clone();

		$('#person_item_template').hide();
		$('#notification_item_template').hide();
		$('#chat_private_template').hide();
		$('.message_item_template').hide();
	}

});
