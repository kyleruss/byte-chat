$(function()
{
	var person_template_item;
	initTemplates();
	initTabContent();
//	$('#change_bg_label').hide();

	$('#people_search_btn').click(function(e)
	{
		e.preventDefault();
		var form	=	$('#people_search_form');
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
				console.log(response);
				setTimeout(function()
				{
					$('#people_list_group').empty();
					$.each(response, function(key, val)
					{
						var item = person_template_item.clone();
						item.find('.person_image').attr('src', server_a + val.profile_image);
						item.find('.person_dn').text(val.name);
						item.find('.person_username').text(val.username);
						$('#people_list_group').append(item);
					});
				}, 500);
			
			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}

		});
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
		showTab('#friends_tab');
	});

	$('#settings_tab_header').click(function()
	{
		showTab('#settings_tab');
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
				}, 500);

				if(response.status)
				{
					$('.user_profile_image').attr('src', dp);
					$('#user_name_label').text(dn);
				}

				$('#settings_change_message').text(response.message);
				$('#settings_change_alert').fadeIn('fast');
				setTimeout(function()
				{
					$('#settings_change_alert').fadeOut('fast');
				}, 1500);
			},
			
			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}
		});
	});
		
	function showTab(tab)
	{	
		$('.tab_content').hide();
		$(tab).fadeIn('fast');
	}

	function intTabContent()
	{
		$('#settings_tab').hide();
	}

	function initTemplates()
	{
		person_template_item	=	$('#person_item_template').clone();

		$('#person_item_template').hide();
	}
});
