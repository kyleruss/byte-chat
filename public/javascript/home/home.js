$(function()
{
	var active_panel;
	var panel_transition_speed = 500;
	var	register_dim	=	[ '640px', '600px' ];
	var	login_dim		=	[ '440px', '400px' ];
	var sections		=	[ $('#title_content'), $('#chat_features'), $('#security_features'), $('footer')];
	var section_i		=	0;
	var scroll_val		=	0;
	initPanels();
	initRegisterTooltips();
	$('#alert_register_fail').hide();
	$('#register_status_alert').hide();
	$('#login_status_alert').hide();

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

		$('#register_confirm').attr('disabled', false);
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

	$('#login_form').submit(function(e)
	{
		e.preventDefault();
		
		var ladda  = Ladda.create(document.querySelector('#login_button'));
		ladda.start();

		var form	=	this;
		var url		=	form.attr('action');
		var data	=	form.serialize();

		$.ajax
		({
			url: url,
			method: 'POST',
			data: data,
			dataType: 'json',
			success: function(message)
			{
				setTimeout(function()
				{
					ladda.stop();
					if(!message.status)
					{
						$('#login_notice_message').text(message.message);
						$('#user_panel').animate
						({
							height: parseInt(login_dim[1]) + 100
						}, 300, function()
						{
							$('#login_status_alert').removeClass('hide');
							$('#login_status_alert').fadeIn('fast');
						});
					}
				}, 1500);
			},

			error: function(xhr, statusText, error)
			{
				console.log(xhr.responseText);
			}
		});
	});


	$('#login_button').click(function(e)
	{
		e.preventDefault();
		$('#login_form').submit();
	}); 

	$('.register_form').submit(function(e)
	{
		e.preventDefault();
		var ladda = Ladda.create(document.querySelector('#register_confirm'));
		ladda.start();


		var form	=	this;
		var url		=	form.attr('action');
		var data	=	form.serialize();

		$.ajax
		({
			url: url,
			method: 'POST',
			data: data,
			dataType: 'json',
			success: function(response)
			{

				setTimeout(function()
				{
					ladda.stop();
				
					//registration failed
					if(response.status == false)
					{
						$('#user_panel').animate
						({
							height: (parseInt(register_dim[1]) + 80)
						}, 300, function()
						{
							$('#register_fail_message').text(response.message);
							$('#alert_register_fail').fadeIn('fast');


							//response found invalid fields
							if(response.hasOwnProperty('input'))
							{
								var inputs = response.input;
								
								//highlight invalid fields for correction
								$('#register_panel input').each(function()
								{
									var input_name = $(this).attr('name');
									//display red border on invalid field
									if(inputs.hasOwnProperty(input_name))
										this.style.setProperty('border', '1px solid #e51c23', 'important');
									
									//display default border on valid field
									else
										this.style.setProperty('border', '1px solid #ccc', 'important');
								});
							}

							//hide alert and bring panel back to normal height
							setTimeout(function()
							{
								$('#alert_register_fail').fadeOut('fast', function()
								{
									$('#user_panel').animate
									({
										height: register_dim[1]
									}, 300);
								});
							}, 2000);
						});
					}

					//registration successful
					else
					{	
						$('#register_status_alert').removeClass('hide');
						$('#register_status_alert').show();
						$('#show_login_tab').click();
						clearRegisterForm();
					}
				}, 1500);
			},

			error: function(xhr, statusText, error)
			{
				console.log(xhr.responseText);
			}
		}); 
	});

	$('#register_confirm').click(function(e)
	{
		e.preventDefault();
		$('.register_form').submit();
	});


	$('#pass_field').focusout(function()
	{
		checkPasswordStrength();
	});


	$('#pass_match_field').focusout(function()
	{
		checkPasswordMatches();
	});

	$('#register_cancel').click(function(e)
	{
		e.preventDefault();
		$('#show_login_tab').click();
	});

	$('#close_register_alert, #login_status_alert').click(function()
	{
		var alert_obj	=	$(this);
		$('#user_panel').animate({'height': login_dim[1]}, 500, function()
		{
			alert_obj.addClass('hide');
		});
	});


	$(window).bind('mousewheel DOMMouseScroll', function(e)
	{
		e.preventDefault();

		if($(window).scrollTop() < sections[section_i].offset().top || $(window).scrollTop() > sections[section_i].offset().top)
		{
			var i;
			for(i = 0; i < sections.length; i++)
			{
				if(sections[i].offset().top >= $(window).scrollTop())
					break;
			}

			section_i = i;
		}

		if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0)
		{
			if(section_i <= 0) return;
			else section_i--;
		}

		else
		{
			if(section_i >= sections.length - 1) return;
			else section_i++;
		}

		var scrollTo = sections[section_i];
		$('html, body').animate
		({
			scrollTop: (section_i == 0)? 0: scrollTo.offset().top
		}, 500);
	});

	function clearRegisterForm()
	{
		$('.register_form input').val('');
	}

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

		if(pass.length > 5 && pass.length < 16)
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


		if(passFirst == passSec && passFirst.length > 5)
		{
			str_indicator.text('Valid');
			str_indicator.css({'background-color': '#4caf50', 'color': 'white', 'font-weight': 'bold'});
		}
			
		else
		{
			str_indicator.text('Invalid');
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
				var h;
				if(!$('#register_status_alert').hasClass('hide'))
					h = parseInt(login_dim[1]) + 100;
				

				else h = login_dim[1];

				$('#user_panel').animate
				({
					height:		h
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
