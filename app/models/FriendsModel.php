<?php

class FriendsModel extends Eloquent
{
	protected $table	=	'friendships';

	public static function getUsersFriends($user)
	{
		return self::join('users', function($join) use ($user)
		{
			$join->on('friendships.to_user', '=', 'users.username')
					->where('from_user', '=', $user)
				->orOn('friendships.from_user', '=', 'users.username')
					->where('to_user', '=', $user);
		})->where('pending', '=', 0);
	}
}
