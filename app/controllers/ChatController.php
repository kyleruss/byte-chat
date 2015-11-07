<?php

class ChatController extends MasterController
{
	public function getChatHome()
	{
		return View::make('chat.home');
	}
}
