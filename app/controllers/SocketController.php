<?php

class SocketController extends Controller
{
	public function index()
	{
		return View::make('index');
	}

	public function writeMessage()
	{
		return View::make('writeMessage');
	}	

	public function sendMessage()
	{
		$redis	=	NRedis::connection();
		$redis->publish('messagex', json_encode(['user' => 'kyleruss', 'content' => Input::get('message')]));
		return Redirect::route('writeMessage');
	}
}
