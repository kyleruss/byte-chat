<?php

class MasterController extends BaseController
{
	public function getHome()
	{
		return View::make('home');
	}

}
