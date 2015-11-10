<?php

class NotificationsModel extends Eloquent
{
	protected $table	=	'notifications';


	public static function fetchUserNotifications($user)
	{
		return self::where('to', '=', $user)->orderBy('unread')->orderBy('created_at');
	}
}
