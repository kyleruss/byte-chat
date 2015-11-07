@extends('layout.master')

@section('head')
	@parent
	<title>ByteChat - Error</title>
@stop

@section('content')
<div class='container'>
	<div id='error_jumbo' class='jumbotron'>
		<h1><span class='glyphicon glyphicon-cog'></span> Woops!</h1>
		<h4>Looks like something went wrong..</h4>
		<h4><strong>Error: page not found</strong></h4>
		<br>
		<a href='{{ URL::route("getHome"); }}'><button class='btn btn-primary btn-lg'>Take me back</button></a>
	</div>
</div>

@stop
