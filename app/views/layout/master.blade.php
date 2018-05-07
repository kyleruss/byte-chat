<!DOCTYPE html>
<html lang='en-us'>
	<head>
		@section('head')
		<meta charset='utf-8' />

		{{ HTML::style('css/bootstrap_simple_theme.css'); }}
		{{ HTML::style('css/plugins/ladda-themeless.min.css'); }}
		{{ HTML::style('css/main.css'); }}
	<!--	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">-->
			{{ HTML::style('css/plugins/ladda-themeless.min.css'); }}
			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
		@show		

		@section('js')
		<!--<script src="//code.jquery.com/jquery-1.11.2.min.js"></script> -->
		{{ HTML::script('javascript/plugins/jquery.min.js'); }}
		<!--<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>-->
		{{ HTML::script('javascript/plugins/jquery-migrate.min.js'); }}
		<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js"></script>
		<!--	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>-->
		{{ HTML::script('javascript/plugins/bootstrap.min.js'); }}
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
			<div id='main_nav' class='navbar navbar-default navbar-fixed-top'>
				<div class='container'>
					<div class='navbar-header'>
						<a class='navbar-brand app_brand'>{{ HTML::image('resources/images/BytechatLogo.png'); }}</a>
					</div>

					<div class='navbar-collapse collapse'>
						<ul class='nav navbar-nav navbar-right'>
							<li><a id='home_btn' href='{{ URL::route("getHome"); }}'><button class='btn btn-danger'><span class='glyphicon glyphicon-home'></span> Home</button></a></li>
							<li><a data-toggle='tooltip' data-placement='bottom' data-trigger='manual' data-title='Please login to chat' id='chat_home_btn' href='{{ URL::route("getChatHome"); }}'><button class='btn btn-default'><span class='glyphicon glyphicon-comment'></span> Chat</button></a></li>
							<li><a id='nav_login' href='{{ URL::route("getHome"); }}'><button class='btn btn-default'><span class='glyphicon glyphicon-lock'></span> Login</button></a></li>
							<li><a id='nav_register' href='{{ URL::route("getHome"); }}'><button class='btn btn-default'><span class='glyphicon glyphicon-plus'></span> Register</button></a></li>
							@if(Auth::check())
							<li><a data-user='{{ Auth::user()->username; }}' data-name='{{ Auth::user()->name; }}' data-getfriends='{{ URL::route("getOnlineFriends"); }}' id='nav_logout' href='{{ URL::route("getLogout"); }}'><button class='btn btn-default'><span class='glyphicon glyphicon-off'></span> Logout</button></a></li>
							@endif
						</ul>
					</div>
				</div>
			</div>
		</header>
		@yield('content')

	<div id='logout_processing_modal' class='modal fade' data-keyboard='false' data-backdrop='static'>
		<div class='modal-dialog'>
			<div class='modal-content'>

				<div class='modal-body'>
					<center>
						<h4>Logging out..</h4>
					</div>
					<div class="progress">
						<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	</body>
</html>
