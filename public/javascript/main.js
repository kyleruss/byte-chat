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
});
