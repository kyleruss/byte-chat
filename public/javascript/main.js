//Shows a return message in an alert dialog
//container*: pass the .alert container to hold message
//stats: pass true/false or equiv int values for success/fail
//message: the message to be shown in the container
function showReturnMessage(container, status, message, message_container)
{
	var success_class	=	'alert-success';
	var fail_class		=	'alert-danger';
	var fade_time		=	3000;

	$(container).removeClass(fail_class);
	$(container).removeClass(success_class);

	if(status == 0 || status == false) $(container).addClass(fail_class);
	else $(container).addClass(success_class);

	if(typeof message_container == 'undefined')
		message_container = container;

	$(message_container).text(message);
	$(container).hide();
	$(container).removeClass('hide');
	$(container).fadeIn('fast');

	setTimeout(function()
	{
		$(container).fadeOut('fast');
	}, fade_time);
}


function initTooltips()
{
	$('[data-toggle="tooltip"]').tooltip({ container: 'body' });
}

function logoutUser()
{
		var btn			=	$('#nav_logout');
		var url			=	btn.attr('data-getfriends');
		var destUrl		=	btn.attr('href');
		var username	=	btn.attr('data-user');
		var name		=	btn.attr('data-name');
		$('#logout_processing_modal').modal('show');
			
		$.getJSON(url, function(response)
		{
			var sockExit = io.connect(node_server);	
			sockExit.emit('user_log', { name: name, username: username, login: false, friends: response });

			sockExit.on('user_log_finished', function(sockResponse)
			{
				$('#logout_processing_modal').modal('hide');
				document.location.href = destUrl;
			});
		});
}


var node_server = 'http://122.57.169.242:8100';

$(function()
{
	$('.nav-tabs li a').click(function(e)
	{
		e.preventDefault();
		var parentTabs = $(this).closest('.nav-tabs');
		parentTabs.find('li').removeClass('active');
		parentTabs.find('.active_header').removeClass('active_header');
		$(this).parent().addClass('active');
		$(this).addClass('active_header');
	});

	$('#chat_home_btn, .browse_bt').click(function(e)
	{
		e.preventDefault();
		var btn = $(this);

		if($('#nav_logout').length == 0)
		{
			btn.tooltip('show');
			setTimeout(function()
			{
				btn.tooltip('hide');
			}, 1500);
		}
		
		else
		{
			var href = btn.attr('href');
			document.location.href = href;
		}
	});

	$('#nav_logout').click(function(e)
	{
		logoutUser();
	});
});
