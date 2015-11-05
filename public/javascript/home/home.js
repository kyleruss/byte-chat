$(function()
{
	var active_panel;
	var panel_transition_speed = 500;
	var	register_dim	=	[ '640px', '550px' ];
	var	login_dim		=	[ '440px', '400px' ];
	initPanels();
	initRegisterTooltips();

	$('#show_register_tab').click(function(e)
	{
		e.preventDefault();
		console.log('test');
		if(active_panel == '#register_panel')
			return;
		else
		{
			toggleTransitionPanel();
			active_panel = '#register_panel';
		}

		showRegisterPanel();
	});


	$('#show_login_tab').click(function(e)
	{
		e.preventDefault();

		if(active_panel == '#login_panel')
			return;
		else
		{
			toggleTransitionPanel();
			active_panel = '#login_panel';			
		}

		showLoginPanel();
	});

	$('#nav_register').click(function(e)
	{
		e.preventDefault();

		if(!$('#user_panel').is(':visible'))
		{
			$('#login_panel').hide();
			$('#transition_panel').hide();
		}

		$('#show_register_tab').click();
	});

	$('#nav_login').click(function(e)
	{
		e.preventDefault();

		if(!$('#user_panel').is(':visible'))
		{
			$('#register_panel').hide();
			$('#transition_panel').hide();
		}

		$('#show_login_tab').click();
	});	

	$('#close_userpanel').click(function()
	{
		$('#user_panel').fadeOut('fast');
		active_panel = "";
	});


	$('#login_button').click(function()
	{
		var ladd  = Ladda.create(this);
		ladd.start();
	});


	function showRegisterPanel()
	{
		if($('#user_panel').is(':visible'))
		{
			$('#user_panel').animate
			({
				width: register_dim[0],
				

			}, panel_transition_speed, function()
			{
				
				$('#user_panel').animate
				({
					height: 	register_dim[1]
				}, panel_transition_speed, function()
				{
					$('#transition_panel').hide();
					$('#register_panel').fadeIn('fast');
				});
			});
		}

		else
		{
			$('#user_panel').css({'width': register_dim[0], 'height': register_dim[1]});
			$('#register_panel').show();
			$('#user_panel').fadeIn('fast');
		}
	}

	function showLoginPanel()
	{
		if($('#user_panel').is(':visible'))
		{
			$('#user_panel').animate
			({
				width: login_dim[0],
			

			}, panel_transition_speed, function()
			{
				
				$('#user_panel').animate
				({
					height:		login_dim[1]
				}, function()
				{
					$('#transition_panel').hide();
					$('#login_panel').fadeIn('fast');
					
				});
			});
		}

		else
		{
			$('#user_panel').css({'width': login_dim[0], 'height': login_dim[1]});
			$('#login_panel').show();
			$('#user_panel').fadeIn('fast');
		}
	}

	function toggleTransitionPanel()
	{
		if(active_panel == null)
			return;
		
		else
		{
			var trans_panel = '#transition_panel';

			$(active_panel).toggle('fast', function()
			{
				console.log('test');
				$('#transition_panel').toggle();
			});
		}
	}

	function initRegisterTooltips()
	{
		$('[data-toggle="tooltip"]').tooltip();
	}

	function initPanels()
	{
		active_panel	=	'#login_panel';
		$('#login_panel').show();
		$('#register_panel').hide();
		$('#transition_panel').hide();
	}	
});
