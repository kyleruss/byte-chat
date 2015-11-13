<!DOCTYPE html>

<html lang='en-us'>
	<head>
		@section('head')
		<meta charset='utf-8' />

		{{ HTML::style('css/bootstrap_simple_theme.css'); }}
		{{ HTML::style('css/plugins/ladda-themeless.min.css'); }}
		{{ HTML::style('css/main.css'); }}
		<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
		@show		

		@section('js')
		<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
		<script src="https://cdn.socket.io/socket.io-1.3.4.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
		{{ HTML::script('javascript/plugins/jquery-ui.min.js'); }}
		{{ HTML::script('javascript/plugins/spin.min.js'); }}
		{{ HTML::script('javascript/plugins/ladda.min.js'); }}
		{{ HTML::script('javascript/AES-js/Structure.js'); }}
		{{ HTML::script('javascript/AES-js/Engine.js'); }}
		{{ HTML::script('javascript/AES-js/KeySchedule.js'); }}
		{{ HTML::script('javascript/AES-js/AES.js'); }}
		{{ HTML::script('javascript/AES-js/SafeExchange/dependencies/BigInt.js'); }}
		{{ HTML::script('javascript/AES-js/SafeExchange/dependencies/yamd5.min.js'); }}
		{{ HTML::script('javascript/AES-js/SafeExchange/SafeExchange.js'); }}
		{{ HTML::script('javascript/main.js'); }}
		@show
  
	</head>

	<body>
		<header>
			<div class='navbar navbar-default navbar-fixed-top'>
				<div class='container'>
					<div class='navbar-header'>
						<a class='navbar-brand app_brand'>{{ HTML::image('resources/images/BytechatLogo.png'); }}</a>
					</div>

					<div class='navbar-collapse collapse'>
						<ul class='nav navbar-nav navbar-right'>
							<li><a id='home_btn' href='{{ URL::route("getHome"); }}'><button class='btn btn-danger'>Home</button></a></li>
							<li><a id='chat_home_btn' href='{{ URL::route("getChatHome"); }}'><button class='btn btn-default'>Chat</button></a></li>
							<li><a id='nav_login' href='{{ URL::route("getHome"); }}'><button class='btn btn-default'>Login</button></a></li>
							<li><a id='nav_register' href='{{ URL::route("getHome"); }}'><button class='btn btn-default'>Register</button></a></li>
							<li><a href='{{ URL::route("getHome"); }}'><button class='btn btn-default'>About</button></a></li>
							@if(Auth::check())
							<li><a id='nav_logout' href='{{ URL::route("getLogout"); }}'><button class='btn btn-default'>Logout</button></a></li>
							@endif
						</ul>
					</div>
				</div>
			</div>
		</header>
		@yield('content')
	</body>
</html>
