@extends('layout.master')

@section('head')
	@parent
	{{ HTML::style('css/home/home.css'); }}
@stop

@section('js')
	@parent
	{{ HTML::script('javascript/home/home.js'); }}
@stop

@section('content')

<!-- HEAD NAV -->
<header>
<div class='navbar navbar-default navbar-fixed-top'>
	<div class='container'>
		<div class='navbar-header'>
			<a class='navbar-brand app_brand'>{{ HTML::image('resources/images/BytechatLogo.png'); }}</a>
		</div>

		<div class='navbar-collapse collapse'>
			<ul class='nav navbar-nav navbar-right'>
				<li><a href='#'><button class='btn btn-danger'>Home</button></a></li>
				<li><a href='#'><button class='btn btn-default'>Browse</button></a></li>
				<li><a id='nav_login' href='#'><button class='btn btn-default'>Login</button></a></li>
				<li><a id='nav_register' href='#'><button class='btn btn-default'>Register</button></a></li>
				<li><a href='#'><button class='btn btn-default'>About</button></a></li>
			</ul>
		</div>
	</div>
</div>
</header>

	<div id='title_content'>
		<div class='container'>
			<div class='row'>
				<div id='app_details' class='col-md-5'>
					<h1>ByteChat</h1>
					<p class='lead'>An encrypted, interactive chat experience</p>
					<p class='lead'>Enjoy private and public messaging</p>
					<button class='btn btn-default hollow_white get_started_bt'>Get started</button>
					<button class='btn btn-default browse_bt'>Browse</button>
				</div>

				<!-- USER PANEL -->
				<div class='col-md-7'>
					<div id='user_panel' class='panel panel-default col-md-8'>
						<div class='nav nav-tabs login_tabs'>
							<li class='active'><a id='show_login_tab' class='active_header no_transition' href='#'><h4>Sign in</h1></a></li>
							<li class=''><a id='show_register_tab' class='no_transition' href='#'><h4>Register</h1></a></li>
						</div>
						<button id='close_userpanel' class='close'>x</button>

						<!-- LOGIN PANEL -->
						<div id='login_panel'>

							<!-- REGISTER SUCCESS ALERT -->
							<div id='register_status_alert' class='alert alert-success alert-dissmissable fade in'>
								<button id='close_register_alert' class='close' data-dismiss='alert'>x</button>
								<strong>Registration complete</strong>
								<br>
								An email has been sent to you with a confirmation link
							</div>

							<fieldset>
								<!-- USERNAME FIELD -->
								<div class='input-group'>
									<span class='input-group-addon'><span class='glyphicon glyphicon-user'></span></span>
									<input type='text' placeholder='Username' class='form-control' />
								</div>

								<!-- PASSWORD FIELD -->
								<div class='input-group'>
									<span class='input-group-addon'><span class='glyphicon glyphicon-lock'></span></span>
									<input type='password' placeholder='Password' class='form-control' />
								</div>

								<!-- REMEMBER PASSWORD FIELD -->
								<div class='checkbox'>
									<label><input type='checkbox' value=""><span class='check_text'>Remember me</span></label>
								</div>

								<!-- LOGIN/FORGOT PASSWORD BUTTONS -->
								
								<div class='center_wrapper'>
									<div id='login_controls'>
										<button class='btn btn-default'>Forgot password</button>
										<button id='login_button' class='btn btn-primary ladda-button' data-style='expand-left'><span class='ladda-label'>Login</span></button>
									</div>
								</div>
							</fieldset>
						</div>


						<!-- REGISTER PANEL -->
						<div id='register_panel'>
							<div id='alert_register_fail' class='alert alert-danger alert-dismissable fade in'>
								<strong>Failed to complete registration</strong>
								<br>
								<p id='register_fail_message'></p>
							</div>
							<fieldset>
								<form class='form-horizontal register_form' method='post' action='{{ URL::route("postRegister"); }}'>
								<div class='form-group'>
									<div class='row'>

										<div class='col-lg-4'>
											<h5>Username</h5>
										</div>
										<div class='col-lg-8'>
											<div class='input-group full_input_group full_left_input_group'>
												<span class='input-group-addon username_avail'><strong>Availability</strong></span>	
												<input type='text' class='full_input' name='register_user' placeholder='Username'
												data-trigger='focus' data-toggle='tooltip' data-placement='right' 
												title='Unique username 6-18 alphanumeric characters'>	
											</div>
										</div>
									</div>
								</div>


								<div class='form-group'>
									<div class='row'>

										<div class='col-lg-4'>
											<h5>Password</h5>
										</div>
										<div class='col-lg-8'>
											<div class='input-group full_input_group full_left_input_group'>
												<span id='pass_str_ind' class='input-group-addon username_avail'><strong>Strength</strong></span>
												<input type='password' id='pass_field' class='full_input' name='register_pass' placeholder='Password' 
												data-trigger='focus' data-toggle='tooltip' data-placement='right' 
												title='6-18 alphanumeric character password'/>
											</div>
										</div>
									</div>
								</div>

								<div class='form-group'>
									<div class='row'>

										<div class='col-lg-4'>
											<h5>Repeat password</h5>
										</div>
										<div class='col-lg-8'>
											<div class='input-group full_input_group full_left_input_group'>
												<span id='pass_match_ind' class='input-group-addon username_avail'><strong>Matching</strong></span>
												<input id='pass_match_field' type='password' class='full_input' name='register_rep_pass' placeholder='Repeat password' 
												data-trigger='focus' data-toggle='tooltip' data-placement='right' 
												title='Re-enter your password from above'/>
											</div>
										</div>
									</div>
								</div>


								<div class='form-group'>
									<div class='row'>

										<div class='col-lg-4'>
											<h5>Email</h5>
										</div>
										<div class='col-lg-8'>
											<input type='email' class='full_input' name='register_email' placeholder='Email address' 
											data-trigger='focus' data-toggle='tooltip' data-placement='right' 
											title='Enter valid email address'/>
										</div>
									</div>
								</div>

								<div class='form-group'>
									<div class='row'>

										<div class='col-lg-4'>
											<h5>Display name</h5>
										</div>
										<div class='col-lg-8'>
											<input type='text' class='full_input' name='register_dn' placeholder='Display name' 
											data-trigger='focus' data-toggle='tooltip' data-placement='right' 
											title='Nickname that is displayed in public'/>
										</div>
									</div>
								</div>

									<div class='center_wrapper'>
										<div class='center_contents'>
											<button id='register_cancel' class='btn btn-default'>Cancel</button>
											<button id='register_confirm' class='btn btn-success ladda-button' data-style='expand-left'><span class='ladda-label'>Register</span></button>
										</div>
									</div>
								</form>
							</fieldset>
						</div>

						<!-- TRANSITION PANEL -->
						<div id='transition_panel'>
							{{ HTML::image('resources/images/loading.gif', 'Loading', ['class' => 'transition_loader']) }}
						</div>
					</div>
				</div>
			</div>	
		</div>
	</div>

	<div id='chat_features'>
		<div class='section_circle'>
			<h6><span class='glyphicon glyphicon-heart'></span> Messaging</h6>
		</div>
	</div>

	<div id='security_features'>
		<div class='section_circle'>
			<h6><span class='glyphicon glyphicon-cog'></span> Security</h6>
		</div>
	</div>

	<footer>
		<span class='glyphicon glyphicon-triangle-top bottom_triangle'></span>
	</footer>

@stop
