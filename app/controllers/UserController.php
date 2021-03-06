<?php

class UserController extends MasterController
{
	public function postRegister()
	{
		$success_message	=	'Your account has been created, you may now log in';
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
			{
				$user = Auth::user();
				$user->online = 1;
				$user->save();
		
				return self::encodeReturn(true, $success_message);
			}

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
				return ['user_found' => $result->select('username', 'name', 'profile_image')->first()];
			else
				return User::where('name', 'LIKE', '%' . $searchUser . '%')->select('username', 'name', 'profile_image')->get();
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
		$success_message	=	'Friend request has been sent';
		$fail_message		=	'Failed to send friend request';
		$already_friend		=	'You are already friends or pending approval with ';

		$validator			=	Validator::make(Input::all(),
		[
			'user_id'		=>	'required'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $this->invalid_input_message);
		else
		{
			$from_user				=	Auth::user()->username;
			$to_user				=	Input::get('user_id');
			if(FriendsModel::isFriends($from_user, $to_user))
				return self::encodeReturn(false, $already_friend . ' ' . $to_user);

			$from_user				=	Auth::user()->username;
			$friendship				=	new FriendsModel();
			$friendship->from_user	=	$from_user;
			$friendship->to_user	=	$to_user;
			$friendship->pending	=	true;
			
			if($friendship->save())
			{
				$notification					=	new NotificationsModel();
				$notification->title			=	'New friend request';
				$notification->content			=	$from_user . ' has requested to be your friend';
				$notification->to				=	$to_user;
				$notification->type				=	1;
				$notification->friendship_id	=	$friendship->id;

				if($notification->save())
					return self::encodeReturn(true, $success_message);
				else
					return self::encodeReturn(false, $fail_message);
			}
			else
				return self::encodeReturn(false, $fail_message);	
		}
	}


	public function postRespondRequestFriend()
	{
		$success_message		=	'User has been added to your friendlist';
		$fail_message			=	'Failed to accept friend request';
		$success_rej_message	=	'Successfully rejected request';
		$fail_rej_message		=	'Failed to reject message';	

		$validator			=	Validator::make(Input::all(),
		[
			'friendship_id'	=>	'required|exists:friendships,id',
			'accept_req'	=>	'required',
			'notifyid'		=>	'required|exists:notifications,id'
		]);
		
		if($validator->fails())
			return self::encodeReturn(false, $fail_message);
		else
		{
			$friendship				=	FriendsModel::find(Input::get('friendship_id'));

			if(Input::get('accept_req'))
			{
				$friendship->pending	=	0;

				if($friendship->save())
				{
					$notification = NotificationsModel::find(Input::get('notifyid'));
					if($notification->delete())
						return self::encodeReturn(true, $success_message, ['friendship' => $friendship->toArray()]);
					else
						return self::encodeReturn(false, $fail_message);
				}
				else
					return self::encodeReturn(false, $fail_message);
			}

			else
			{
				if($friendship->delete())
					return self::encodeReturn(true, $success_rej_message);
				else
					return self::encodeReturn(false, $fail_rej_message);
			}
		}
		
	}


	public function postRemoveFriend()
	{
		$success_message	=	'Successfully removed friend';
		$fail_message		=	'Failed to remove friend';

		$validator			=	Validator::make(Input::all(),
		[
			'friendship_id'	=>	'required|exists:friendships,id'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $this->invalid_input_message);
		else
		{
			$friendship	=	FriendsModel::find(Input::get('friendship_id'));

			if($friendship->delete())
				return self::encodeReturn(true, $success_message);
			else
				return self::encodeReturn(false, $fail_message);
		}
	}


	public function getFriends()
	{
		$user		=	Auth::user()->username;
		$results	=	FriendsModel::getUsersFriends($user)
						->select('username', 'name', 'profile_image', 'id', 'online')
						->orderBy('online', 'desc')
						->orderBy('name')
						->get();

		return json_encode($results);	
	}

	public function getOnlineFriends()
	{
		$user		=	Auth::user()->username;
		$results	=	FriendsModel::getUsersFriends($user)
						->where('online', '=', 1)
						->select('username')
						->get();

		return json_encode($results);
	}

	public function getNotifications()
	{
		$notifications	=	NotificationsModel::fetchUserNotifications(Auth::user()->username)->get();
		return $notifications;
	}

	public function postRemoveNotification()
	{
		$success_message		=	'Successfully removed notification';
		$fail_message			=	'Failed to remove notification';

		$validator				=	Validator::make(Input::all(),
		[
			'notification_id'	=>	'required|exists:notifications,id'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $this->invalid_input_message);

		else
		{
			$notification		=	NotificationsModel::find(Input::get('notification_id'));
			if($notification->delete())
				return self::encodeReturn(true, $success_message);
			else
				return self::encodeReturn(false, $fail_message);
		}
	}


	public function postReadNotification()
	{
		$success_message		=	'Successfully read notification';
		$fail_message			=	'Failed to read notification';

		$validator				=	Validator::make(Input::all(),
		[
			'notification_id'	=>	'required|exists:notifications,id'
		]);

		if($validator->fails())
			return self::encodeReturn(false, $this->invalid_input_message);

		else
		{
			$notification			=	NotificationsModel::find(Input::get('notification_id'));
			$notification->unread	=	false;
			
			if($notification->save())
				return self::encodeReturn(true, $success_message, ['notification' => $notification->toArray()]);
			else
				return self::encodeReturn(false, $fail_message);	
		}
	}

	public function isUsernameAvailable($username)
	{
		if(User::where('username', '=', $username)->exists())
			return 0;
		else
			return 1;
	}

	public function getLogout()
	{
		$user = Auth::user();
		$user->online = 0;
		$user->save();

		Auth::logout();
		return Redirect::route('getHome');
	}
}
