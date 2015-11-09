<?php

class UserController extends MasterController
{
	public function postRegister()
	{
		$success_message	=	'An email has been sent to you with a confirmation link';
		$fail_message		=	'Failed to complete registration, please try again';

		$validator			=	Validator::make(Input::all(),
		[
			'register_user'		=>	'required|min:4|unique:users,username',
			'register_pass'		=>	'required|min:6',
			'register_rep_pass'	=>	'required|min:6|same:register_pass',
			'register_email'	=>	'required|email',
			'register_dn'		=>	'required|min:3'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $this->invalid_input_message, self::encodeValidator($validator));
		else
		{
			$user				=	new User();
			$user->username		=	Input::get('register_user');
			$user->password		=	Hash::make(Input::get('register_pass'));
			$user->email		=	Input::get('register_email');
			$user->name			=	Input::get('register_dn');

			if($user->save())
				return self::encodeReturn(true, $success_message);
			else
				return self::encodeReturn(false, $fail_message);
		}	
	}

	public function postLogin()
	{
		$success_message	=	'Successfully logged in';
		$fail_message		=	'Invalid username/password';

		$validator			=	Validator::make(Input::all(),
		[
			'login_user'		=>	'required',
			'login_pass'		=>	'required'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $this->invalid_input_message, self::encodeValidator($validator));
		else
		{
			$auth	=	Auth::attempt
			([
				'username'	=>	Input::get('login_user'),
				'password'	=>	Input::get('login_pass')
			], Input::has('remember_field'));

			if($auth)
				return self::encodeReturn(true, $success_message);
			else
				return self::encodeReturn(false, $fail_message);
		}
	}

	public function postFindPeople()
	{
		$fail_message		=	'No results found';
		$validator			=	Validator::make(Input::all(),
		[
			'search_term'	=>	'required'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $fail_message);
		else
		{
			$searchUser	=	Input::get('search_term');
			$result		=	User::where('username', '=', $searchUser);

			if($result->exists())
				return $result->first();
			else
				return User::where('name', 'LIKE', '%' . $searchUser . '%')->get();
		}
	}

	public function postChangeDP()
	{
		$success_message	=	'Successfully changed display image';
		$fail_message		=	'Failed to change display image';

		$validator	=	Validator::make(Input::all(),
		[
			'new_dp_path'	=>	'required'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $invalid_input_message);
		else
		{
			$user					=	Auth::user();
			$user->profile_image	=	Input::get('new_dp_path');
			if($user->save())
				return self::encodeReturn(true, $success_message);
			else
				return self::encodeReturn(false, $fail_message);
		}
	}

	public function postUpdatePersonalSettings()
	{
		$success_message	=	'Personal settings saved';
		$fail_message		=	'Failed to save personal settings';
		$validator			=	Validator::make(Input::all(),
		[
			'user_dp'		=>	'required',
			'user_email'	=>	'required|email',
			'user_dn'		=>	'required|min:3|max:16'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $this->invalid_input_message, self::encodeValidator($validator));

		else
		{
			$user					=	Auth::user();
			$user->name				=	Input::get('user_dn');
			$user->email			=	Input::get('user_email');
			$user->profile_image	=	Input::get('user_dp');

			if($user->save())
				return self::encodeReturn(true, $success_message);
			else
				return self::encodeReturn(true, $fail_message);	
		}
	}

	public function getUserSettings()
	{
		$user		=	Auth::user();
		$settings	=	['user_dn' => $user->name, 'user_dp' => $user->profile_image, 'user_email' => $user->email];
		return json_encode($settings);
	}


	public function postRequestFriend()
	{

	}


	public function postAcceptFriend()
	{

	}


	public function postRemoveFriend()
	{
	
	}


	public function getFriends()
	{
		$user		=	Auth::user()->username;
		$results	=	FriendsModel::getUsersFriends($user)->select('username', 'name', 'profile_image')->get();
		return json_encode($results);	
	}

	public function getLogout()
	{
		Auth::logout();
	}
}
