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
		<li class='active'><a class='chat_nav_a green_tab' href='#'><h4>Channels</h4></a></li>
		<li class='active'><a class='chat_nav_a red_tab' href='#'><h4>Messages</h4></a></li>
		<li class='active'><a class='chat_nav_a yellow_tab' href='#'><h4>Settings</h4></a></li>
	</ul>
	</div>
</div>

<!-- CHAT CONTENT -->
<div id='chat_content' class='col-md-8'>
	
</div>

@stop
