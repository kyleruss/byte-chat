$(function()
{
	var active_panel;
	var panel_transition_speed = 500;
	var	register_dim	=	[ '640px', '600px' ];
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


	$('#pass_field').focusout(function()
	{
		checkPasswordStrength();
	});


	$('#pass_match_field').focusout(function()
	{
		checkPasswordMatches();
	});


	//min: 3 max: 16
	//weak: just alpha characters
	//moderate: alphanumeric characters
	//strong: capital alphanumeric characters

	function checkPasswordStrength()
	{
		var input			=	$('#pass_field');
		var str_indicator	=	$('#pass_str_ind');
		var	pass			=	input.val();


		var hasUppercase	=	pass.match(/[A-Z]/);
		var hasNumeric		=	pass.match(/[0-9]/);
		var hasAlpha		=	pass.match(/[a-z]/);

		if(pass.length > 3 && pass.length < 16)
		{
			if(hasAlpha && hasNumeric && hasUppercase) //strong
			{
				str_indicator.text('Strong');
				str_indicator.css({'background-color': '#4caf50', 'color': 'white', 'font-weight': 'bold'});
			}

			else if((hasAlpha || hasUppercase) && hasNumeric) //moderate
			{
				str_indicator.text('Moderate');
				str_indicator.css({'background-color': '#2196f3', 'color': 'white', 'font-weight': 'bold'});
			}

			else if((hasAlpha || hasUppercase) && !hasNumeric) //weak
			{
				str_indicator.text('Weak');
				str_indicator.css({'background-color': '#ff9800', 'color': 'white', 'font-weight': 'bold'});
			}
		}

		else
		{
			str_indicator.text('Invalid');
			str_indicator.css({'background-color': '#e51c23', 'color': 'white', 'font-weight': 'bold'});
		}
	}

	function checkPasswordMatches()
	{
		var inputFirst		=	$('#pass_field');
		var inputSec		=	$('#pass_match_field');
		var str_indicator	=	$('#pass_match_ind');
		var passFirst		=	inputFirst.val();
		var passSec			=	inputSec.val();


		if(passFirst == passSec)
		{
			str_indicator.text('Yes');
			str_indicator.css({'background-color': '#4caf50', 'color': 'white', 'font-weight': 'bold'});
		}
			
		else
		{
			str_indicator.text('No');
			str_indicator.css({'background-color': '#e51c23', 'color': 'white', 'font-weight': 'bold'});
		}
	}


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
					$('input[name="register_user"]').focus();
				});
			});
		}

		else
		{
			$('#user_panel').css({'width': register_dim[0], 'height': register_dim[1]});
			$('#register_panel').show();
			$('#user_panel').fadeIn('fast');
			$('input[name="register_user"]').focus();
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
