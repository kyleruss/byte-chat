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

<!-- USER LEFT SIDE BAR -->
<div id='user_content' class='col-md-4'>
	<div class='profile_info'>
		<div class='col-md-5'>
			{{ HTML::image(Auth::user()->profile_image, $alt='Profile image', ['class' => 'user_profile_image']); }}
		</div>
	
		<div class='col-md-7 user_info'>
			<h4><span class='glyphicon glyphicon-user'></span> {{ Auth::user()->username; }}</h4>
			<h4><span class='glyphicon glyphicon-star'></span> {{ Auth::user()->name; }}</h4>
			<h4><span class='glyphicon glyphicon-heart'></span> 0 friends online</h4>
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
			<div class='input-group full_input_group full_right_input_group'>
				<input type='text' class='full_input tab_search_input' placeholder='Find someone' name='friend_search' />
				<span class='input-group-btn'>
					<button class='btn btn-default'><span class='glyphicon glyphicon-search'></span></button>
				</span>
			</div>

			<div id='people_list'>
				<ul class='list-group'>
					<li class='person_list_item list-group-item clearfix'>
					
						<div class='col-md-6'>
							<div class='col-md-3'>
							<span class='list_image'>{{ HTML::image(Auth::user()->profile_image); }}</span>
							</div>
							<div class='col-md-9 person_info'>
								<h6 class='person_dn'>Display name</h6>
								<h6 class='person_username'>Username</h6>
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
