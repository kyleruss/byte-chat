<?php

class UserController extends MasterController
{
	public function postRegister()
	{
		$success_message	=	'An email has been sent to you with a confirmation link';
		$fail_message		=	'Failed to complete registration, please try again';
		$user_exists		=	'Username is taken';

		$validator			=	Validator::make(Input::all(),
		[
			'register_user'		=>	'required|min:4|unique:users',
			'register_pass'		=>	'required|min:6',
			'register_rep_pass'	=>	'required|min:6|same:register_pass',
			'register_email'	=>	'required|email',
			'register_dn'		=>	'required|min:3'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $this->invalid_input_message, self::encodeValidator($validator));
			
	}

	public function postLogin()
	{
		
	}
}
