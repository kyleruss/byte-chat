@extends('layout.master')

@section('head')
	@parent
	<title>ByteChat - Home</title>
	{{ HTML::style('css/chatapp/chat.css'); }}
@stop

@section('js')
	@parent
	{{ HTML::script('javascript/chatapp/chat.js'); }}
@stop

@section('content')

<script>
	var server_a	=	'{{ url("/"); }}/';
</script>

<!-- USER LEFT SIDE BAR -->
<div id='user_content' class='col-md-4'>
	<div class='profile_info'>
		<div id='profile_image_container' class='col-md-5'>
			{{ HTML::image(Auth::user()->profile_image, $alt='Profile image', ['class' => 'user_profile_image']); }}
			<span id='change_bg_label' class='hide'>Change</span>
		</div>
	
		<div class='col-md-7 user_info'>
			<h4><span class='glyphicon glyphicon-user'></span> {{ Auth::user()->username; }}</h4>
			<h4><span class='glyphicon glyphicon-star'></span> {{ Auth::user()->name; }}</h4>
			<h4><span class='glyphicon glyphicon-heart'></span> 0 friends online</h4>
		</div>
	</div>

	<!-- CHANGE DISPLAY IMAGE MODAL -->
	<div id='dp_change_modal' class='modal fade'>
		<div class='modal-dialog'>
			<div class='modal-content'>
				<div class='modal-header'>
					<button class='close' data-dismiss='modal'><span>&times;</span></button>
					<h4 class='modal-title'>Change display image</h4>
				</div>
				
				<div class='modal-body'>

					<div id='change_dp_alert' class='alert alert-danger alert-dismissable fade in'>
						<button class='close' data-dismiss='alert'>x</button>
						<strong>Change display image notice</strong>
						<br>
						<p id='change_dp_alert_message'>test</p>
					</div>

					<div class='row'>
					<!-- CURRENT DISPLAY IMAGE -->
					<div class='col-md-6'>
					<div class='thumbnail'>
						{{ HTML::image(Auth::user()->profile_image, $alt='Profile image', ['width' => 128, 'height' => 128]); }}
						<div class='caption'>
							<h3>Current image</h3>
						</div>
					</div>
					</div>

					<!-- NEW DISPLAY IMAGE -->
					<div class='col-md-6'>
					<div class='thumbnail'>
						{{ HTML::image(Auth::user()->profile_image, $alt='Profile image', ['class' => 'new_dp_image', 'width' => 128, 'height' => 128]); }}
						<div class='caption'>
							<h3>New image</h3>
						</div>
					</div>
					</div>
					</div>

					<form id='save_dp_form' method='post' action='{{ URL::route("postChangeDP"); }}'>
						<div class='input-group full_input_group full_right_input_group'>		
							<input id='dp_path_input' type='text' class='full_input full_input_width' placeholder='Enter URL of new display image' name='new_dp_path' />
							<span class='input-group-btn'>
								<button id='load_new_dp_btn' class='btn btn-default'>Load</button>
							</span>
						</div>
					</form>
					<br>
					<center>
						<button data-dismiss='modal' class='btn btn-default'>Cancel</button>
						<button id='save_dp_change' class='btn btn-default btn-primary'>Save</button>
					</center>
				</div>
			</div>
		</div>
	</div>

	<div id='user_nav_container'>
		<ul id='user_nav' class='nav nav-tabs'>
			<li class='active'><a class='chat_nav_a blue_tab' href='#'><h4>Friends</h4></a></li>
			<li class=''><a class='chat_nav_a green_tab' href='#'><h4>Channels</h4></a></li>
			<li class=''><a class='chat_nav_a red_tab' href='#'><h4>Messages</h4></a></li>
			<li class=''><a class='chat_nav_a yellow_tab' href='#'><h4>Settings</h4></a></li>
		</ul>
	
		<div id='friends_tab' class='tab_content'>
			<form id='people_search_form' method='post' action='{{ URL::route("postFindPeople"); }}'>
				<div class='input-group full_input_group full_right_input_group'>
					
						<input type='text' class='full_input tab_search_input' placeholder='Find someone' name='search_term' />
						<span class='input-group-btn'>
							<button id='people_search_btn' class='btn btn-default'><span class='glyphicon glyphicon-search'></span></button>
						</span>
				</div>
			</form>

			<div id='people_list'>
				<ul id='people_list_group' class='list-group'>
					<li id='person_item_template' class='person_list_item list-group-item clearfix'>
						<div class='col-md-6'>
							<div class='col-md-3'>
							<span class='list_image'><img class='person_image' src='' /></span>
							</div>
							<div class='col-md-9 person_info'>
								<h6 class='person_dn'></h6>
								<h6 class='person_username'></h6>
							</div>
						</div>

						<div class='col-md-6'>
							<div class='person_controls'>
								<span id='add_person' class='glyphicon glyphicon-plus'></span>
								<span id='remove_person' class='glyphicon glyphicon-remove'></span> 
								<span id='message_person' class='glyphicon glyphicon-comment'></span>
							</div>
						</div>
					</li>
				
				</ul>
			</div>
		</div>
	
	</div>
</div>

<!-- CHAT CONTENT -->
<div id='chat_content' class='col-md-8'>

</div>

@stop
