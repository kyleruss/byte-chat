<!DOCTYPE html>

<html lang='en-us'>
	<head>
		@section('head')
		<meta charset='utf-8' />

		{{ HTML::style('css/bootstrap_simple_theme.css'); }}
		{{ HTML::style('css/plugins/ladda-themeless.min.css'); }}
		{{ HTML::style('css/main.css'); }}
		@show		

		@section('js')
		<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
		<script src="https://cdn.socket.io/socket.io-1.3.4.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
		{{ HTML::script('javascript/plugins/spin.min.js'); }}
		{{ HTML::script('javascript/plugins/ladda.min.js'); }}
		{{ HTML::script('javascript/main.js'); }}
		@show

	</head>

	<body>
		@yield('content')
	</body>
</html>
