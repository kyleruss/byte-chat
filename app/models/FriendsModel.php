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


	public static function getFriendship($user1, $user2)
	{
		$friendship	=	self::where(function($query) use ($user1, $user2)
		{
			$query->where('from_user', '=', $user1)->where('to_user', '=', $user2);
		})->orWhere(function($query) use ($user1, $user2)
		{
			$query->where('from_user', '=', $user2)->where('to_user', '=', $user1);
		});
		return $friendship;		
	}

	public static function isFriends($user1, $user2)
	{
		return	self::getFriendship($user1, $user2)->exists();
	}
}
