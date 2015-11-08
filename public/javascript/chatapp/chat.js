$(function()
{
	var person_template_item;
	initTemplates();

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
				$('#people_list_group').empty();
				$.each(response, function(key, val)
				{
					var item = person_template_item.clone();
					item.find('.person_image').attr('src', server_a + val.profile_image);
					item.find('.person_dn').text(val.name);
					item.find('.person_username').text(val.username);
					$('#people_list_group').append(item);
				});
			},

			error: function(xhr, response, error)
			{
				console.log(xhr.responseText);
			}

		});
	});

	function initTemplates()
	{
		person_template_item	=	$('#person_item_template').clone();

		$('#person_item_template').hide();
	}
});
