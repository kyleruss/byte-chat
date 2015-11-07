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

</div>

<!-- CHAT CONTENT -->
<div id='chat_content' class='col-md-8'>
	
</div>

@stop
